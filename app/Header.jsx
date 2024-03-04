'use client'

import Link from 'next/link'
import LogoImage from '/public/logo.svg'
import UserAvatar from '/public/images/default/user.jpg'
import Image from 'next/image'
import React, { useState } from 'react'
import { App, Button, Divider } from 'antd'
import { BarcodeScan, ClipboardList, Dashboard, ListCheck, Print, SignOutAlt, Test } from 'react-flaticons'
import callAxios from '@/helpers/callAxios'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/provider/AuthProvider'
import classNames from 'classnames'

function Header(props) {
  const [loadingLogout, setLoadingLogout] = useState(false)
  const router = useRouter()
  const { message } = App.useApp()
  const pathname = usePathname()
  const { user } = useAuth()

  const menuItems = [
    { label: 'داشبورد', key: '/', icon: <Dashboard /> },
    { label: 'آزمون ها', key: '/exam', icon: <ClipboardList />, access_type: 'is_staff' },
    { label: 'اسکن', key: '/scan', icon: <BarcodeScan />, access_type: 'is_staff' },
    { label: 'اسکن دسته ای', key: '/scan/bulk', icon: <Print />, access_type: 'is_staff' },
    { label: 'دسته ها', key: '/scan/parts', icon: <ListCheck />, access_type: 'is_staff' },
  ]

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.access_type) {
      return (item.access_type === 'is_staff' && user.is_staff) || (item.access_type === 'is_student' && !user.is_staff)
    }
    return true
  })
  const isMenuItemActive = (key) => {
    if (pathname === key) {
      return true
    }
    // return pathname.startsWith(key) && (pathname[key.length] === '/' || pathname[key.length] === undefined)
    // return key === '/' ? pathname === key : pathname.startsWith(key)
  }

  return (
    <header className='bg-primary print:hidden'>
      <div className='container justify-between items-center py-2.5 flex  '>
        <div className='flex items-center flex-1'>
          <Link href='/'>
            <Image src={LogoImage} alt='logo image' width={100} />
          </Link>
          <ul className='flex  gap-2 list-none items-center mt-auto mb-0'>
            {filteredMenuItems.map((item) => (
              <Link href={item.key} key={item.key}>
                <li
                  className={classNames('px-5 rounded-md no-underline !text-white flex items-center gap-2 h-10', {
                    'bg-white/10': isMenuItemActive(item.key),
                    'hover:bg-white/5': !isMenuItemActive(item.key),
                  })}
                >
                  {item.icon}
                  {item.label}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className='flex gap-2 items-center'>
          <Image src={UserAvatar} alt='' width={40} height={40} className='rounded-lg' />
          <div className='flex flex-col'>
            <span className='text-[11px] text-white font-thin'>خوش آمدید</span>
            <span className='text-[11px] text-white '>
              {user.first_name} {user.last_name}
            </span>
          </div>
          <Button
            type='primary'
            icon={<SignOutAlt className='rotate-180 ' />}
            loading={loadingLogout}
            onClick={() => {
              setLoadingLogout(true)
              callAxios
                .get('/auth/logout')
                .then((res) => router.push('/auth/login'))
                .catch((e) => message.error(e.errorData.msg))
            }}
          />
        </div>
      </div>
      <Divider className='mb-0 mt-0 bg-white/30' />
    </header>
  )
}

export default Header
