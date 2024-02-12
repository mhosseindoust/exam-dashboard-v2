import A4Container from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/A4Container'
import QuestionElement from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/QuestionElement'
import { Spin } from 'antd'

const PaperSection = ({ fullLoad, questions, Pages, containerRef, updateQuestionInfo, lessonSelected }) => {
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

export default PaperSection
