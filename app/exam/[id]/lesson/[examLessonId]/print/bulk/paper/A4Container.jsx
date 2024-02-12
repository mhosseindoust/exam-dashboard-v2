import React from 'react'
import { Barcode } from 'react-flaticons'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import PaperHeaderImg from '../../../../../../../../public/images/paper/header.png'
import classNames from 'classnames'
import Image from 'next/image'

const A4Container = ({
  token = '',
  firstName = '',
  lastName = '',
  gradeTitle = '',
  title = '',
  duration = '',
  schoolTitle = '',
  classRoomTitle = '',
  lessonTitle = '',
  pageNumber = 0,
  examUserId = '',
  agencyTitle = '',
  justHeader,
  lessonId,
  children,
}) => {
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

          {/*<Image alt='paperHeader' src={PaperHeaderImg} sizes='100vw' className={justHeader && 'invisible'} />*/}
          <div className={`absolute top-[27px] left-1/2 transform -translate-x-1/2 z-20 ${justHeader && 'invisible'}`}>
            {lessonId && (
              <Barcode textMargin={100} value={`${lessonId}-${pageNumber}`} height={7} background={null} displayValue={false} />
            )}
          </div>
          <div className='absolute top-[34px] left-1/2 transform -translate-x-1/2 '>
            <div className='w-40 h-3 bg-white z-10'></div>
          </div>
          <div className='absolute grid grid-cols-7 top-14 right-11 gap-1 w-[80%]'>
            <div className='space-y-2 col-span-3'>
              <p>
                <span className={justHeader && 'invisible'}>نام : </span>
                <span>{firstName}</span>
              </p>

              <p>
                <span className={justHeader && 'invisible'}>نام خانوادگی : </span>
                <span>{lastName}</span>
              </p>

              {agencyTitle ? (
                <p>
                  <span className={justHeader && 'invisible'}>مدرسه : </span>
                  <span>
                    {schoolTitle} ({agencyTitle})
                  </span>
                </p>
              ) : (
                <p>
                  <span className={justHeader && 'invisible'}>مدرسه : </span>
                  <span>{schoolTitle}</span>
                </p>
              )}
            </div>
            <div className='text-center col-span-2'>
              <p>{title}</p>
              <p>{token ? `(${token})` : ''}</p>
            </div>
            <div className='space-y-2 col-span-2'>
              {duration ? (
                <p>
                  <span className={justHeader && 'invisible'}>مدت : </span>
                  <span>{digitsEnToFa(duration)} دقیقه</span>
                </p>
              ) : (
                <p>
                  <span className={justHeader && 'invisible'}>مدت : </span>
                  <span>{digitsEnToFa(duration)}</span>
                </p>
              )}
              <p>
                <span className={justHeader && 'invisible'}>پایه : </span>
                <span>{gradeTitle}</span>
              </p>

              <p>
                <span className={justHeader && 'invisible'}>کلاس : </span>
                <span>{digitsEnToFa(classRoomTitle)}</span>
              </p>
            </div>
          </div>
          <div className='absolute bottom-0.5 left-14 text-white'>{lessonTitle}</div>
          <div className='absolute bottom-[30px] left-1/2 transform -translate-x-1/2 '>
            {examUserId ? (
              <Barcode value={`-${examUserId}-`} height={10} displayValue={false} />
            ) : (
              <div className='h-10 flex items-center justify-center w-72 bg-white'></div>
            )}
          </div>
        </div>
      </header>
      {children}
      <footer className={classNames('flex justify-center items-center', { invisible: justHeader })}>
        <div className='bg-[#6db0af] rounded-full flex justify-center items-center h-10 w-10'>
          <span className='text-white'>{digitsEnToFa(pageNumber)}</span>
        </div>
      </footer>
    </div>
  )
}

export default A4Container
