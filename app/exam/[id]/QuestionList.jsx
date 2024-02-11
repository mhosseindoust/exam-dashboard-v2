'use client'

import SectionBuilder from '@/components/SectionBuilder'
import useSWR from 'swr'
import { Alert, App, Button, Collapse, Popconfirm, Tabs } from 'antd'
import { useState } from 'react'
import QuestionCreate from '@/exam/[id]/QuestionCreate'
import _ from 'lodash'
import { Edit, Spinner, Trash } from 'react-flaticons'
import callAxios from '@/helpers/callAxios'
import QuestionEdit from '@/exam/[id]/QuestionEdit'

const QuestionList = ({ exam }) => {
  const { data, error, isLoading, mutate } = useSWR(`/exam/${exam.id}/questions/`)

  const [questionCreateVisible, setQuestionCreateVisible] = useState(false)
  const [questionEdit, SetQuestionEdit] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { message } = App.useApp()

  const deleteQuestion = (questionId) => {
    setDeleteLoading(true)
    callAxios
      .delete(`/exam/${exam.id}/questions/${questionId}/`)
      .then((response) => {
        message.success('سوال با موفقیت حذف شد')
        mutate().then(() => setDeleteLoading(false))
      })
      .catch((e) => {
        message.error(e.errorData.msg)
        setDeleteLoading(false)
      })
  }

  return (
    <div>
      <SectionBuilder
        title='سوال ها'
        className='mb-5'
        error={error}
        loading={isLoading}
        empty={data?.length === 0}
        actions={<Button onClick={() => setQuestionCreateVisible(true)}>ایجاد سوال</Button>}
      >
        <Tabs
          defaultActiveKey='1'
          type='card'
          items={_(data)
            .groupBy((x) => x.exam_lesson.lesson.id)
            .map((value, key) => ({
              label: value[0].exam_lesson.lesson.title,
              key: key,
              children: (
                <Collapse
                  collapsible='icon'
                  items={value.map((question) => ({
                    key: question.id,
                    label: `${question.question_number} - ${question.topic.title} (${question.score} نمره)`,
                    children: (
                      <div>
                        <div dangerouslySetInnerHTML={{ __html: question.question_text }} className='mb-2 ck-content' />
                        <div className='clear-both'>
                          <Alert
                            message={
                              <div>
                                <div className='font-bold'>پاسخ :</div>
                                <div dangerouslySetInnerHTML={{ __html: question.answer_text }} className='ck-content' />
                              </div>
                            }
                            type='info'
                          />
                        </div>
                      </div>
                    ),
                    extra: (
                      <div className='flex self-center items-center space-x-2 space-x-reverse'>
                        <span className='text-gray-400 text-xs'>{question.type}</span>
                        <Edit width='1rem' className='cursor-pointer' onClick={() => SetQuestionEdit(question)} />

                        <Popconfirm
                          title='حذف'
                          description='میخواهید این سوال را حذف کنید ؟'
                          onConfirm={() => deleteQuestion(question.id)}
                          okText='بله'
                          cancelText='خیر'
                          okButtonProps={{
                            loading: deleteLoading,
                          }}
                        >
                          {deleteLoading ? (
                            <Spinner width='1rem' className='animate-spin fill-gray-500' />
                          ) : (
                            <Trash width='1rem' className='cursor-pointer' onClick={() => SetQuestionEdit(question)} />
                          )}
                        </Popconfirm>
                      </div>
                    ),
                  }))}
                />
              ),
            }))
            .value()}
        />
      </SectionBuilder>
      <QuestionCreate exam={exam} visible={questionCreateVisible} onClose={() => setQuestionCreateVisible(false)} />
      <QuestionEdit exam={exam} question={questionEdit} onClose={() => SetQuestionEdit(null)} />
    </div>
  )
}

export default QuestionList
