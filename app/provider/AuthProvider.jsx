'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import callAxios from '@/helpers/callAxios'
import { App, Button, Form, Input, Spin } from 'antd'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const pathname = usePathname()
  const router = useRouter()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = () => {
    callAxios
      .get('/users/me')
      .then((response) => setUser(response.data))
      .catch((e) => handleUserFetchError(e))
  }

  const handleUserFetchError = (e) => {
    if (e.response && (e.response.status === 401 || e.response.status === 403)) {
      if (pathname !== '/auth/login') router.replace('/auth/login')
    } else {
      message.error(e.errorData.msg)
    }
  }

  const onSubmit = (data) => {
    setLoading(true)
    authenticateUser(data)
  }

  const authenticateUser = (data) => {
    let bodyFormData = new FormData()
    bodyFormData.append('username', data.username)
    bodyFormData.append('password', data.password)

    callAxios
      .post('/auth/token', bodyFormData)
      .then((response) => {
        message.success('با موفقیت وارد شدید...')
        router.push(`/`)
        fetchUser()
      })
      .catch((e) => message.error('نام کاربری و رمز عبور اشتباه است ..'))
      .finally(() => setLoading(false))
  }

  if (pathname === '/auth/login') {
    return <LoginForm onSubmit={onSubmit} loading={loading} />
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {user ? (
        children
      ) : (
        <Spin>
          <div className='h-screen'></div>
        </Spin>
      )}
    </AuthContext.Provider>
  )
}

const LoginForm = ({ onSubmit, loading }) => (
  <div>
    <Spin spinning={loading}>
      <div className='grid place-items-center lg:grid-cols-2 h-screen bg-base-200'>
        <div className='rounded-2xl shadow-2xl bg-base-100 relative p-10 lg:w-3/5'>
          <Form layout={'vertical'} onFinish={onSubmit}>
            <Form.Item label='نام کاربری' name='username'>
              <Input />
            </Form.Item>

            <Form.Item label='رمزعبور' name='password'>
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit' block loading={loading}>
                تایید
              </Button>
            </Form.Item>
          </Form>
        </div>
        <img className='hidden lg:block' src='/images/default/login-cover.svg' alt='' />
      </div>
    </Spin>
  </div>
)
