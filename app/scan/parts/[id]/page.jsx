'use client'

import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'
import useSWR from 'swr'
import { Badge, Button, Spin, Table, Image } from 'antd'
import Link from 'next/link'

function Page({ params }) {
  const { data, isLoading, error } = useSWR(`/exam/scan-part/${params.id}`)
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'عکس برگه',
      dataIndex: 'image',
      render: (_, { id, is_success }) => (
        <Badge count={is_success ? 'موفق' : 'ناموفق'} color={is_success ? 'green' : 'red'}>
          <Image
            width={500}
            placeholder={
              <div>
                <Spin spinning />
              </div>
            }
            src={_}
          />
        </Badge>
      ),
    },
    // {
    //   title: 'عکس کراپ نشده',
    //   dataIndex: 'image_uncropped',
    //   render: (_, { id }) => (
    //     <Badge count={`aa ${id}`}>
    //       <Image
    //         width={500}
    //         placeholder={
    //           <div>
    //             <Spin spinning />
    //           </div>
    //         }
    //         src={_}
    //       />
    //     </Badge>
    //   ),
    // },
    // {
    //   title: 'موفق',
    //   dataIndex: 'is_success',
    // render: (_) => _.filter((f) => !f.is_success).length,
    // },
  ]
  return (
    <div>
      <PageHead title='لیست برگه ها' breadcrumbList={[{ title: 'لیست برگه ها' }]} />
      <PageBody error={error} loading={isLoading}>
        <Table
          size='small'
          columns={columns}
          dataSource={data?.papers.filter((f) => !f.is_success)}
          rowKey={(record) => record.id}
          loading={isLoading}
          pagination={false}
        />
      </PageBody>
    </div>
  )
}

export default Page
