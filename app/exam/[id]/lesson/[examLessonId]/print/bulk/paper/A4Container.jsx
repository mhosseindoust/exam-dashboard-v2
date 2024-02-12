import React from 'react'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import PaperHeaderImg from '../../../../../../../../public/images/paper/header.png'
import classNames from 'classnames'
import Image from 'next/image'
import Barcode from 'react-barcode'

const A4Container = ({ lessonTitle = '', pageNumber = 0, lessonId, children }) => {
  return (
    <div className='w-[210mm] h-[297mm] flex flex-col bg-white  px-2 pt-3 pb-2 mb-2 print:mb-0 page'>
      <header className='w-full flex px-2 rounded-lg mb-2'>
        <div className='relative '>
          <Image
            src={PaperHeaderImg}
            alt='paper header'
            sizes='100vw'
            style={{
              width: '100%',
              height: 'auto',
            }}
          />

          <div className='absolute top-[27px] left-1/2 transform -translate-x-1/2 z-20'>
            <Barcode value={`${lessonId}-${pageNumber}`} height={15} displayValue={false} />
          </div>
          <div className='absolute top-[34px] left-1/2 transform -translate-x-1/2 '>
            <div className='w-40 h-3 bg-white z-10'></div>
          </div>
          <div className='absolute grid grid-cols-7 top-14 right-11 gap-1 w-[80%]'>
            <div className='space-y-2 col-span-3'>
              <p>
                <span>نام : </span>
              </p>

              <p>
                <span>نام خانوادگی : </span>
              </p>

              <p>
                <span>مدرسه : </span>
              </p>
            </div>
            <div className='text-center col-span-2'></div>
            <div className='space-y-2 col-span-2'>
              <p>
                <span>مدت : </span>
              </p>
              <p>
                <span>پایه : </span>
              </p>

              <p>
                <span>کلاس : </span>
              </p>
            </div>
          </div>
          <div className='absolute bottom-0.5 left-14 text-white'>{lessonTitle}</div>
          <div className='absolute bottom-[30px] left-1/2 transform -translate-x-1/2 '>
            <div className='h-10 flex items-center justify-center w-72 bg-white'></div>
          </div>
        </div>
      </header>
      {children}
      <footer className='flex justify-center items-center'>
        <div className='bg-[#6db0af] rounded-full flex justify-center items-center h-10 w-10'>
          <span className='text-white'>{digitsEnToFa(pageNumber)}</span>
        </div>
      </footer>
    </div>
  )
}

export default A4Container
