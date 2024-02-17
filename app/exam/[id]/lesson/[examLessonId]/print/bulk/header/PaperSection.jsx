'use client'

import { digitsEnToFa } from '@persian-tools/persian-tools'
import Barcode from 'react-barcode'
import { Badge } from 'antd'

const HEADER_HEIGHT = 230 // Adjust based on your layout

const PaperSection = ({ examLesson, headers, margins }) => {
  if (headers.length === 0) return <div className=' w-[210mm] bg-white'></div>

  return (
    <div className='print:bg-white'>
      {headers.map((header, index) => {
        const firstPageNumber = 1 + index * 2
        const secondPageNumber = 2 + index * 2

        return (
          <div key={header.id}>
            <div className=' w-[210mm] break-before-page bg-white mb-1 print:mb-0'>
              <Header
                examLesson={examLesson}
                header={header}
                margins={margins}
                pageNumber={digitsEnToFa(String(firstPageNumber))}
              />
            </div>
            <div className=' w-[210mm] break-before-page bg-white mb-1 print:mb-0'>
              <Header
                examLesson={examLesson}
                header={header}
                margins={margins}
                pageNumber={digitsEnToFa(String(secondPageNumber))}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const Header = ({ examLesson, header, margins, pageNumber }) => {
  const headerStyle = {
    marginRight: margins.right + 'mm',
    marginLeft: margins.left + 'mm',
    height: HEADER_HEIGHT,
  }

  return (
    <>
      <div style={{ height: `${margins.top}px` }}></div>
      <div style={headerStyle} className='relative '>
        <span className='absolute left-1/2 -translate-x-1/2 top-5'></span>

        <div className='absolute top-14 right-12 w-[80%] grid grid-cols-7'>
          <div className='col-span-3'>
            <p className='mb-2'>
              <span className='invisible'>نام : </span>
              <span>{digitsEnToFa(header.user.first_name)}</span>
            </p>
            <p className='mb-3'>
              <span className='invisible'>نام خانوادگی : </span>
              <span>{digitsEnToFa(header.user.last_name)}</span>
            </p>
            <p className='mb-3'>
              <span className='invisible'>مدرسه : </span>
              <span>
                {digitsEnToFa(header.user.classroom.school.title)} ({digitsEnToFa(header.user.agency.name)})
              </span>
            </p>
          </div>
          <div className='col-span-2 text-center'>
            <p>{digitsEnToFa(header.exam.title)}</p>
            <p>({digitsEnToFa(header.user.token)})</p>
          </div>
          <div className='col-span-2'>
            <p className='mb-2'>
              <span className='invisible'>مدت : </span>
              <span>{digitsEnToFa(examLesson.duration)} دقیقه</span>
            </p>
            <p className='mb-3'>
              <span className='invisible'>پایه : </span>
              <span>{digitsEnToFa(header.exam.grade.full_title)}</span>
            </p>
            <p className='mb-3'>
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

        <span className='absolute bottom-0 right-0 mr-4 mb-4 print:hidden'>
          <Badge count={pageNumber} />
        </span>
      </div>
      <div style={{ height: `${margins.bottom}px` }}></div>
    </>
  )
}
export default PaperSection
