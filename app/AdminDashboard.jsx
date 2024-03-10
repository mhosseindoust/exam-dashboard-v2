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
        <div className='md:grid md:grid-cols-2 md:gap-3'>
          {data
            .sort((a, b) => a.id - b.id)
            .map((exam, index) => (
              <SectionBuilder key={index} className='p-3 h-96'>
                <Doughnut
                  data={{
                    labels: ['تصحیح شده', 'تصحیح نشده'],
                    datasets: [
                      {
                        data: [exam.user_question_corrected_count, exam.user_question_not_corrected_count],
                        backgroundColor: ['#17A34A', '#3F0ECC'],
                        // backgroundColor: Object.values({
                        //   red: 'rgb(255, 99, 132)',
                        //   orange: 'rgb(255, 159, 64)',
                        //   yellow: 'rgb(255, 205, 86)',
                        //   green: 'rgb(75, 192, 192)',
                        //   blue: 'rgb(54, 162, 235)',
                        //   purple: 'rgb(153, 102, 255)',
                        //   grey: 'rgb(201, 203, 207)',
                        // }),
                        borderColor: '#fff',
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'left',
                      },
                      title: {
                        display: true,
                        text: exam.title,
                        font: {
                          size: 16,
                        },
                        padding: {
                          bottom: 30,
                        },
                      },
                      tooltip: {
                        rtl: true,
                      },
                      datalabels: {
                        color: '#444',
                        textAlign: 'center',
                        anchor: 'center',
                        align: 'center',
                      },
                    },
                  }}
                />
              </SectionBuilder>
            ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
