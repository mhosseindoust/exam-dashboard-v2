'use client'

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Doughnut, Pie } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import useSWR from 'swr'
import SectionBuilder from '@/components/SectionBuilder'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ChartDataLabels, ArcElement, Tooltip, Legend)
ChartJS.defaults.font.family = 'IRANYekanX'

const AdminDashboard = ({ user }) => {
  const { data, isLoading, error } = useSWR(`/analytics/by-exam?exam_id=19&exam_id=20`, { refreshInterval: 5000 })
  if (isLoading) return null
  return (
    <div className='h-full min-h-screen bg-gray-100'>
      <div className='container py-10'>
        <SectionBuilder className='p-3 h-96'>
          <Bar
            data={{
              labels: data.map((exam) => exam.title),
              datasets: [
                {
                  label: 'اسکن شده',
                  data: data.map((exam) => exam.user_question_count),

                  backgroundColor: '#374AFE',
                  borderRadius: 5,
                },
                {
                  label: 'اسکن نشده',
                  data: data.map((exam) => exam.user_question_not_scanned),
                  backgroundColor: '#FF6384',
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  grace: '20%',
                  stacked: true,
                },
                x: {
                  stacked: true,
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: 'وضعیت اسکن',
                },
                datalabels: {
                  align: 'end',
                  anchor: 'end',
                  textAlign: 'center',
                  color: 'white',
                },
                legend: {
                  display: false,
                },
              },
            }}
          />
        </SectionBuilder>
      </div>
    </div>
  )
}

export default AdminDashboard
