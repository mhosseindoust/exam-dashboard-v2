'use client'

import React, { useState } from 'react'
import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'
import { Badge, Modal, Table } from 'antd'
import useSWR from 'swr'
import Link from 'next/link'
import { UtcToPersianDateTime } from '@/utils/dateFormat'
import classnames from 'classnames'
import LessonsModal from '@/exam/LessonsModal'

function Page(props) {
  const { data, isLoading, error } = useSWR('/exam/')
  const [examSelected, setExamSelected] = useState(null)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'عنوان',
      dataIndex: 'title',
      render: (_, { id }) => <Link href={`/exam/${id}`}>{_}</Link>,
    },
    {
      title: 'نوع',
      dataIndex: 'type',
    },
    {
      title: 'تاریخ',
      dataIndex: 'start_datetime',
      render: (_) => <div>{UtcToPersianDateTime(_)}</div>,
    },
    {
      title: 'مدت زمان (دقیقه)',
      dataIndex: 'duration',
    },
    {
      title: 'پایه',
      dataIndex: ['grade', 'full_title'],
    },
    {
      title: 'سوالات ',
      render: (_, { id, user_question_count, user_question_corrected_count }) => (
        <div
          className={classnames('w-20 text-white text-center rounded hover:cursor-pointer select-none', {
            'bg-green-600 hover:bg-green-500 ': user_question_count === user_question_corrected_count,
            'bg-primary hover:bg-primary/80': user_question_count !== user_question_corrected_count,
          })}
          onClick={() => setExamSelected(id)}
        >
          {user_question_corrected_count} / {user_question_count}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHead title='آزمون ها' breadcrumbList={[{ title: 'آزمون ها' }]}>
        <div></div>
      </PageHead>
      <PageBody error={error} loading={isLoading}>
        <Table size={'small'} columns={columns} dataSource={data} rowKey={(record) => record.id} loading={isLoading} />
      </PageBody>
      {examSelected && <LessonsModal exam_id={examSelected} />}
    </div>
  )
}

export default Page
