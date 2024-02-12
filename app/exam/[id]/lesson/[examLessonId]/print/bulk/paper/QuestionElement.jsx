'use client'

import { useEffect, useRef, useState } from 'react'
import { digitsEnToFa } from '@persian-tools/persian-tools'

const QuestionElement = ({ question, updateQuestionInfo, justHeader, extraHeight = 0 }) => {
  const elementRef = useRef(null)
  const [height, setHeight] = useState(0)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (elementRef.current) {
        const baseHeight = elementRef.current.offsetHeight
        const marginTop = parseInt(window.getComputedStyle(elementRef.current).marginTop)
        const marginBottom = parseInt(window.getComputedStyle(elementRef.current).marginBottom)
        setHeight(baseHeight + marginTop + marginBottom)
      }
    }, 2000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (height > 0) {
      updateQuestionInfo(question, height)
    }
  }, [height])
  return (
    <div>
      <div ref={elementRef} className={classNames('mb-4 px-2 relative', { invisible: justHeader })}>
        <div className='border-2 border-[#6db0af] border-dashed	rounded-md w-full p-5 flex '>
          <div className='absolute top-[-14px] left-1/2 transform -translate-x-1/2'>
            {/*{question.id && <Barcode value={question.id.toString()} height={10} displayValue={false} />}*/}
          </div>
          <span className='ml-1'>{digitsEnToFa(question.question_number)}-</span>
          {/*<span> &ensp;-&ensp;</span>*/}
          <div>
            <div dangerouslySetInnerHTML={{ __html: question.question_text }} className='ck-content' />
            <div style={{ height: `${extraHeight - 5}px` }}></div>
          </div>

          {/*<div className={`h-[${extraHeight}px]`}></div>*/}
        </div>
      </div>
    </div>
  )
}

export default QuestionElement
