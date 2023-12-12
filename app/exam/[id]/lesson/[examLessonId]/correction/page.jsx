'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'
import { Badge, Button, Form, InputNumber, Table, Image, Spin, App } from 'antd'
import { Check, Cross, Marker } from 'react-flaticons'
import useSWRImmutable from 'swr/immutable'
import callAxios from '@/helpers/callAxios'

function Page({ params }) {
  const { id: examId, examLessonId } = params

  const { data, error, isLoading, mutate } = useSWR(`/exam/${examId}/lessons/${examLessonId}/corrections`)
  const { data: examData } = useSWRImmutable(`/exam/${examId}`)
  const { data: lessonData } = useSWRImmutable(`/exam/${examId}/lessons`)
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const { message } = App.useApp()

  const edit = (record) => {
    form.setFieldsValue({ score: record.score })
    setEditingKey(record.id)
    console.log(record)
  }

  const onSubmit = (values) => {
    setSubmitLoading(true)
    callAxios
      .post('/exam/grader/scores/', { score: values['score'], question_score_id: editingKey })
      .then((response) => {
        mutate()
        message.success('نمره با موفقیت ثبت شد')
        setEditingKey(null)
      })
      .catch((e) => message.error(e.errorData.msg))
      .finally(() => setSubmitLoading(false))

    console.log(values)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'نام و نام خانوادگی',
      width: '50%',
      render: (_, { first_name, last_name, username }) => `${first_name} ${last_name} (${username})`,
    },
    // {
    //   title: 'آزمون',
    //   render: (_, { exam_id, exam_title }) => `${exam_title} (${exam_id})`,
    // },
    // {
    //   title: 'شماره سوال',
    //   width: '150px',
    //   dataIndex: 'question_number',
    // },
    {
      title: 'نمره',
      width: '185px',
      render: (record, { id, score }) => (
        <div>
          {id === editingKey ? (
            <div className='flex items-center gap-2'>
              <Form.Item name='score' rules={[{ required: true }]} className='mb-0  '>
                <InputNumber
                  min='0'
                  max={record.question_score}
                  step='0.25'
                  // stringMode
                  controls={{
                    upIcon: <div>+0.25</div>,
                    downIcon: <div>-0.25</div>,
                  }}
                  disabled={submitLoading}
                />
              </Form.Item>
              <Button loading={submitLoading} onClick={() => setEditingKey('')} icon={<Cross width='10px' />}></Button>
              <Button loading={submitLoading} type='primary' onClick={() => form.submit()} icon={<Check width='10px' />}></Button>
            </div>
          ) : score !== null ? (
            <div
              className='cursor-pointer hover:border-solid hover:border-gray-200 hover:px-3 transition-all'
              onClick={() => edit(record)}
            >
              {score}
            </div>
          ) : (
            <Button block onClick={() => edit(record)}>
              ورود نمره
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'پاسخ',
      dataIndex: 'answer_image',
      render: (_, { question_number }) => (
        <Badge count={`سوال ${question_number}`}>
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
  ]

  return (
    <div>
      <PageHead
        title={'تصحیح سوالات'}
        breadcrumbList={[
          { title: 'آزمون ها', path: '/exam' },
          { title: examData && examData.title, path: `/exam/${examId}` },
          { title: `تصحیح درس ${lessonData && lessonData.find((f) => f.id == examLessonId).lesson.title}` },
        ]}
      ></PageHead>
      <PageBody error={error}>
        <Form form={form} component={false} onFinish={onSubmit}>
          <Table
            size={'small'}
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
            loading={isLoading}
            // components={{
            //   body: {
            //     cell: EditableCell,
            //   },
            // }}
            // columns={mergedColumns}
            pagination={{
              onChange: () => setEditingKey(null),
            }}
            bordered
          />
        </Form>
      </PageBody>
    </div>
  )
}

export default Page
