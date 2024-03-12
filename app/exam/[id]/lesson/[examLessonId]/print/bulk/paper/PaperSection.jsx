'use client'

import useSWRImmutable from 'swr/immutable'
import { Spin } from 'antd'
import A4Container from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/A4Container'
import CalculateQuestion from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/CalculateQuestion'
import Question from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/Question'
import { useEffect, useState } from 'react'

const HEADER_HEIGHT = 230 // Adjust based on your layout
const FOOTER_HEIGHT = 50 // Adjust based on your layout
const A4_HEIGHT = 1122 // Adjusted A4 height in pixels for 96 DPI

const PaperSection = ({ baseQuestions, examId, examLesson }) => {
  const { data: questions, mutate } = useSWRImmutable(`/exam/${examId}/questions/print/?exam_lesson_id=${examLesson.id}`, {
    fallbackData: baseQuestions,
  })
  const [pages, setPages] = useState([])

  useEffect(() => {
    const calculatePages = () => {
      let tempPages = []
      let currentPageQuestions = []
      let currentPageHeight = 0
      let pageNumber = 1 // Start from page 1
      const availableHeight = A4_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT // Calculate available space for questions

      questions.forEach((question) => {
        if (currentPageHeight + question.height_with_margin <= availableHeight) {
          currentPageQuestions.push(question)
          currentPageHeight += question.height_with_margin
        } else {
          const emptySpace = availableHeight - currentPageHeight
          tempPages.push({ number: pageNumber, questions: currentPageQuestions, emptySpace: emptySpace })
          pageNumber++ // Move to the next page number
          currentPageQuestions = [question] // Start new page with current question
          currentPageHeight = question.height_with_margin // Reset page height to current question's height
        }
      })

      // Add the last page if it has any questions
      if (currentPageQuestions.length > 0) {
        const emptySpace = availableHeight - currentPageHeight
        tempPages.push({ number: pageNumber, questions: currentPageQuestions, emptySpace: emptySpace })
      }

      setPages(tempPages)
    }

    if (questions && questions.length > 0) {
      calculatePages()
    }
  }, [questions])

  if (questions.some((q) => !q.height))
    return (
      <Spin tip='در حال صفحه بندی ...'>
        <div className='bg-white w-[210mm] '>
          {questions.map((question) => (
            <CalculateQuestion key={question.id} question={question} examId={examId} mutate={mutate} />
          ))}
        </div>
      </Spin>
    )

  return (
    <div>
      {pages.map((page) => (
        <A4Container
          key={page.number}
          pageNumber={page.number}
          HeaderHeight={HEADER_HEIGHT}
          FooterHeight={FOOTER_HEIGHT}
          examLesson={examLesson}
        >
          {page.questions.map((question) => {
            return (
              <Question
                key={question.id}
                examId={examId}
                examLessonId={examLesson.id}
                question={question}
                extraSpace={Math.floor(page.emptySpace / page.questions.length)}
              />
            )
          })}
        </A4Container>
      ))}
    </div>
  )
}

export default PaperSection
