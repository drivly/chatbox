import React, { useEffect, useRef } from 'react'
import Email from '../widget/components/email'
import { ChatMessage } from '../widget/store'
import { parseString } from '../../lib/parseString'

interface IChatBoxAdminChat {
  chat: ChatMessage[] | undefined
  emailForm?: boolean
  isChatTrigger: number
}

export default function Chat({
  isChatTrigger,
  chat,
  emailForm = false,
}: IChatBoxAdminChat) {
  const chatContainerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!chatContainerRef.current) return
    chatContainerRef.current.scrollIntoView({
      behavior: 'smooth',
      inline: 'end',
    })
  }, [isChatTrigger, chat?.length])

  const Messages = chat?.map((item, index) => {
    const parsedStr = parseString(item.content)
    const isIn = parsedStr[0] === 'i'
    const classNames = isIn
      ? 'chatbox-chat-message-in'
      : 'chatbox-chat-message-out'

    const Message = () => (
      <div className={`chatbox-chat-message ${classNames}`}>
        <span>{parsedStr[1]}</span>
      </div>
    )

    if (emailForm && index === 0) {
      return (
        <div key={9999}>
          <Message />
          <Email />
        </div>
      )
    }

    return (
      <div key={index}>
        <Message />
      </div>
    )
  })

  return (
    <div className='chatbox-chat'>
      {Messages}
      <span ref={chatContainerRef} />
    </div>
  )
}
