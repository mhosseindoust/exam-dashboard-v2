'use client'

import { useEffect, useRef } from 'react'
import useImagesLoaded from '@/hooks/useImagesLoaded'
import { App } from 'antd'
import callAxios from '@/helpers/callAxios'
import { digitsEnToFa } from '@persian-tools/persian-tools'

const CalculateQuestion = ({ examId, question, mutate }) => {
  const questionRef = useRef(null)
  const allImagesLoaded = useImagesLoaded(questionRef)
  const { message } = App.useApp()

  useEffect(() => {
    if (allImagesLoaded) {
      const height = questionRef.current.offsetHeight
      const style = window.getComputedStyle(questionRef.current)
      const marginTop = parseInt(style.marginTop, 10)
      const marginBottom = parseInt(style.marginBottom, 10)
      const heightWithMargin = questionRef.current.offsetHeight + marginTop + marginBottom

      callAxios
        .patch(`/exam/${examId}/questions/${question.id}/`, { height: height, height_with_margin: heightWithMargin })
        .then((res) => {
          message.success(`ارتفاع سوال ${question.question_number} ثبت شد`)
          mutate()
        })
        .catch((e) => message.error(e.errorData.msg))
    }
  }, [allImagesLoaded])

  return (
    <div ref={questionRef} className='mx-2 mb-4'>
      <div className='flex border-2 border-dashed border-[#6db0af] rounded-md p-3 w-full'>
        <span className='ml-1'>{digitsEnToFa(question.question_number)}-</span>
        <span className='ck-content' dangerouslySetInnerHTML={{ __html: question.question_text }} />
      </div>
    </div>
  )
}

export default CalculateQuestion
