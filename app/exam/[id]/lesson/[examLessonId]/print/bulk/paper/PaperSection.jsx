'use client'

import A4Container from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/A4Container'
import QuestionElement from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/QuestionElement'
import { Spin } from 'antd'

const PaperSection = ({
  fullLoad,
  questions,
  headers,
  selectedFilterHeaders,
  currentPage,
  Pages,
  containerRef,
  updateQuestionInfo,
  lessonSelected,
  justHeader,
}) => {
  console.log({
    fullLoad,
    questions,
    headers,
    selectedFilterHeaders,
    currentPage,
    Pages,
    containerRef,
    updateQuestionInfo,
    lessonSelected,
    justHeader,
  })
  const filteredHeaders = headers?.filter((obj) => {
    const objDate = new Date(obj.created_at)
    const objDateString = objDate.toLocaleDateString()
    return selectedFilterHeaders.includes(objDateString)
  })

  const renderHeaders = (headers) => {
    return headers.map((header) => {
      return Pages.map((page) => {
        if (!justHeader || (justHeader && page.number % 2 !== 0)) {
          return (
            <A4Container
              justHeader={justHeader}
              pageNumber={page.number}
              key={page.number}
              title={header.exam.title}
              classRoomTitle={header.user.classroom.title}
              duration={lessonSelected.duration}
              token={header.user.token}
              firstName={header.user.first_name}
              lastName={header.user.last_name}
              gradeTitle={header.exam.grade.full_title}
              schoolTitle={header.user.classroom.school.title}
              lessonTitle={lessonSelected.lesson.title}
              lessonId={lessonSelected.lesson.id}
              examUserId={header.id.toString()}
              agencyTitle={header.user.agency.name}
            >
              <div ref={containerRef} className='h-full '>
                {page.questions.map((question) => (
                  <QuestionElement
                    justHeader={justHeader}
                    key={question.id}
                    question={question}
                    updateQuestionInfo={updateQuestionInfo}
                    extraHeight={page.remainingHeight ? page.remainingHeight / page.questions.length : 0}
                  />
                ))}
              </div>
            </A4Container>
          )
        }
      })
    })
  }

  const renderDefaultHeaders = () => {
    return Pages.map((page) => (
      <A4Container
        pageNumber={page.number}
        key={page.number}
        lessonTitle={lessonSelected.lesson.title}
        lessonId={lessonSelected.lesson.id}
      >
        <div ref={containerRef} className='h-full '>
          {page.questions.map((question) => (
            <QuestionElement
              key={question.id}
              question={question}
              updateQuestionInfo={updateQuestionInfo}
              extraHeight={page.remainingHeight ? page.remainingHeight / page.questions.length : 0}
              fullLoad={fullLoad}
            />
          ))}
        </div>
      </A4Container>
    ))
  }

  if (questions.length === 0) {
    return (
      <A4Container>
        <div className='h-full'></div>
      </A4Container>
    )
  }

  if (!fullLoad) {
    return (
      <Spin tip='در حال صفحه بندی ...'>
        <A4Container>
          <div ref={containerRef} className='h-full overflow-auto'>
            {questions.map((question) => (
              <QuestionElement key={question.id} question={question} updateQuestionInfo={updateQuestionInfo} />
            ))}
          </div>
        </A4Container>
      </Spin>
    )
  }

  return filteredHeaders?.length > 0
    ? renderHeaders(filteredHeaders.slice((currentPage - 1) * 100, (currentPage - 1) * 100 + 100))
    : renderDefaultHeaders()
}

export default PaperSection
