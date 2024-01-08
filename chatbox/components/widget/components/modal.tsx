import React, { useContext } from 'react'
import Chat from '../../shared/chat'
import Form from '../../shared/form'
import FeedbackContext from '../store'
import Header from './header'

export default function Modal() {
  const {
    isModalShow,
    isChatTrigger,
    chat,
    message,
    setMessage,
    onSendMessage,
  } = useContext(FeedbackContext)

  if (!isModalShow) return null

  return (
    <div className='chatbox-widget-modal'>
      <Header />
      <Chat chat={chat} emailForm isChatTrigger={isChatTrigger} />
      <Form
        message={message}
        setMessage={setMessage}
        onSendMessage={onSendMessage}
      />
    </div>
  )
}
