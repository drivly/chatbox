'use client'

import useSWR from 'swr'
import fetcher from './fetcher'

const useChats = (id: string) => useSWR(`/api/chatbox/chat/${id}`, fetcher)

export default useChats
