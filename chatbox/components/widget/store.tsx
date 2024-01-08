import { nanoid } from 'nanoid'
import React, { createContext, useState } from 'react'
import useChats from '../../lib/useChats'
import useRealm from '../../lib/useRealm'

export type ChatUser = {
  name: string
  firstName: string
  image: string
  email: string
  userId: string
}

export type ChatMessage = {
  content: string
  createdAt: number
  name: string
  picture?: string
  email: string
  location: string
  userId?: string
}

let window: Window | undefined
let localStorage: Storage | undefined = window?.localStorage

function getWithExpiry(key: string) {
  const itemStr = localStorage?.getItem(key)

  if (!itemStr) return null

  const item = JSON.parse(itemStr)
  const now = new Date()

  if (now.getTime() > item.expiry) {
    localStorage?.removeItem(key)
    window?.location.reload()
    return null
  }

  return item.value
}

// default is 24 hours
function setWithExpiry(key: string, value: string, ttl = 24 * 60 * 60 * 1000) {
  const now = new Date()

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  }

  localStorage?.setItem(key, JSON.stringify(item))
}

interface IChatBoxContext {
  themeColor?: string
  textColor?: string

  autoMessage?: string
  title?: string
  description?: string

  showOnInitial: boolean

  isModalShow: boolean
  onModalShow: (state: boolean) => void

  isChatTrigger: number
  chat: ChatMessage[] | undefined
  message: string
  setMessage: (message: string) => void
  onSendMessage: () => void

  isEmailSent: boolean
  email: string
  setEmail: (email: string) => void
  onSendEmail: () => void
}

const defaultState = {
  showOnInitial: false,
} as IChatBoxContext

const ChatBoxContext = createContext<IChatBoxContext>(defaultState)

export function ChatBoxProvider({
  themeColor,
  textColor,
  autoMessage,
  title,
  description,
  showOnInitial,
  children,
  user,
  userLocation,
  track,
}: {
  themeColor?: string
  textColor?: string
  autoMessage?: string
  title?: string
  description?: string
  showOnInitial: boolean
  children: any
  user?: ChatUser
  userLocation?: string
  track?: (
    _eventType: string,
    _customAttributes: object,
    _overrides?: object
  ) => void
}) {
  let initialID = 'visitor'
  const localID = getWithExpiry('chatbox_id')
  const [UID, setUID] = useState(localID ? localID : initialID)
  const [chatInitiated, setChatInitiated] = useState(localID ? true : false)
  const [isEmailSent, setIsEmailSent] = useState(getWithExpiry('emailSent'))
  const [hasBeen5Minutes, setHasBeen5Minutes] = useState(
    getWithExpiry('hasBeen5Minutes')
  )

  const [isChatTrigger, setIsChatTrigger] = useState(performance.now())
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  const [isModalShow, setIsModalShow] = useState(showOnInitial)

  const { data: chat, error, mutate } = useChats(UID)
  useRealm(UID)

  const onSendMessage = async () => {
    try {
      let id = UID
      let chatInitiatedTemp = chatInitiated

      if (!chatInitiated) {
        id = nanoid(10)

        const initResponse = await fetch(`/api/chatbox/slack/${id}`, {
          method: 'POST',
        })

        setWithExpiry('chatbox_id', id)

        if (initResponse.status !== 200) {
          localStorage?.removeItem('chatbox_id')
          localStorage?.removeItem('hasBeen5Minutes')
          localStorage?.removeItem('emailSent')

          throw new Error('Failed to init chat')
        }
        track?.('Chat Initiated', {
          eventAction: 'Chat Initiated',
          eventCategory: 'Chat',
          data: {
            chatId: id,
          }
        })
        setChatInitiated(true)
        setUID(id)
      }

      // If it has been 5 minutes after the last message, resend notification to slack.
      const hasBeen5Minutes = getWithExpiry('hasBeen5Minutes')

      setWithExpiry('hasBeen5Minutes', 'false', 5 * 60 * 1000)

      setHasBeen5Minutes(false)

      if (!hasBeen5Minutes && chatInitiatedTemp) {
        const initResponse = await fetch(`/api/chatbox/slack/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reminder: 'Reminder' }),
        })

        track?.('Chat Reminder Sent', {
          eventAction: 'Chat Reminder Sent',
          eventCategory: 'Chat',
          data: {
            chatId: id,
          }
        })

        if (initResponse.status !== 200) {
          localStorage?.removeItem('hasBeen5Minutes')
          setHasBeen5Minutes(true)
          throw new Error('Failed to post reminder.')
        }
      }

      let content = 'i:' + message

      setIsChatTrigger(performance.now())
      setMessage('')

      console.log('user', user)
      const chatMessage: ChatMessage = {
        content,
        createdAt: Date.now(),
        email: user?.email ?? '',
        location: userLocation ?? 'Unknown',
        name: user?.name ?? user?.firstName ?? user?.email ?? 'Visitor',
        picture: user?.image ?? '',
        userId: user?.userId ?? 'anonymous',
      }

      const uploadMessage = async () => {
        const replyResponse = await fetch(`/api/chatbox/chat/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatMessage }),
        })

        if (replyResponse.status !== 200) {
          throw new Error('Failed to reply')
        }

        track?.('Chat Message Sent', {
          eventAction: 'Chat Message Sent',
          eventCategory: 'Chat',
          data: {
            chatId: id,
            message: chatMessage.content,
          }
        })

        const replyData = (await replyResponse.json()).chatData as ChatMessage
        return [...chat!, replyData]
      }
      await mutate(uploadMessage, {
        optimisticData: [...chat!, chatMessage],
        rollbackOnError: true,
      })
    } catch (err) {
      alert(err)
    }
  }

  const onSendEmail = async () => {
    try {
      if (isEmailSent) return

      let id = UID

      if (!chatInitiated) {
        id = nanoid(10)

        setWithExpiry('chatbox_id', id)
        setWithExpiry('hasBeen5Minutes', 'false', 5 * 60 * 1000)
        setUID(id)
      }

      const response = await fetch(`/api/chatbox/slack-email/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.status !== 200) {
        throw new Error('Failed to send email address')
      }

      track?.('Chat Email Sent', {
        eventAction: 'Chat Email Sent',
        eventCategory: 'Chat',
        data: {
          chatId: id,
          email,
        }
      })

      setWithExpiry('emailSent', 'true')
      setIsEmailSent(true)
    } catch (err) {
      alert(err)
    }
  }

  const onModalShow = (status: boolean) => {
    setIsModalShow(status)
    if (status) setIsChatTrigger(performance.now())
  }

  return (
    <ChatBoxContext.Provider
      value={{
        themeColor,
        textColor,
        autoMessage,
        title,
        description,
        showOnInitial,

        isModalShow,
        onModalShow,

        isChatTrigger,
        chat,
        message,
        setMessage,
        onSendMessage,

        isEmailSent,
        email,
        setEmail,
        onSendEmail,
      }}>
      {children}
    </ChatBoxContext.Provider>
  )
}

export default ChatBoxContext
