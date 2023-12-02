'use client'

import dynamic from 'next/dynamic'

const DWT = dynamic(() => import('../components/DWT'), {
  ssr: false,
})

export default function Page(props) {
  const handleScan = (DWObject, settings) => {
    const { scanner, adf, duplex, showUi, pixelType, resolution } = settings

    const deviceConfiguration = {
      SelectSourceByIndex: scanner,
      IfFeederEnabled: adf,
      IfDuplexEnabled: duplex,
      IfShowUI: showUi,
      PixelType: pixelType,
      Resolution: resolution,

      // IfShowIndicator: true,
      // IfDisableSourceAfterAcquire: true,

      // IfGetImageInfo: true,
      // IfGetExtImageInfo: true,
      // extendedImageInfoQueryLevel: 1,

      // IfDisableSourceAfterAcquire: true,
      // IfGetImageInfo: true,
      // IfGetExtImageInfo: true,
      // extendedImageInfoQueryLevel: 0,
    }

    DWObject.AcquireImage(
      deviceConfiguration,
      (e) => console.log(e),
      (e) => console.log(e),
    )
  }

  const handleWebTWAINReady = (DWObject) => {
    console.log(DWObject)
    DWObject.RegisterEvent('OnPreTransfer', function () {
      let numberOfImages = DWObject.HowManyImagesInBuffer
      console.log(numberOfImages)
    })
    // let numberOfImages = instance.HowManyImagesInBuffer
    // console.log(numberOfImages)
    // let imageId = instance.IndexToImageID(0)
    // console.log(imageId)
    // if (duplex) {
    //   if (numberOfImages % 2 === 0) {
    //     instance.CancelAllPendingTransfers()
    //   }
    // } else {
    //   instance.CancelAllPendingTransfers()
    // }
    // })
  }

  return (
    <div>
      <DWT scan={handleScan} onWebTWAINReady={handleWebTWAINReady} />
    </div>
  )
}
