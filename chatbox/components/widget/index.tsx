'use client'

import React from 'react'
import Modal from './components/modal'
import TriggerButton from './components/trigger-button'
import { ChatBoxProvider, ChatUser } from './store'
import { usePathname } from 'next/navigation'

export interface IChatBoxWidget {
  themeColor?: string
  textColor?: string
  autoMessage?: string
  title?: string
  description?: string
  showOnInitial?: boolean
  customIcon?: React.ReactElement
  user?: ChatUser
  userLocation?: string
  track?: (
    _eventType: string,
    _customAttributes: object,
    _overrides?: object
  ) => void
}

export default function ChatBox({
  themeColor = '#16162A',
  textColor = '#fff',
  autoMessage,
  title,
  description,
  showOnInitial = false,
  customIcon,
  user,
  userLocation,
  track,
}: IChatBoxWidget) {
  const pathname = usePathname()

  if (pathname?.startsWith('/chat')) return null

  return (
    <ChatBoxProvider
      themeColor={themeColor}
      textColor={textColor}
      autoMessage={autoMessage}
      title={title}
      description={description}
      showOnInitial={showOnInitial}
      track={track}
      user={user}
      userLocation={userLocation}>
      <div
        className='chatbox'
        style={{
          // @ts-ignore
          '--color-primary': themeColor,
          '--color-text': textColor,
        }}>
        <div className='chatbox-widget-root'>
          <TriggerButton>{customIcon}</TriggerButton>
          <Modal />
        </div>
      </div>
    </ChatBoxProvider>
  )
}
