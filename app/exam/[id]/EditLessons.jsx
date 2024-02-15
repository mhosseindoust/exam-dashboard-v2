'use client'

import SectionBuilder from '@/components/SectionBuilder'
import useSWR from 'swr'
import { App, Button, Form, InputNumber, Select, Table } from 'antd'
import { useEffect, useState } from 'react'
import callAxios from '@/helpers/callAxios'
import useSWRImmutable from 'swr/immutable'
import Link from 'next/link'

const EditLessons = ({ exam }) => {
  const { data, error, isLoading, mutate } = useSWRImmutable(`/exam/${exam.id}/lessons`)
  console.log(data)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'درس',
      dataIndex: ['lesson', 'title'],
    },
    {
      title: 'نوع',
      dataIndex: 'type',
    },
    {
      title: 'ضریب',
      dataIndex: 'coefficient',
    },
    {
      title: 'مدت زمان (دقیقه)',
      dataIndex: 'duration',
    },
    {
      title: 'عملیات',
      width: 100,
      render: (_, { id }) => {
        return (
          <div className='flex gap-5 justify-center items-center'>
            <Link href={`/exam/${exam.id}/lesson/${id}/print/bulk/paper`} prefetch={false}>
              <Button type='primary' size='small'>
                چاپ برگه خام
              </Button>
            </Link>

            <Button disabled type='primary' size='small'>
              چاپ سربرگ
            </Button>
            <Button disabled type='primary' size='small'>
              چاپ
            </Button>
          </div>
        )
      },
    },
  ]
  // const [submitLoading, setSubmitLoading] = useState(false)

  // const [form] = Form.useForm()
  // const { message } = App.useApp()

  // useEffect(() => {
  //   if (data) {
  //     form.setFieldsValue({ examLesson: data })
  //   }
  // }, [data])

  // const handleSubmit = (submitData) => {
  //   setSubmitLoading(true)
  //
  //   callAxios
  //     .put(`/exam/${exam.id}/lessons`, submitData.examLesson)
  //     .then((res) => {
  //       message.success('تغییرات با موفقیت ثبت شد ..')
  //       // form.setFieldsValue({ examLesson: [...res.data] })
  //       mutate()
  //     })
  //     .catch((e) => message.error(e.errorData.msg))
  //     .finally(() => setSubmitLoading(false))
  // }

  return (
    <SectionBuilder
      title='درس ها'
      error={error}
      loading={isLoading}
      empty={data?.length === 0}
      className='mb-5'
      // actions={
      //   <Button type='primary' onClick={(e) => form.submit()} loading={submitLoading}>
      //     تایید
      //   </Button>
      // }
    >
      <div>
        <Table
          size='small'
          columns={columns}
          dataSource={data}
          loading={isLoading}
          rowKey={(record) => record.id}
          pagination={false}
        />
      </div>
      {/*<Form form={form} layout={'vertical'} onFinish={handleSubmit} initialValues={{ examLesson: data }}>*/}
      {/*  <Form.List name='examLesson'>*/}
      {/*    {(fields, { add, remove }) => (*/}
      {/*      <>*/}
      {/*        {fields.map(({ key, name, ...restField }) => (*/}
      {/*          <div key={key} className='grid grid-cols-4 gap-2 items-center'>*/}
      {/*            <span className='mb-8'>{form.getFieldValue(['examLesson', name, 'lesson', 'title'])} :</span>*/}
      {/*            <Form.Item {...restField} label='نوع' name={[name, 'type']} rules={[{ required: true }]}>*/}
      {/*              <Select*/}
      {/*                options={[*/}
      {/*                  {*/}
      {/*                    value: 'عمومی',*/}
      {/*                    label: 'عمومی',*/}
      {/*                  },*/}
      {/*                  {*/}
      {/*                    value: 'اختصاصی',*/}
      {/*                    label: 'اختصاصی',*/}
      {/*                  },*/}
      {/*                ]}*/}
      {/*              />*/}
      {/*            </Form.Item>*/}
      {/*            <Form.Item {...restField} label='ضریب' name={[name, 'coefficient']} rules={[{ required: true }]}>*/}
      {/*              <InputNumber min={0} className='w-full' />*/}
      {/*            </Form.Item>*/}
      {/*            <Form.Item {...restField} label='مدت زمان (دقیقه)' name={[name, 'duration']} rules={[{ required: true }]}>*/}
      {/*              <InputNumber min={1} className='w-full' />*/}
      {/*            </Form.Item>*/}
      {/*          </div>*/}
      {/*        ))}*/}
      {/*      </>*/}
      {/*    )}*/}
      {/*  </Form.List>*/}
      {/*</Form>*/}
    </SectionBuilder>
  )
}

export default EditLessons
