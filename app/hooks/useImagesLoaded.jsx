import { useState, useEffect } from 'react'

const useImagesLoaded = (containerRef) => {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const images = Array.from(containerRef.current.getElementsByTagName('img'))
    if (images.length === 0) {
      setAllImagesLoaded(true)
      return
    }

    let loadedImagesCount = 0
    const imageLoaded = () => {
      loadedImagesCount += 1
      if (loadedImagesCount === images.length) {
        setAllImagesLoaded(true)
      }
    }

    images.forEach((image) => {
      if (image.complete) {
        imageLoaded()
      } else {
        image.addEventListener('load', imageLoaded)
        image.addEventListener('error', imageLoaded) // Consider error as loaded for stability
      }
    })

    // Cleanup listeners
    return () => {
      images.forEach((image) => {
        image.removeEventListener('load', imageLoaded)
        image.removeEventListener('error', imageLoaded)
      })
    }
  }, [containerRef]) // Re-run if the ref changes

  return allImagesLoaded
}

export default useImagesLoaded
