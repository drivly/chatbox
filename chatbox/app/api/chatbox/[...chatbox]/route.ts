import createChatApi from '../../../../components/api'

const chatApi = createChatApi({
  db: process.env.MONGODB_DB,
  collection: process.env.MONGODB_COLLECTION,
  webhooks: [process.env.SLACK_WEBHOOK_URL as string],
})

export { chatApi as GET, chatApi as POST }
