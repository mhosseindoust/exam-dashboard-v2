'use client'

import { digitsEnToFa } from '@persian-tools/persian-tools'
import Barcode from 'react-barcode'

const HEADER_HEIGHT = 230 // Adjust based on your layout

const PaperSection = ({ examLesson, headers }) => {
  if (headers.length === 0) return <div className=' w-[210mm] bg-white'></div>
  return (
    <div className='print:bg-white'>
      {headers.map((header) => (
        <div key={header.id}>
          <div className=' w-[210mm] break-before-page bg-white mb-1 print:mb-0'>
            <Header examLesson={examLesson} header={header} />
          </div>
          <div className=' w-[210mm] break-before-page bg-white mb-1 print:mb-0'>
            <Header examLesson={examLesson} header={header} />
          </div>
        </div>
      ))}
    </div>
  )
}

const Header = ({ examLesson, header }) => {
  return (
    <div style={{ height: HEADER_HEIGHT }} className='relative '>
      <span className='absolute left-1/2 -translate-x-1/2 top-5'></span>

      <div className='absolute top-14 right-12 w-[80%] grid grid-cols-7'>
        <div className='col-span-3'>
          <p>
            <span className='invisible'>نام : </span>
            <span>{digitsEnToFa(header.user.first_name)}</span>
          </p>
          <p>
            <span className='invisible'>نام خانوادگی : </span>
            <span>{digitsEnToFa(header.user.last_name)}</span>
          </p>
          <p>
            <span className='invisible'>مدرسه : </span>
            <span>{digitsEnToFa(header.user.classroom.school.title)}</span>
          </p>
        </div>
        <div className='col-span-2 text-center'>
          <p>{digitsEnToFa(header.exam.title)}</p>
          <p>({digitsEnToFa(header.user.token)})</p>
        </div>
        <div className='col-span-2'>
          <p>
            <span className='invisible'>مدت : </span>
            <span>{digitsEnToFa(examLesson.duration)} دقیقه</span>
          </p>
          <p>
            <span className='invisible'>پایه : </span>
            <span>{digitsEnToFa(header.exam.grade.full_title)}</span>
          </p>
          <p>
            <span className='invisible'>کلاس : </span>
            <span>{digitsEnToFa(header.user.classroom.title)}</span>
          </p>
        </div>
      </div>
      <span className='absolute left-1/2 -translate-x-1/2 bottom-10'>
        <div className='w-72 h-10 bg-white'></div>
      </span>

      <span className='absolute left-1/2 -translate-x-1/2 bottom-7'>
        <Barcode value={`-${header.id}-`} height={15} displayValue={false} />
      </span>
    </div>
  )
}
export default PaperSection
