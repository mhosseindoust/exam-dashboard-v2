'use client'

import SectionBuilder from '@/components/SectionBuilder'
import useSWR, { useSWRConfig } from 'swr'
import { Alert, App, Button, Collapse, Tabs } from 'antd'
import { useState } from 'react'
import _ from 'lodash'
import { Edit, Trash } from 'react-flaticons'
import callAxios from '@/helpers/callAxios'
import QuestionModal from '@/exam/[id]/QuestionModal'

const QuestionList = ({ exam }) => {
  const { data, error, isLoading, mutate } = useSWR(`/exam/${exam.id}/questions/`)
  const [modalState, setModalState] = useState({ visible: false, question: null })

  const showCreateModal = () => setModalState({ visible: true, question: null })
  const showEditModal = (question) => setModalState({ visible: true, question })
  const closeModal = () => setModalState({ visible: false, question: null })

  return (
    <div>
      <SectionBuilder
        title='سوال ها'
        className='mb-5'
        error={error}
        loading={isLoading}
        empty={data?.length === 0}
        actions={<Button onClick={showCreateModal}>ایجاد سوال</Button>}
      >
        <Tabs
          defaultActiveKey='1'
          type='card'
          items={_(data)
            .groupBy((x) => x.exam_lesson.lesson.id)
            .map((value, key) => ({
              label: value[0].exam_lesson.lesson.title,
              key: key,
              children: <QuestionCollapse exam={exam} questions={value} showEditModal={showEditModal} />,
            }))
            .value()}
        />
      </SectionBuilder>
      {modalState.visible && (
        <QuestionModal exam={exam} visible={modalState.visible} question={modalState.question} onClose={closeModal} />
      )}
    </div>
  )
}

const QuestionCollapse = ({ exam, questions, showEditModal }) => {
  const { message, modal } = App.useApp()
  const { mutate } = useSWRConfig()

  const deleteQuestion = (question) => {
    modal.confirm({
      title: 'آیا مطمئن هستید که می خواهید این سوال را حذف کنید؟',
      okType: 'danger',
      okText: 'حذف',
      cancelText: 'خیر',
      onOk: async () => {
        try {
          await callAxios.delete(`/exam/${exam.id}/questions/${question.id}/`)
          message.success('سوال با موفقیت حذف شد')
          mutate(`/exam/${exam.id}/questions/`)
        } catch (error) {
          message.error(error.errorData ? error.errorData.msg : 'مشکلی پیش آمده است')
        }
      },
    })
  }
  return (
    <Collapse
      collapsible='icon'
      items={questions.map((question) => ({
        key: question.id,
        label: `${question.question_number} - ${question.topic.title} (${question.score} نمره)`,
        extra: (
          <div className='flex self-center items-center space-x-2 space-x-reverse'>
            <span className='text-gray-400 text-xs'>{question.type}</span>
            <Button size='small' icon={<Edit width='1rem' />} onClick={() => showEditModal(question)} />
            <Button size='small' icon={<Trash width='1rem' />} onClick={() => deleteQuestion(question)} />
          </div>
        ),
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
      }))}
    />
  )
}

export default QuestionList
