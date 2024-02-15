'use client'

import PaperHeaderImg from '../../../../../../../../public/images/paper/header.png'
import Image from 'next/image'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import Barcode from 'react-barcode'

const A4Container = ({ children, pageNumber, HeaderHeight, FooterHeight, examLesson }) => {
  return (
    <div className='page relative'>
      <Header height={`${HeaderHeight}px`} examLesson={examLesson} pageNumber={pageNumber} />
      <div>{children}</div>
      <Footer height={`${FooterHeight}px`} pageNumber={pageNumber} />
    </div>
  )
}

const Header = ({ height, examLesson, pageNumber }) => {
  return (
    <div style={{ height: height }} className='relative'>
      <Image
        src={PaperHeaderImg}
        alt='paper header'
        sizes='100vw'
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
      <span className='absolute left-1/2 -translate-x-1/2 top-5'>
        <Barcode value={`${examLesson.lesson.id}-${pageNumber}`} height={15} displayValue={false} />
      </span>

      <div className='absolute bottom-1 left-14 text-white'>{examLesson.lesson.title}</div>
      <div className='absolute top-14 right-12 w-[80%] grid grid-cols-7'>
        <div className='col-span-3 space-y-2'>
          <p>نام :</p>
          <p>نام خانوادگی :</p>
          <p>مدرسه :</p>
        </div>
        <div className='col-span-2 text-center'></div>
        <div className='col-span-2 space-y-2'>
          <p>مدت :</p>
          <p>پایه :</p>
          <p>کلاس :</p>
        </div>
      </div>
      <span className='absolute left-1/2 -translate-x-1/2 bottom-10'>
        <div className='w-72 h-10 bg-white'></div>
      </span>
    </div>
  )
}

const Footer = ({ height, pageNumber }) => {
  return (
    <div style={{ height: height }} className='absolute w-full bottom-0'>
      <div className='flex justify-center items-center'>
        <div className='bg-[#6db0af] rounded-full flex justify-center items-center h-10 w-10'>
          <span className='text-white'>{digitsEnToFa(pageNumber)}</span>
        </div>
      </div>
    </div>
  )
}

export default A4Container
