import React, { createContext, useEffect, useState } from 'react'
import useChats from '../../lib/useChats'
import { ChatMessage, ChatUser } from '../widget/store'
import useRealm from '../../lib/useRealm'

interface IChatBoxContext {
  id: string
  isChatTrigger: number
  chat: ChatMessage[] | undefined
  lead?: ChatMessage
  message: string
  setMessage: (message: string) => void
  onSendMessage: () => void
}

const getReceiver = (data: ChatMessage[]) => {
  return data.filter((item) => item.content?.includes('i:'))[0]
}

const defaultState = {} as IChatBoxContext

const ChatBoxContext = createContext<IChatBoxContext>(defaultState)

export function ChatBoxProvider({
  children,
  id,
  user,
}: {
  children: any
  id: string
  user?: ChatUser
}) {
  const [isChatTrigger, setIsChatTrigger] = useState(performance.now())
  const [lead, setLead] = useState<ChatMessage>()
  const [message, setMessage] = useState('')

  const { data: chat, error, mutate } = useChats(id)
  useRealm(id)
  const onSendMessage = async () => {
    let content = 'o:' + message

    setIsChatTrigger(performance.now())
    setMessage('')

    const chatMessage: ChatMessage = {
      content,
      createdAt: Date.now(),
      name: user?.name || 'Support',
      email: user?.email || 'Support',
      location: 'Support',
      userId: user?.userId ?? 'Support',
    }

    const uploadResponse = async () => {
      const response = await fetch(`/api/chatbox/chat/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatMessage }),
      })
      const responseData = (await response.json()).chatData as ChatMessage
      return [...chat!, responseData]
    }

    await mutate(uploadResponse, {
      optimisticData: [...chat!, chatMessage],
      rollbackOnError: true,
    })
  }

  useEffect(() => {
    if (lead || !chat?.length) return

    const receiver = getReceiver(chat)
    if (receiver) {
      setLead(receiver)
    }
  }, [chat, lead])

  return (
    <ChatBoxContext.Provider
      value={{
        id,
        isChatTrigger,
        chat,
        lead,
        message,
        setMessage,
        onSendMessage,
      }}>
      {children}
    </ChatBoxContext.Provider>
  )
}

export default ChatBoxContext
