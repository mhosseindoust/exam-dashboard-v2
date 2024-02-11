'use client'

import { App, Button, Drawer, Form, Input, InputNumber, Select, Space, TreeSelect } from 'antd'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import callAxios from '@/helpers/callAxios'
import { DatePickerJalali, DateTimePickerJalali } from '@/components/DatePickerJalali'
import { Plus } from 'react-flaticons'

export default function ExamCreate(props) {
  const { mutate } = useSWRConfig()
  const { message } = App.useApp()
  const [open, setOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const { data: gradeData, error, isLoading: gradeLoading } = useSWR('/grades/')
  const router = useRouter()
  const handelSubmit = (data) => {
    setSubmitLoading(true)

    callAxios
      .post('/exam/', data)
      .then((response) => {
        message.success('آزمون با موفقیت ایجاد شد...')
        mutate('/exam/')
        router.push(`/exam/${response.data.id}`)
      })
      .catch((e) => {
        message.error(e.errorData.msg)
        setSubmitLoading(false)
      })
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)} icon={<Plus width='1rem' />} className='flex '>
        ایجاد آزمون
      </Button>
      <Drawer
        title='ایجاد آزمون'
        placement='left'
        onClose={() => setOpen(false)}
        open={open}
        extra={
          <Space>
            <Button loading={submitLoading} type='primary' onClick={() => form.submit()}>
              تایید
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          initialValues={{ type: 'تشریحی' }}
          onFinish={handelSubmit}
          // onFinishFailed={(e) => message.error('فیلدها را بصورت صحیح وارد کنید')}
          // autoComplete='off'
          layout={'vertical'}
        >
          <Form.Item label='عنوان' name='title' rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name='type' label='نوع' rules={[{ required: true }]}>
            <Select
              options={[
                {
                  value: 'تشریحی',
                  label: 'تشریحی',
                },
                {
                  value: 'تستی',
                  label: 'تستی',
                  disabled: true,
                },
              ]}
            />
          </Form.Item>
          <Form.Item label='تاریخ' name='start_datetime' rules={[{ required: true }]}>
            <DateTimePickerJalali />
          </Form.Item>
          <Form.Item label='مدت زمان (دقیقه)' name='duration' rules={[{ required: true }]}>
            <InputNumber min={1} className='w-full' />
          </Form.Item>
          <Form.Item label='پایه تحصیلی' name='grade_id' rules={[{ required: true }]}>
            <TreeSelect fieldNames={{ label: 'title', value: 'id' }} treeData={gradeData} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}
