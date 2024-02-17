'use client'

import ToolsSection from '@/exam/[id]/lesson/[examLessonId]/print/bulk/header/ToolsSection'
import PaperSection from '@/exam/[id]/lesson/[examLessonId]/print/bulk/header/PaperSection'
import useSWRImmutable from 'swr/immutable'
import { Skeleton } from 'antd'
import { useEffect, useState } from 'react'

function Page({ params }) {
  const { data: headersData, isLoading: headersLoading } = useSWRImmutable(`/exam/${params.id}/print/header`)
  const { data: examLessonData, isLoading: examLessonLoading } = useSWRImmutable(
    `/exam/${params.id}/lessons/${params.examLessonId}`,
  )
  const { data: agencyData, isLoading: agencyLoading } = useSWRImmutable(`/users/agency`)

  const [agencySelect, setAgencySelect] = useState(null)
  const [syncTimesSelect, setSyncTimesSelect] = useState([])

  // Todo this values to 0 and remove margin tag p in paper section
  const [margins, setMargins] = useState({ top: 10, right: 4, bottom: 0, left: 0 })

  return (
    <div className='flex gap-2'>
      <div className='m-2 p-5 rounded-xl bg-gray-400 w-full print:hidden'>
        <ToolsSection
          agencyList={agencyData}
          setAgencySelect={setAgencySelect}
          headers={headersData?.filter((f) => f.user.agency.id === agencySelect)}
          setSyncTimesSelect={setSyncTimesSelect}
          setMargins={setMargins}
          margins={margins}
          syncTimesSelect={syncTimesSelect}
        />
      </div>
      <div
        className={`m-2 p-5 rounded-xl ${headersLoading || examLessonLoading ? 'bg-white' : 'bg-gray-400'} print:m-0 print:p-0`}
      >
        {headersLoading || examLessonLoading || agencyLoading ? (
          <div className='w-[210mm]'>
            <Skeleton active />
          </div>
        ) : (
          <PaperSection
            headers={headersData
              ?.filter((f) => f.user.agency.id === agencySelect)
              .filter((f) => {
                const objDate = new Date(f.created_at)
                const objDateString = objDate.toLocaleDateString()
                return syncTimesSelect.includes(objDateString)
              })}
            examLesson={examLessonData}
            margins={margins}
          />
        )}
      </div>
    </div>
  )
}

export default Page
