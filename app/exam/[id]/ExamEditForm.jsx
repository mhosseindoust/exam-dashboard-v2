'use client'

import SectionBuilder from '@/components/SectionBuilder'
import { App, Button, Form, Input, InputNumber, Select, TreeSelect } from 'antd'
import { convertUTCDateToUnix } from '@/utils/dateFormat'
import { useState } from 'react'
import { DateTimePickerJalali } from '@/components/DatePickerJalali'
import useSWR from 'swr'
import callAxios from '@/helpers/callAxios'
import { useRouter } from 'next/navigation'

const ExamEditForm = ({ exam }) => {
  const { data: gradeData, error, isLoading: gradeLoading } = useSWR('/grades/')

  const [submitLoading, setSubmitLoading] = useState(false)

  const [form] = Form.useForm()
  const { message } = App.useApp()
  const router = useRouter()

  const handelSubmit = (submitData) => {
    setSubmitLoading(true)

    callAxios
      .put(`/exam/${exam.id}`, submitData)
      .then((response) => {
        message.success('تغییرات با موفقیت ثبت شد...')
        form.setFieldsValue({
          ...response.data,
          grade_id: response.data.grade.id,
          start_datetime: convertUTCDateToUnix(response.data.start_datetime),
        })
        router.refresh()
      })
      .catch((e) => message.error(e.errorData.msg))
      .finally(() => setSubmitLoading(false))
  }

  return (
    <SectionBuilder
      title='مشخصات آزمون'
      actions={
        <Button type='primary' onClick={(e) => form.submit()} loading={submitLoading}>
          تایید
        </Button>
      }
    >
      <Form
        form={form}
        initialValues={{
          ...exam,
          grade_id: exam.grade.id,
          start_datetime: convertUTCDateToUnix(exam.start_datetime),
        }}
        onFinish={handelSubmit}
        layout='vertical'
        className='grid grid-cols-3 gap-x-2'
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
        <Form.Item name='question_paper_type' label='نوع جداکردن دفترچه' rules={[{ required: true }]}>
          <Select
            disabled
            options={[
              {
                value: 'کامل',
                label: 'بدون جدا کردن',
              },
              {
                value: 'درس',
                label: 'درس به درس',
              },
              {
                value: 'نوع درس',
                label: 'اختصاصی عمومی',
              },
            ]}
          />
        </Form.Item>
      </Form>
    </SectionBuilder>
  )
}

export default ExamEditForm
