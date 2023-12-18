import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Button, Card, Form, Input } from 'antd'

const UserScoreLesson = ({ examId, userId, examLessonId }) => {
  const { data, isLoading, error } = useSWR(`/exam/${examId}/users/${userId}/questions/?exam_lesson_id=${examLessonId}`)
  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)

  if (isLoading) return <div>loading</div>
  if (error) return <div>error</div>

  return (
    <div>
      <Form form={form} onFinish={(e) => console.log(e)} initialValues={{ items: [...data] }}>
        <Form.List name='items'>
          {(fields) => (
            <div className='grid grid-cols-5 gap-3'>
              {fields.map((field, index) => (
                <div key={field.key}>
                  <Form.Item label={data[index]?.question_number} name={[field.name, 'score']}>
                    <Input />
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
