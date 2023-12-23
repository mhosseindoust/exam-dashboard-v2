'use client'

import React from 'react'

const ReportSection = ({ data }) => {
  return (
    <div>
      <style jsx>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          @page {
            margin: 0;
            size: landscape;
          }
        }
      `}</style>
      <style jsx global>{`
        body {
          background-color: unset;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }

        td,
        th {
          border: 1px solid #dddddd;
          text-align: center;
          padding: 8px;
        }
      `}</style>
      <div key={data.score_id} className='mt-[0.6cm] text-black mx-[0.8cm] break-after-page'>
        <div className='flex text-[10px] justify-end space-x-[0.6cm] space-x-reverse '>
          <div className='w-[5cm]'>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>نام و نام خانوادگی:</span>
              <span className='pr-[1cm]'>{data.user.full_name}</span>
            </p>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>شماره داوطلب:</span>
              <span className='pr-[1cm]'>{data.user.username}</span>
            </p>
          </div>
          <div className='w-[5cm] '>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>واحد آموزشی:</span>
              <span className='pr-[1cm]'>{data.school.title}</span>
            </p>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>کلاس:</span>
              <span className='pr-[0.5cm]'>{data.classroom.title}</span>
            </p>
          </div>
          <div className='w-[5cm]'>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>آزمون:</span>
              <span className='pr-[0.5cm]'>{data.exam.title}</span>
            </p>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>تاریخ گزارش:</span>
              <span className='pr-[1cm]'> {new Date(data.report_time).toLocaleDateString('fa-IR')}</span>
            </p>
          </div>
        </div>
        <div className='text-[11px] mt-[0.3cm]'>
          <table>
            <thead className='bg-gray-50'>
              <th>دروس آزمون</th>
              <th>تاریخ برگزاری</th>
              <th>وضعیت</th>
              <th>وضعیت کلاس</th>
              <th>وضعیت مدرسه</th>
            </thead>
            <tbody>
              <tr>
                <td>{data.lesson.title}</td>
                <td> {new Date(data.exam.start_date_time).toLocaleDateString('fa-IR')}</td>
                <td>{data.lesson.status_title}</td>
                <td>{data.lesson.status_classroom_title}</td>
                <td>{data.lesson.status_school_title}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='text-[11px] grid grid-cols-2 mt-10 gap-10'>
          <div>
            <h2>بررسی عملکرد دانش آموز در هر سوال</h2>
            <table>
              <thead className='bg-gray-50'>
                <th>شماره سوال</th>
                <th>موضوع</th>
                <th>وضعیت</th>
              </thead>
              <tbody>
                {data.questions.map((item) => (
                  <tr key={data.score_id + '-' + item.question_number}>
                    <td>{item.question_number}</td>
                    <td>{item.topic_title}</td>
                    <td>{item.status_title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2>بررسی وضعیت دانش آموز در موضوعات درسی</h2>

            <table>
              <thead className='bg-gray-100'>
                <th>موضوع</th>
                <th>وضعیت</th>
              </thead>
              <tbody>
                {data.topics.map((item) => (
                  <tr key={data.score_id + '-' + item.topic_title}>
                    <td>{item.topic_title}</td>
                    <td>{item.status_title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportSection
