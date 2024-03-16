'use client'

import { Table } from 'antd'
import SectionBuilder from '@/components/SectionBuilder'

const ReportSection = ({ report, item }) => {
  return (
    <SectionBuilder
      className='mb-5'
      key={item.exam_user_score_id}
      title={`${item.lesson.title} (${new Date(report.exam.start_date_time).toLocaleDateString('fa-IR')})`}
      actions={
        <div className='flex justify-center items-center gap-5'>
          <div className=' flex flex-col justify-center items-center'>
            <p>وضعیت</p>
            <p>{item.lesson.status_title}</p>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <p>وضعیت کلاس</p>
            <p>{item.lesson.status_classroom_title}</p>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <p>وضعیت مدرسه</p>
            <p>{item.lesson.status_school_title}</p>
          </div>
        </div>
      }
    >
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <h2>بررسی عملکرد دانش آموز در هر سوال</h2>
          <Table
            dataSource={item.questions}
            size='small'
            pagination={false}
            columns={[
              {
                title: 'شماره سوال',
                dataIndex: 'question_number',
              },
              {
                title: 'موضوع',
                dataIndex: 'topic_title',
              },
              {
                title: 'وضعیت',
                dataIndex: 'status_title',
              },
            ]}
          />
        </div>
        <div>
          <h2>بررسی وضعیت دانش آموز در موضوعات درسی</h2>
          <Table
            dataSource={item.topics}
            size='small'
            pagination={false}
            columns={[
              {
                title: 'موضوع',
                dataIndex: 'topic_title',
              },
              {
                title: 'وضعیت',
                dataIndex: 'status_title',
              },
            ]}
          />
        </div>
      </div>
    </SectionBuilder>
  )
}

export default ReportSection
