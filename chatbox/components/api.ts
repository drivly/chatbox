import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'
import { ChatMessage } from './widget/store'

const client = new MongoClient(process.env.MONGODB_URL as string)

type ChatApiOptions = {
  db?: string
  collection?: string
  webhooks: string[]
}

const createChatApi = (options: ChatApiOptions) => {
  return async (
    req: Request,
    { params }: { params: { chatbox: string[] } }
  ) => {
    const method = req.method
    const api = params.chatbox[0]
    const chatId = params.chatbox[1]
    const host = `${req.headers.get('x-forwarded-proto')}://${req.headers.get(
      'x-forwarded-host'
    )}`

    try {
      if (!chatId) throw new Error('Missing chatId')
      const Chat = client
        .db(options.db ?? 'chatbox')
        .collection(options.collection ?? 'chats')

      switch (api) {
        case 'chat':
          switch (method) {
            case 'GET':
              const data = await Chat.findOne({ chatId })
              const chatData = data ? data.chatData : []
              return NextResponse.json({ chatData })
            case 'POST':
              const { chatMessage } = await req.json()

              const newMessage: ChatMessage = {
                ...chatMessage,
                createdAt: Date.now(),
              }

              await Chat.updateOne(
                { chatId },
                { $push: { chatData: newMessage } },
                { upsert: true }
              )
              return NextResponse.json({ chatData: newMessage })
            default:
              throw new Error('Method not allowed')
          }
        case 'slack-email':
          if (method !== 'POST') throw new Error('Method not allowed')

          const { email } = await req.json()

          if (!email) throw new Error('Missing email')

          const notifyEmailText = `A user left their email address ${email} with chat id: ${host}/chat/${chatId}`
          const requestsEmail = options.webhooks.map((webhook) =>
            fetch(webhook, {
              method: 'POST',
              body: JSON.stringify({ text: notifyEmailText }),
              headers: {
                'Content-Type': 'application/json',
              },
            })
          )
          await Promise.all(requestsEmail)

          await Chat.updateOne(
            { chatId },
            { $set: { email } },
            { upsert: true }
          )
          return NextResponse.json({ response: 'ok' })
        case 'slack':
          if (method !== 'POST') throw new Error('Method not allowed')

          const hasContent = req.headers.has('Content-Type')

          let notifyText = `New chat with id: ${host}/chat/${chatId}`

          if (hasContent) {
            notifyText = `Old chat with id: ${host}/chat/${chatId} has a new message!`
          }

          const requestsNotify = options.webhooks.map((webhook) =>
            fetch(webhook, {
              method: 'POST',
              body: JSON.stringify({ text: notifyText }),
              headers: {
                'Content-Type': 'application/json',
              },
            })
          )

          await Promise.all(requestsNotify)
          return NextResponse.json({ response: 'ok' })

        default:
          throw new Error('Method not allowed')
      }
    } catch (error) {
      console.error(error)
      return NextResponse.error()
    }
  }
}

export default createChatApi
