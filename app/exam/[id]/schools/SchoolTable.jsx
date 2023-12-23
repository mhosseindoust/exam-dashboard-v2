'use client'

import React from 'react'
import useSWR from 'swr'
import { Button, Table } from 'antd'
import Link from 'next/link'

const SchoolTable = ({ exam }) => {
  const { data, isLoading, error } = useSWR(`/exam/${exam.id}/schools/`)

  const columns = [
    {
      title: 'ID',
      width: '10%',
      dataIndex: 'id',
    },
    {
      title: 'عنوان',
      dataIndex: 'title',
    },
    {
      title: 'اعمال',
      width: '25%',
      render: (_, record) => (
        <div className='grid grid-cols-2 gap-3'>
          <Link href={`/exam/${exam.id}/schools/${record.id}/report`}>
            <Button size='small'>پرینت کارنامه ها</Button>
          </Link>
          <Link href={`/exam/${exam.id}/schools/${record.id}/reportTotal`}>
            <Button size={'small'}>پرینت کارنامه مشاوره</Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div>
      <Table
        size={'small'}
        columns={columns}
        dataSource={data}
        loading={isLoading}
        rowKey={(record) => record.id}
        pagination={{ defaultPageSize: 50 }}
      />
    </div>
  )
}

export default SchoolTable
