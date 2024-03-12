'use client'

import { App, Button, Form, Input, InputNumber, Modal, Select, Skeleton } from 'antd'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import callAxios from '@/helpers/callAxios'
import { usePathname, useRouter } from 'next/navigation'

const QuestionModal = ({ question, examId, examLessonId, visible, onClose }) => {
  const [submitLoading, setSubmitLoading] = useState(false)

  const [form] = Form.useForm()
  const { message } = App.useApp()
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const handleSubmit = (submitData) => {
    setSubmitLoading(true)
    callAxios
      .put(`/exam/${examId}/questions/${question.id}/advance/`, submitData)
      .then(() => {
        message.success('سوال با موفقیت تغییر کرد...')
        onClose()
        mutate(`/exam/${examId}/questions/print/?exam_lesson_id=${examLessonId}`)
        router.refresh()
        // window.location.reload()
      })
      .catch((e) => message.error(e.errorData.msg))
      .finally(() => setSubmitLoading(false))
  }

  return (
    <Modal
      title='ویرایش سوال'
      width={1288}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key='back' onClick={onClose}>
          انصراف
        </Button>,
        <Button loading={submitLoading} key='submit' type='primary' onClick={() => form.submit()}>
          ویرایش
        </Button>,
      ]}
    >
      <QuestionForm examId={examId} question={question} form={form} handleSubmit={handleSubmit} />
    </Modal>
  )
}

const Editor = dynamic(() => import('../../../../../../../components/TextEditor'), {
  loading: () => <Skeleton.Input active block />,
  ssr: true,
})

const QuestionForm = ({ examId, question, form, handleSubmit }) => {
  console.log(question)

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout='vertical'
      className='grid grid-cols-3 gap-x-2'
      initialValues={{ ...question, lesson_id: question.exam_lesson.lesson.id, topic_id: question.topic.id }}
    >
      <Form.Item name='type' hidden>
        <Input />
      </Form.Item>
      <Form.Item name='lesson_id' hidden>
        <Input />
      </Form.Item>
      <Form.Item name='topic_id' hidden>
        <Input />
      </Form.Item>
      <Form.Item name='answer_text' hidden>
        <Input />
      </Form.Item>

      <Form.Item label='شماره سوال' name='question_number' rules={[{ required: true }]}>
        <InputNumber min={1} className='w-full' />
      </Form.Item>
      <Form.Item label='بارم سوال' name='score' rules={[{ required: true }]}>
        <InputNumber min={0} className='w-full' />
      </Form.Item>
      <Form.Item label='ارتفاع' name='height'>
        <InputNumber className='w-full' placeholder={question.height} />
      </Form.Item>
      <Form.Item
        name='question_text'
        label='سوال'
        rules={[{ required: true, message: 'فیلد سوال اجباریست' }]}
        className='col-span-full'
      >
        <Editor onChange={() => form.setFieldValue('height', null)} />
      </Form.Item>
    </Form>
  )
}

export default QuestionModal
