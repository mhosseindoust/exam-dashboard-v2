import { cookies } from 'next/headers'
import ToolsSection from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/ToolsSection'
import PaperSection from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/PaperSection'

async function getQuestion(examId, exam_lesson_id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/exam/${examId}/questions/print/?exam_lesson_id=${exam_lesson_id}`,
    {
      credentials: 'include',
      headers: {
        Cookie: cookies()
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join('; '),
      },
    },
  )
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}
async function getExamLesson(examId, examLessonId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exam/${examId}/lessons/${examLessonId}`, {
    credentials: 'include',
    headers: {
      Cookie: cookies()
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; '),
    },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

async function Page({ params }) {
  const examLesson = await getExamLesson(params.id, params.examLessonId)
  const questions = await getQuestion(params.id, params.examLessonId)

  return (
    <div className='flex gap-2'>
      <div className='m-2 p-5 rounded-xl bg-gray-400 w-full print:hidden'>
        <ToolsSection />
      </div>
      <div className='m-2 p-5 rounded-xl bg-gray-400 print:m-0 print:p-0'>
        <PaperSection examId={params.id} examLessonId={examLesson.id} baseQuestions={questions} examLesson={examLesson} />
      </div>
    </div>
  )
}

export default Page
