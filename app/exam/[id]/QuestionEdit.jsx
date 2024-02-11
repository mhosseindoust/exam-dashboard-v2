'use client'

import { App, Button, Form, Input, InputNumber, Modal, Select } from 'antd'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const { TextArea } = Input

const QuestionEdit = ({ exam, question, onClose }) => {
  return (
    <Modal title='ایجاد سوال' width={1288} footer={null} open={question} onOk={onClose} onCancel={onClose}>
      <QuestionEditForm exam={exam} question={question} onClose={onClose} />
    </Modal>
  )
}

const QuestionEditForm = ({ exam, question, onClose }) => {
  const { data: lessonData, isLoading } = useSWR(`/lessons/?grades=${exam.grade.id}`)

  const [submitLoading, setSubmitLoading] = useState(false)

  const [form] = Form.useForm()
  const { message } = App.useApp()
  const { mutate } = useSWRConfig()

  const handleSubmit = () => {}

  console.log(question)

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout='vertical'
      className='grid grid-cols-3 gap-x-2'
      initialValues={{ ...question, lesson_id: question.exam_lesson.lesson.id, topic_id: question.topic.id }}
    >
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
      <Form.Item name='lesson_id' label='درس' rules={[{ required: true }]}>
        <Select
          disabled={isLoading}
          loading={isLoading}
          options={lessonData?.map((lesson) => ({
            label: `${lesson.title} ( ${lesson.grades.map((grade) => `${grade.title} ${grade.base_grade}`)} )`,
            value: lesson.id,
          }))}
          onChange={() => form.setFieldValue('topic_id', null)}
        />
      </Form.Item>
      <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.lesson_id !== curValues.lesson_id}>
        {() => {
          return (
            <Form.Item name='topic_id' label='موضوع' rules={[{ required: true }]}>
              <Select
                disabled={!form.getFieldValue('lesson_id')}
                options={
                  form.getFieldValue('lesson_id') &&
                  lessonData
                    .find((f) => f.id == form.getFieldValue('lesson_id'))
                    .topics.map((topic) => ({ label: topic.title, value: topic.id }))
                }
              />
            </Form.Item>
          )
        }}
      </Form.Item>
      <Form.Item label='شماره سوال' name='question_number' rules={[{ required: true }]}>
        <InputNumber min={1} className='w-full' />
      </Form.Item>
      <Form.Item label='بارم سوال' name='score' rules={[{ required: true }]}>
        <InputNumber min={0} className='w-full' />
      </Form.Item>
      <QuestionText />
      <AnswerText />
      <Button className='col-span-3' type='primary' htmlType='submit' loading={submitLoading}>
        تایید
      </Button>
    </Form>
  )
}

export const QuestionText = (props) => {
  const Editor = dynamic(() => import('../../components/TextEditor'), {
    loading: () => (
      <Form.Item name='question_text' rules={[{ required: true, message: 'فیلد سوال اجباریست' }]} className='col-span-full'>
        <TextArea placeholder='سوال خود را وارد کنید...' />
      </Form.Item>
    ),
    ssr: true,
  })

  return (
    <Form.Item name='question_text' rules={[{ required: true, message: 'فیلد سوال اجباریست' }]} className='col-span-full'>
      <Editor placeholder='سوال خود را وارد کنید...' />
    </Form.Item>
  )
}

export const AnswerText = (props) => {
  const Editor = dynamic(() => import('../../components/TextEditor'), {
    loading: () => (
      <Form.Item name='answer_text' rules={[{ required: true, message: 'فیلد سوال اجباریست' }]} className='col-span-full'>
        <TextArea placeholder='پاسخ خود را وارد کنید...' autoSize />
      </Form.Item>
    ),
    ssr: true,
  })

  return (
    <Form.Item name='answer_text' className='col-span-full'>
      <Editor placeholder='پاسخ خود را وارد کنید...' autoSize />
    </Form.Item>
  )
}

export default QuestionEdit
