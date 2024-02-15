'use client'

import { digitsEnToFa } from '@persian-tools/persian-tools'
import Barcode from 'react-barcode'

const Question = ({ question, extraSpace = 0 }) => {
  console.log(extraSpace)
  return (
    <div className='mx-2 mb-4 relative' style={{ height: `${question.height + extraSpace}px` }}>
      <div className=' border-2 border-dashed border-[#6db0af] rounded-md p-3 w-full'>
        <div className='flex'>
          <span className='ml-1'>{digitsEnToFa(question.question_number)}-</span>
          <span className='ck-content' dangerouslySetInnerHTML={{ __html: question.question_text }} />
        </div>
        <span className='absolute left-1/2 -translate-x-1/2 -top-2'>
          <Barcode value={question.id.toString()} height={15} displayValue={false} margin={0} marginRight={10} marginLeft={10} />
        </span>
        <div style={{ height: `${extraSpace}px` }}></div>
      </div>
    </div>
  )
}

export default Question
