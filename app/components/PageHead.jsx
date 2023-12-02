'use client'
import { Breadcrumb, Divider } from 'antd'
import Link from 'next/link'

const PageHead = ({ title, children, breadcrumbList = [] }) => {
  return (
    <section className='bg-primary w-full  pt-5 pb-14 '>
      <div className='container flex justify-between items-center mb-4'>
        <div className='flex flex-col '>
          <h2 className='font-semibold text-lg text-white m-0'>{title}</h2>
          <Divider type='horizontal' className='my-2 bg-white/30' />
          <Breadcrumb
            itemRender={(route) => (route.path ? <Link href={route.path}>{route.title}</Link> : <div>{route.title}</div>)}
            items={[
              {
                path: '/',
                title: 'خانه',
              },
              ...breadcrumbList,
            ]}
          />
        </div>
        <div className='text-left'>{children}</div>
      </div>
    </section>
  )
}

export default PageHead
