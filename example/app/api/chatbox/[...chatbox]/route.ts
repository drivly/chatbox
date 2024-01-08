import createChatApi from '@drivly/chatbox/api'

const chatApi = createChatApi({
  db: process.env.MONGODB_DB,
  collection: process.env.MONGODB_COLLECTION,
  webhooks: [process.env.SLACK_WEBHOOK_URL || ''],
})

export { chatApi as GET, chatApi as POST }
