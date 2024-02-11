'use client'

import SectionBuilder from '@/components/SectionBuilder'
import useSWR from 'swr'
import { App, Button, Form, InputNumber, Select } from 'antd'
import { useEffect, useState } from 'react'
import callAxios from '@/helpers/callAxios'
import useSWRImmutable from 'swr/immutable'

const EditLessons = ({ exam }) => {
  const { data, error, isLoading, mutate } = useSWRImmutable(`/exam/${exam.id}/lessons`)

  const [submitLoading, setSubmitLoading] = useState(false)

  const [form] = Form.useForm()
  const { message } = App.useApp()

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ examLesson: data })
    }
  }, [data])

  const handleSubmit = (submitData) => {
    setSubmitLoading(true)

    callAxios
      .put(`/exam/${exam.id}/lessons`, submitData.examLesson)
      .then((res) => {
        message.success('تغییرات با موفقیت ثبت شد ..')
        // form.setFieldsValue({ examLesson: [...res.data] })
        mutate()
      })
      .catch((e) => message.error(e.errorData.msg))
      .finally(() => setSubmitLoading(false))
  }

  return (
    <SectionBuilder
      title='درس ها'
      error={error}
      loading={isLoading}
      empty={data?.length === 0}
      actions={
        <Button type='primary' onClick={(e) => form.submit()} loading={submitLoading}>
          تایید
        </Button>
      }
    >
      <Form form={form} layout={'vertical'} onFinish={handleSubmit} initialValues={{ examLesson: data }}>
        <Form.List name='examLesson'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className='grid grid-cols-4 gap-2 items-center'>
                  <span className='mb-8'>{form.getFieldValue(['examLesson', name, 'lesson', 'title'])} :</span>
                  <Form.Item {...restField} label='نوع' name={[name, 'type']} rules={[{ required: true }]}>
                    <Select
                      options={[
                        {
                          value: 'عمومی',
                          label: 'عمومی',
                        },
                        {
                          value: 'اختصاصی',
                          label: 'اختصاصی',
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item {...restField} label='ضریب' name={[name, 'coefficient']} rules={[{ required: true }]}>
                    <InputNumber min={0} className='w-full' />
                  </Form.Item>
                  <Form.Item {...restField} label='مدت زمان (دقیقه)' name={[name, 'duration']} rules={[{ required: true }]}>
                    <InputNumber min={1} className='w-full' />
                  </Form.Item>
                </div>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </SectionBuilder>
  )
}

export default EditLessons
