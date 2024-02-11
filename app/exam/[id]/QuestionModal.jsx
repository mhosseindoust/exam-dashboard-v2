'use client'

import { App, Button, Form, Input, InputNumber, Modal, Select, Skeleton, Spin } from 'antd'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import callAxios from '@/helpers/callAxios'

const { TextArea } = Input

const QuestionModal = ({ exam, question, visible, onClose }) => {
  const [submitLoading, setSubmitLoading] = useState(false)

  const [form] = Form.useForm()
  const { message } = App.useApp()
  const { mutate } = useSWRConfig()

  const handleSubmit = (submitData) => {
    setSubmitLoading(true)
    if (question) {
      callAxios
        .put(`/exam/${exam.id}/questions/${question.id}/advance/`, submitData)
        .then((response) => {
          message.success('سوال با موفقیت تغییر کرد...')
          mutate(`/exam/${exam.id}/questions/`)
          mutate(`/exam/${exam.id}/lessons`)
          form.resetFields()
          onClose()
        })
        .catch((e) => message.error(e.errorData.msg))
        .finally(() => setSubmitLoading(false))
    } else {
      callAxios
        .post(`/exam/${exam.id}/questions/advance/`, submitData)
        .then((response) => {
          message.success('سوال با موفقیت ایجاد شد ..')
          mutate(`/exam/${exam.id}/questions/`)
          mutate(`/exam/${exam.id}/lessons`)
          form.resetFields()
          onClose()
        })
        .catch((e) => message.error(e.errorData.msg))
        .finally(() => setSubmitLoading(false))
    }
  }

  return (
    <Modal
      title={`${question ? 'ویرایش' : 'ایجاد'} سوال`}
      width={1288}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key='back' onClick={onClose}>
          انصراف
        </Button>,
        <Button loading={submitLoading} key='submit' type='primary' onClick={() => form.submit()}>
          {question ? 'ویرایش' : 'ایجاد'}
        </Button>,
      ]}
    >
      <QuestionForm exam={exam} question={question} form={form} onClose={onClose} handleSubmit={handleSubmit} />
    </Modal>
  )
}

const Editor = dynamic(() => import('../../components/TextEditor'), {
  loading: () => <Skeleton.Input active block />,
  ssr: true,
})

const QuestionForm = ({ exam, question, form, onClose, handleSubmit }) => {
  const { data: lessonData, isLoading: lessonLoading } = useSWR(`/lessons/?grades=${exam.grade.id}`)

  const initialValues = question
    ? { ...question, lesson_id: question.exam_lesson.lesson.id, topic_id: question.topic.id }
    : { type: 'تشریحی' }

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout='vertical'
      className='grid grid-cols-3 gap-x-2'
      initialValues={initialValues}
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
          disabled={lessonLoading}
          loading={lessonLoading}
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
                  lessonData &&
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
      <Form.Item
        name='question_text'
        label='سوال'
        rules={[{ required: true, message: 'فیلد سوال اجباریست' }]}
        className='col-span-full'
      >
        <Editor />
      </Form.Item>
      <Form.Item name='answer_text' label='پاسخ' className='col-span-full'>
        <Editor />
      </Form.Item>
    </Form>
  )
}

export default QuestionModal
