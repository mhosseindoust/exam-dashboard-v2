import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { Result } from 'antd'

import ReportSection from '@/exam/[id]/users/[userId]/report/ReportSection'
import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'

async function getExamReport(id, userId) {
  const cookie = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exam/${id}/users/${userId}/report/`, {
    credentials: 'include',
    headers: { Cookie: cookie },
  })
  if (res.status === 404) return notFound()
  if (!res.ok) {
    if (res.status === 400) {
      const errorText = await res.text()
      return { error: errorText }
    }

    throw new Error('Failed to fetch data')
  }
  return res.json()
}

async function Page({ params }) {
  const report = await getExamReport(params.id, params.userId)

  if (report.error) return <Result status='500' title='500' subTitle={report.error} />
  console.log(report)
  return (
    <div>
      <PageHead
        // title={`${report.user.full_name}-${report.user.username}-${report.school.title}-${report.classroom.title}-${report.exam.title}`}
        title={`مدرسه ${report.school.title} کلاس - ${report.classroom.title}`}
        breadcrumbList={[{ title: 'آزمون ها', path: '/exam' }, { title: report.exam.title }]}
      />

      <PageBody withoutLayout>
        {report.report_lessons.map((item) => (
          <ReportSection report={report} item={item} />
        ))}
      </PageBody>
    </div>
  )
}

export default Page
