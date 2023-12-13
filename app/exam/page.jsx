'use client'

import React, { useState } from 'react'
import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'
import { Badge, Button, Modal, Table, Tooltip } from 'antd'
import useSWR from 'swr'
import Link from 'next/link'
import { UtcToPersianDateTime } from '@/utils/dateFormat'
import classnames from 'classnames'
import LessonsModal from '@/exam/LessonsModal'
import { Refresh } from 'react-flaticons'
import ExamSyncModal from '@/exam/ExamSyncModal'

function Page(props) {
  const { data, isLoading, error } = useSWR('/exam/')
  const [examLessonSelected, setExamLessonSelected] = useState(null)
  const [examSyncSelected, setExamSyncSelected] = useState(null)

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
      render: (record, { id, user_question_count, user_question_corrected_count }) => (
        <div
          className={classnames('w-20 text-white text-center rounded hover:cursor-pointer select-none', {
            'bg-green-600 hover:bg-green-500 ': user_question_count === user_question_corrected_count,
            'bg-primary hover:bg-primary/80': user_question_count !== user_question_corrected_count,
          })}
          onClick={() => setExamLessonSelected(record)}
        >
          {user_question_corrected_count} / {user_question_count}
        </div>
      ),
    },
    {
      title: 'اعمال',
      width: '10%',
      render: (record, { id }) => (
        <div className='flex items-center justify-center gap-3'>
          <Link href={`/exam/${id}/users`}>
            <Button size='small'>دانش آموزان</Button>
          </Link>

          {/*<Tooltip title='کارنامه ها'>*/}
          {/*  <Link href={`/exam/${record.id}/schools`}>*/}
          {/*    <Button icon={<Ballot />} size={'small'} />*/}
          {/*  </Link>*/}
          {/*</Tooltip>*/}
          <Tooltip title='همگام سازی'>
            <Button size='small' icon={<Refresh className='p-0.5' />} onClick={() => setExamSyncSelected(record)} />
          </Tooltip>
          {/*<Tooltip title='پردازش'>*/}
          {/*  <Popconfirm*/}
          {/*    title='پردازش'*/}
          {/*    description='آیا میخواهید آزمون پردازش شود ؟'*/}
          {/*    onConfirm={() => processExam(record.id)}*/}
          {/*    okButtonProps={{*/}
          {/*      loading: confirmProcessLoading,*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <Button size={'small'} icon={<Gears />} />*/}
          {/*  </Popconfirm>*/}
          {/*</Tooltip>*/}
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
      {examLessonSelected && <LessonsModal exam={examLessonSelected} setExam={setExamLessonSelected} />}
      {examSyncSelected && <ExamSyncModal exam={examSyncSelected} setExam={setExamSyncSelected} />}
    </div>
  )
}

export default Page
