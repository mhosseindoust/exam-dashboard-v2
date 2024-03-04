'use client'

import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'
import useSWR from 'swr'
import { Button, Table } from 'antd'
import Link from 'next/link'

function Page(props) {
  const { data, isLoading, error } = useSWR('/exam/scan-part/')
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'زمان ایجاد',
      dataIndex: 'created_at',
      render: (_) => new Date(_).toLocaleDateString('fa-IR'),
    },
    {
      title: 'کامل شده',
      dataIndex: 'papers',
      render: (_) => _.filter((f) => f.is_success).length,
    },
    {
      title: 'مشکل دار',
      dataIndex: 'papers',
      render: (_) => _.filter((f) => !f.is_success).length,
      sorter: (a, b) => a.papers.filter((f) => !f.is_success).length - b.papers.filter((f) => !f.is_success).length,
      defaultSortOrder: 'descend',
    },
    {
      title: 'کل برگه ها',
      dataIndex: 'papers',
      render: (_) => _.length,
    },
    {
      title: 'عملیات',
      width: 100,
      render: (_, { id }) => {
        return (
          <div className='flex gap-5 justify-center items-center'>
            <Link href={`/scan/parts/${id}`} prefetch={false}>
              <Button type='primary' size='small'>
                بررسی برگه ها
              </Button>
            </Link>
          </div>
        )
      },
    },
  ]
  return (
    <div>
      <PageHead title='دسته های اسکن' breadcrumbList={[{ title: 'دسته های اسکن' }]} />
      <PageBody error={error} loading={isLoading}>
        <Table size='small' columns={columns} dataSource={data} rowKey={(record) => record.id} loading={isLoading} />
      </PageBody>
    </div>
  )
}

export default Page
