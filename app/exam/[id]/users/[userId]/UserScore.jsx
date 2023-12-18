'use client'

import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import SectionBuilder from '@/components/SectionBuilder'
import { Input, Segmented, Tabs } from 'antd'
import useSWRImmutable from 'swr/immutable'
import UserScoreLesson from '@/exam/[id]/users/[userId]/UserScoreLesson'

const UserScore = ({ examId, userId }) => {
  const { data: examLessons, isLoading: examLessonLoading, examLessonError } = useSWRImmutable(`/exam/${examId}/lessons`)
  // const [selectedExamLesson, setSelectedExamLesson] = useState(null)

  // useEffect(() => {
  //   if (examLessons) {
  //     setSelectedExamLesson(examLessons[0].id)
  //   }
  // }, [examLessons])

  if (examLessonLoading) return <SectionBuilder title='تغییر نمره' loading />
  if (examLessonError) return <SectionBuilder title='تغییر نمره' error />

  return (
    <SectionBuilder
      title='تغییر نمره'
      className='mb-4'
      // actions={
      //   <Segmented
      //     defaultValue={examLessons[0].id}
      //     onChange={(e) => setSelectedExamLesson(e)}
      //     options={examLessons.map((examLesson) => ({ label: examLesson.lesson.title, value: examLesson.id }))}
      //   />
      // }
    >
      <div>
        <Tabs
          defaultActiveKey='1'
          items={examLessons.map((examLesson) => ({
            key: examLesson.id,
            label: examLesson.lesson.title,
            children: <UserScoreLesson userId={userId} examId={examId} examLessonId={examLesson.id} />,
          }))}
        />
        {/*<Tabs defaultActiveKey="1" items={examLessons.map(examLesson=>({*/}
        {/*    key: examLesson.id,*/}
        {/*    title: examLesson.lesson.title,*/}
        {/*    content: <UserScoreLesson userId={userId} examId={examId} examLessonId={examLesson.id} />*/}
        {/*    }*/}
        {/*})} />*/}

        {/*<UserScoreLesson userId={userId} examId={examId} examLessonId={selectedExamLesson} />*/}
        {/*{data*/}
        {/*  .filter((f) => f.exam_lesson_id === selectedExamLesson)*/}
        {/*  .map((item) => (*/}
        {/*    <div key={item.exam_question_id}>*/}
        {/*      {item.question_number} - <Input />*/}
        {/*    </div>*/}
        {/*  ))}*/}
      </div>
    </SectionBuilder>
  )
}

export default UserScore
