'use client'

import React from 'react'
import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'
import { Table } from 'antd'
import useSWR from 'swr'
import Image from 'next/image'

function Page(props) {
  const { data, error, isLoading } = useSWR(`/exam/grader/scores/`)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'نام و نام خانوادگی',
      render: (_, { first_name, last_name, username }) => `${first_name} ${last_name} (${username})`,
    },
    {
      title: 'آزمون',
      render: (_, { exam_id, exam_title }) => `${exam_title} (${exam_id})`,
    },
    {
      title: 'شماره سوال',
      dataIndex: 'question_number',
    },
    {
      title: 'نمره',
      dataIndex: 'score',
    },
    {
      title: 'پاسخ',
      dataIndex: 'answer_image',
      render: (_) => <Image width={100} height={30} src={_} alt='answer' />,
    },
  ]
  return (
    <div>
      <PageHead title={'تصحیح سوالات'}></PageHead>
      <PageBody>
        <Table size={'small'} columns={columns} dataSource={data} rowKey={(record) => record.id} loading={isLoading} />
      </PageBody>
    </div>
  )
}

export default Page
