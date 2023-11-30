'use client'

import Link from 'next/link'
import LogoImage from '/public/logo.svg'
import UserAvatar from '/public/images/default/user.jpg'
import Image from 'next/image'
import React, { useState } from 'react'
import { App, Button } from 'antd'
import { SignOutAlt } from 'react-flaticons'
import callAxios from '@/helpers/callAxios'
import { useRouter } from 'next/navigation'

function Header(props) {
  const [loadingLogout, setLoadingLogout] = useState(false)
  const router = useRouter()
  const { message } = App.useApp()

  return (
    <div>
      <header className='bg-primary shadow-md border-b border-b-white/20'>
        <div className='container justify-between items-center py-2.5 flex'>
          <div className='flex items-center'>
            <Link href='/'>
              <Image src={LogoImage} alt='logo image' width={100} />
            </Link>
          </div>
          <div className='flex gap-2 items-center'>
            <Image src={UserAvatar} alt='' width={40} height={40} className='rounded-lg' />
            <div className='flex flex-col'>
              <span className='text-[11px] text-white font-thin'>خوش آمدید</span>
              <span className='text-[11px] text-white '>test</span>
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
      </header>
    </div>
  )
}

export default Header
