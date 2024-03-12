'use client'

import { useEffect, useRef } from 'react'
import useImagesLoaded from '@/hooks/useImagesLoaded'
import { App } from 'antd'
import callAxios from '@/helpers/callAxios'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import Barcode from 'react-barcode'

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

      if (!question.height) {
        callAxios
          .patch(`/exam/${examId}/questions/${question.id}/`, { height: height, height_with_margin: heightWithMargin })
          .then((res) => {
            message.success(`ارتفاع سوال ${question.question_number} ثبت شد`)
            mutate()
          })
          .catch((e) => message.error(e.errorData.msg))
      }
    }
  }, [allImagesLoaded])

  return (
    <>
      <div ref={questionRef} className='mx-2 mb-4 relative'>
        <div className='border-2 border-dashed border-[#6db0af] rounded-md p-3 w-full'>
          <div className='flex'>
            <span className='ml-1'>{digitsEnToFa(question.question_number)}-</span>
            <span className='ck-content flex-1' dangerouslySetInnerHTML={{ __html: question.question_text }} />
          </div>
          <span className='absolute left-1/2 -translate-x-1/2 -top-2'>
            <Barcode
              value={question.id.toString()}
              height={15}
              displayValue={false}
              margin={0}
              marginRight={10}
              marginLeft={10}
            />
          </span>
        </div>
      </div>
    </>
  )
}

export default CalculateQuestion
