'use client'
import { SWRConfig } from 'swr'
import callAxios from '@/helpers/callAxios'
export const SWRProvider = ({ children }) => {
  return <SWRConfig value={{ fetcher: (url) => callAxios.get(url).then((res) => res.data) }}>{children}</SWRConfig>
}
