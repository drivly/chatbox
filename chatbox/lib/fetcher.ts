import { ChatMessage } from '../components/widget/store'

const fetcher = async (url: string) => {
  const response = await fetch(url, { method: 'GET' })
  const data = await response.json()
  const chatMessages: ChatMessage[] = data.chatData || []
  return chatMessages
}

export default fetcher
