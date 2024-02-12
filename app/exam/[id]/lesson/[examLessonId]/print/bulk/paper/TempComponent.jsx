'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Switch } from 'antd'
import PaperSection from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/PaperSection'

const TempComponent = ({ lesson, questions }) => {
  const [fullLoad, setFullLoad] = useState(false)
  // =================================================================
  const [heightContainer, setHeightContainer] = useState(0)
  const containerRef = useRef(null)
  useEffect(() => {
    if (containerRef.current) {
      setHeightContainer(containerRef.current.offsetHeight)
    }
  }, [containerRef.current])
  // =================================================================
  const [listQuestions, setListQuestions] = useState([])
  const updateQuestionInfo = (question, newHeight) => {
    setListQuestions((prevQuestionsInfo) => {
      const existingIndex = prevQuestionsInfo.findIndex((q) => q.id === question.id)
      if (existingIndex !== -1) {
        return [
          ...prevQuestionsInfo.slice(0, existingIndex),
          { ...prevQuestionsInfo[existingIndex], ...question, height: newHeight },
          ...prevQuestionsInfo.slice(existingIndex + 1),
        ]
      } else {
        return [...prevQuestionsInfo, { ...question, height: newHeight }]
      }
    })
  }
  // =================================================================
  const [imagesLoaded, setImagesLoaded] = useState(false)
  useEffect(() => {
    const images = document.getElementsByTagName('img')
    let imagesLoaded = 0

    function countLoaded() {
      imagesLoaded++
      if (imagesLoaded === images.length) {
        setImagesLoaded(true)
      }
    }

    for (let i = 0; i < images.length; i++) {
      if (!images[i].src || images[i].complete) {
        countLoaded()
      } else {
        images[i].addEventListener('load', countLoaded)
        images[i].addEventListener('error', countLoaded)
      }
    }

    return () => {
      for (let i = 0; i < images.length; i++) {
        images[i].removeEventListener('load', countLoaded)
        images[i].removeEventListener('error', countLoaded)
      }
    }
  }, [])
  // =================================================================
  const [Pages, setPages] = useState([])

  useEffect(() => {
    if (
      heightContainer > 0 &&
      listQuestions.length > 0 &&
      listQuestions.length === questions.length &&
      imagesLoaded &&
      !fullLoad
    ) {
      let listPages = [{ number: 1, questions: [] }]
      let remainingHeight = heightContainer

      listQuestions.forEach((question) => {
        let lastPage = listPages[listPages.length - 1]

        if (question.height <= remainingHeight) {
          lastPage.questions.push(question)
          remainingHeight -= question.height
        } else {
          listPages = listPages.map((obj) => {
            if (obj.number === lastPage.number) {
              return { ...obj, remainingHeight: remainingHeight }
            }
            return obj
          })
          remainingHeight = heightContainer
          listPages.push({ number: lastPage.number + 1, questions: [] })
          lastPage = listPages[listPages.length - 1]
          lastPage.questions.push(question)
          remainingHeight -= question.height
        }
      })

      if (listPages.length % 2 !== 0) {
        listPages.push({ number: listPages[listPages.length - 1].number + 1, questions: [] })
      }
      setPages(listPages)
      setFullLoad(true)
    }
  }, [listQuestions, heightContainer, imagesLoaded, questions, Pages])

  return (
    <div className='flex gap-2'>
      <div className='m-2 p-5 rounded-xl bg-gray-400 w-full space-y-2 print:hidden'>
        <Button type='primary' block onClick={() => window.print()}>
          چاپ
        </Button>
        <Button block onClick={() => setFullLoad(false)}>
          تنظیم مجدد
        </Button>
      </div>
      <div className='m-2 print:m-0 p-5 print:p-0 rounded-xl bg-gray-400'>
        <PaperSection
          questions={questions}
          fullLoad={fullLoad}
          Pages={Pages}
          lessonSelected={lesson}
          containerRef={containerRef}
          updateQuestionInfo={updateQuestionInfo}
        />
      </div>
    </div>
  )
}

export default TempComponent
