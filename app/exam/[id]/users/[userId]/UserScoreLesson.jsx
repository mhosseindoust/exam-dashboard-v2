import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { App, Button, Card, Form, Input, InputNumber } from 'antd'
import callAxios from '@/helpers/callAxios'

const UserScoreLesson = ({ examId, userId, examLessonId }) => {
  const { data, isLoading, error, mutate } = useSWR(`/exam/${examId}/users/${userId}/questions/?exam_lesson_id=${examLessonId}`)
  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)
  const { message } = App.useApp()

  if (isLoading) return <div>loading</div>
  if (error) return <div>error</div>

  const onSubmit = (data) => {
    setSubmitLoading(true)
    const transformedData = data.items.map((item) => ({
      exam_question_id: item.exam_question_id,
      score: item.score,
    }))

    callAxios
      .post(`/exam/${examId}/users/${userId}/questions/?exam_lesson_id=${examLessonId}`, transformedData)
      .then((res) => {
        message.success('تغییرات با موفقیت اعمال شد...')
        form.setFieldsValue({ items: [...res.data] })
        // mutate()
      })
      .catch((e) => console.log(e))
      // .catch((e) => message.error(e.errorData.msg))
      .finally(() => setSubmitLoading(false))
  }

  return (
    <div>
      <Form form={form} onFinish={onSubmit} initialValues={{ items: [...data] }}>
        <Form.List name='items'>
          {(fields) => (
            <div className='grid grid-cols-5 gap-3'>
              {fields.map((field, index) => (
                <div key={field.key}>
                  <Form.Item label={data[index]?.question_number} name={[field.name, 'score']}>
                    <InputNumber
                      min='0'
                      max={data[index]?.question_score}
                      step='0.25'
                      className='w-full'
                      // stringMode
                      controls={{
                        upIcon: <div>+0.25</div>,
                        downIcon: <div>-0.25</div>,
                      }}
                      disabled={submitLoading}
                    />
                  </Form.Item>
                </div>
              ))}
            </div>
          )}
        </Form.List>
        <Form.Item>
          <Button type='primary' htmlType='submit' block loading={submitLoading}>
            تایید
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserScoreLesson

// {data.map((item) => (
//     <div key={item.exam_question_id}>
//       {item.question_number} - <input />
//     </div>
// ))}
