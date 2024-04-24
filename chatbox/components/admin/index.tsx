'use client'

import React, { useContext } from 'react'
import { cn } from '../../lib/utils'
import AdminChat from '../shared/admin-chat'
import Form from '../shared/form'
import { ChatUser } from '../widget/store'
import FeedbackContext, { ChatBoxProvider } from './store'

function ChatBoxAdmin({
  className,
  themeColor,
  textColor,
}: {
  className?: string
  themeColor?: string
  textColor?: string
}) {
  const { id, isChatTrigger, chat, lead, message, setMessage, onSendMessage } =
    useContext(FeedbackContext)
  const displayName = lead?.name !== 'Visitor' ? lead?.name : `chat id ${id}`
  const displayEmail = lead?.email
  const displayLocation = lead?.location
  const siteUrl = lead?.siteUrl

  return (
    <div
      className='chatbox'
      style={{
        // @ts-ignore
        '--color-primary': themeColor,
        '--color-text': textColor,
      }}>
      <div className='chatbox-admin-root'>
        <div className={cn('chatbox-admin-grid', className)}>
          <header className='chatbox-admin-header'>
            <div className='chatbox-admin-header-title'>
              <h1>Hi, {displayName}</h1>
              <a href={`mailto:${displayEmail}`}>{displayEmail}</a>
            </div>
            <div className='chatbox-admin-header-title'>
              {displayLocation && <p>{displayLocation}</p>}
              {siteUrl && <a href={siteUrl}>{siteUrl}</a>}
            </div>
          </header>
          <AdminChat chat={chat} isChatTrigger={isChatTrigger} />
          <Form
            message={message}
            setMessage={setMessage}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    </div>
  )
}

export interface IChatBoxAdmin {
  className?: string
  params: {
    id: string
  }
  themeColor?: string
  textColor?: string
  user?: ChatUser
}

export default function ChatBoxAdminRoot({
  className,
  params,
  themeColor = '#16162A',
  textColor = '#fff',
  user,
}: IChatBoxAdmin) {
  return (
    <ChatBoxProvider id={params.id as string} user={user}>
      <ChatBoxAdmin
        className={className}
        themeColor={themeColor}
        textColor={textColor}
      />
    </ChatBoxProvider>
  )
}
