import TempComponent from '@/exam/[id]/lesson/[examLessonId]/print/bulk/paper/TempComponent'
import { cookies } from 'next/headers'

async function getQuestion(examId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exam/${examId}/questions/print/`, {
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
async function getLesson(examId, examLessonId) {
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
  const lesson = await getLesson(params.id, params.examLessonId)
  const questions = await getQuestion(params.id)

  return <TempComponent lesson={lesson} questions={questions.filter((f) => f.exam_lesson_id === params.examLessonId)} />
}

export default Page
