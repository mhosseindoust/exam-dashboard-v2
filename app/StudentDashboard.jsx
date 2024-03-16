'use client'

import PageHead from '@/components/PageHead'
import { Button, Table } from 'antd'
import PageBody from '@/components/PageBody'
import useSWR from 'swr'
import { UtcToPersianDateTime } from '@/utils/dateFormat'
import Link from 'next/link'

const StudentDashboard = ({ user }) => {
  const { data, isLoading, error } = useSWR('/exam/')
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'عنوان',
      dataIndex: 'title',
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
      title: 'اعمال',
      width: '10%',
      render: (record, { id }) => (
        <div className='flex items-center justify-center gap-3'>
          <Link href={`/exam/${id}/users/${user.id}/report`} prefetch={false}>
            <Button size='small'>کارنامه</Button>
          </Link>
        </div>
      ),
    },
  ]
  return (
    <div>
      <PageHead title='آزمون ها' breadcrumbList={[{ title: 'آزمون ها' }]} />
      <PageBody error={error} loading={isLoading}>
        <Table size='small' columns={columns} dataSource={data} rowKey={(record) => record.id} loading={isLoading} />
      </PageBody>
    </div>
  )
}

export default StudentDashboard
