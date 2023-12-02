'use client'

import React from 'react'
import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'
import { Table } from 'antd'
import useSWR from 'swr'
import Link from 'next/link'
import { UtcToPersianDateTime } from '@/utils/dateFormat'

function Page(props) {
  const { data, isLoading, error } = useSWR('/exam/')

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
  ]

  return (
    <div>
      <PageHead title='آزمون ها' breadcrumbList={[{ title: 'آزمون ها' }]}>
        <div></div>
      </PageHead>
      <PageBody error={error} loading={isLoading}>
        <Table size={'small'} columns={columns} dataSource={data} rowKey={(record) => record.id} loading={isLoading} />
      </PageBody>
    </div>
  )
}

export default Page
