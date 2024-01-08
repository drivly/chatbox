import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import TimeAgo from 'react-timeago'
import { parseString } from '../../lib/parseString'
import { cn } from '../../lib/utils'
import { ChatMessage } from '../widget/store'

type AdminChatProps = {
  chat: ChatMessage[] | undefined
  emailForm?: boolean
  isChatTrigger: number
  isAdmin?: boolean
  lead?: ChatMessage
}

const AdminChat = ({ chat, isChatTrigger }: AdminChatProps) => {
  const chatContainerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!chatContainerRef.current) return
    chatContainerRef.current.scrollIntoView({
      behavior: 'smooth',
      inline: 'end',
    })
  }, [isChatTrigger, chat?.length])

  return (
    <div className='chatbox-admin-chat'>
      {chat?.map((message) => (
        <AdminMessage key={message.createdAt} message={message} />
      ))}
      <span ref={chatContainerRef} />
    </div>
  )
}

export default AdminChat

function AdminMessage({ message }: { message: ChatMessage }) {
  const parsedStr = parseString(message.content)
  const isUser = parsedStr[0] === 'i'
  return (
    <div
      className={cn('chatbox-admin-chat-message', {
        'chatbox-admin-chat-message-is-user': isUser,
      })}>
      {message.picture ? (
        <div
          className={cn('chatbox-admin-image-wrapper', {
            'chatbox-admin-image-order': isUser,
          })}>
          <Image
            src={message.picture as string}
            width={40}
            height={10}
            alt={message.name}
            className='chatbox-admin-image'
          />
        </div>
      ) : null}
      <div>
        <p
          className={cn('chatbox-admin-user', {
            'chatbox-admin-chat-is-user': isUser,
          })}>
          {message.name}
        </p>
        <div className='chatbox-admin-chat-message'>
          <div
            className={cn('chatbox-admin-chat-message-content', {
              'chatbox-admin-chat-message-content-is-user': isUser,
            })}>
            <p>{parsedStr[1]}</p>
          </div>
          <p
            className={cn('chatbox-admin-chat-timesatamp', {
              'chatbox-admin-chat-timesatamp-is-user': isUser,
            })}>
            <TimeAgo date={new Date(message.createdAt)} />
          </p>
        </div>
      </div>
    </div>
  )
}
