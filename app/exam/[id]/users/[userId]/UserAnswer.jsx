'use client'

import React, { useState } from 'react'
import SectionBuilder from '@/components/SectionBuilder'
import useSWR from 'swr'
import { Badge, Button, Form, Input, InputNumber, Spin, Table, Image } from 'antd'
import { Check, Cross } from 'react-flaticons'

const UserAnswer = ({ userId, examId }) => {
  const { data, isLoading, error } = useSWR(`/exam/${examId}/users/${userId}/corrections`)
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  const edit = (record) => {
    form.setFieldsValue({ score: record.score })
    setEditingKey(record.id)
    console.log(record)
  }

  const onSubmit = (values) => {
    // setSubmitLoading(true)
    // callAxios
    //     .post('/exam/grader/scores/', { score: values['score'], question_score_id: editingKey })
    //     .then((response) => {
    //       mutate()
    //       message.success('نمره با موفقیت ثبت شد')
    //       setEditingKey(null)
    //     })
    //     .catch((e) => message.error(e.errorData.msg))
    //     .finally(() => setSubmitLoading(false))

    console.log(values)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'نام و نام خانوادگی',
      render: (_, { full_name, username }) => `${full_name} (${username})`,
    },
    {
      title: 'نمایندگی',
      dataIndex: ['agency', 'name'],
    },
    {
      title: 'مدرسه',
      dataIndex: ['school', 'title'],
    },
    {
      title: 'کلاس',
      dataIndex: ['classroom', 'title'],
    },

    {
      title: 'نمره',
      width: '185px',
      render: (record, { id, score }) => (
        <div>{score}</div>
        // <div>
        //   {id === editingKey ? (
        //     <div className='flex items-center gap-2'>
        //       <Form.Item name='score' rules={[{ required: true }]} className='mb-0  '>
        //         <InputNumber
        //           min='0'
        //           max={record.question_score}
        //           step='0.25'
        //           // stringMode
        //           controls={{
        //             upIcon: <div>+0.25</div>,
        //             downIcon: <div>-0.25</div>,
        //           }}
        //           disabled={submitLoading}
        //         />
        //       </Form.Item>
        //       <Button loading={submitLoading} onClick={() => setEditingKey('')} icon={<Cross width='10px' />}></Button>
        //       <Button loading={submitLoading} type='primary' onClick={() => form.submit()} icon={<Check width='10px' />}></Button>
        //     </div>
        //   ) : score !== null ? (
        //     <div
        //     className='cursor-pointer hover:border-solid hover:border-gray-200 hover:px-3 transition-all'
        //     onClick={() => edit(record)}
        //     >
        //       {score}
        //     </div>
        //   ) : (
        //     <Button block onClick={() => edit(record)}>
        //       ورود نمره
        //     </Button>
        //   )}
        // </div>
      ),
    },
    {
      title: 'سوالات',
      filters: Array.from(new Set(data?.map((item) => item.question_number)))
        .sort((a, b) => a - b)
        .map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => record.question_number === value,
      dataIndex: 'answer_image',
      render: (_, { question_number }) => (
        <div className='flex justify-center'>
          <Badge count={`سوال ${question_number}`}>
            <Image
              width={200}
              placeholder={
                <div>
                  <Spin spinning />
                </div>
              }
              src={_}
            />
          </Badge>
        </div>
      ),
    },
  ]

  if (isLoading) return <SectionBuilder title='لیست پاسخ ها' loading />
  if (error) return <SectionBuilder title='لیست پاسخ ها' error />

  return (
    <SectionBuilder title='لیست پاسخ ها'>
      <Form form={form} component={false} onFinish={onSubmit}>
        <Table
          size={'small'}
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          loading={isLoading}
          pagination={false}
          bordered
        />
      </Form>
    </SectionBuilder>
  )
}

export default UserAnswer
