# ChatBox Widget for Next.js 14 Apps (App Router)

Create a ChatBox Widget (like Intercom live chat) for your Next.js app. Nothing to maintain, it is completely serverless. When your website's visitor starts a session, the chat link is sent to your Slack channel via a webhook. All chats are stored in a MongoDB database.  

Here the steps:

### 1. Create MongoDB Database

We will use [MongoDB](https://www.mongodb.com) to keep the data as well as messaging.

Create a free MongoDB database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
Also, create a App in App Services and cpy your APP ID.

Copy the `.env.local.example` file to `.env.local` (which will be ignored by
Git):

```bash
cp .env.local.example .env.local
```

- `MONGODB_URL` can be found when you Connect to Cluster in MongoDB Atlas.
- `MONGODB_DB` is the name of the database you created in MongoDB Atlas.
- `MONGODB_COLLECTION` is the name of the collection you created in MongoDB Atlas.
- `NEXT_PUBLIC_REALM_APP_ID` is the App ID of your MongoDB App created in App Services.
- `NEXT_PUBLIC_MONGODB_DB` is the name of the database you created in MongoDB Atlas.
- `NEXT_PUBLIC_MONGODB_COLLECTION` is the name of the collection you created in MongoDB Atlas.
- `SLACK_WEBHOOK_URL` can be found at the Slack integration page in https://api.slack.com/messaging/webhooks

### 2. Install Package

```bash
yarn add @drivly/chatbox
```

### 3. Import CSS and Widget

```jsx
// app/layout.tsx

import '@drivly/chatbox/style.css'
import dynamic from 'next/dynamic'
import ChatBox from '@drivly/chatbox'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`w-full font-sans ${fontSans.variable} ${IBM.variable} ${mont.variable}`}>
        <main>
          {children}
          <ChatBox />
        </main>
      </body>
    </html>
  )
}
```

The options can be passed as React props

| key              | type                 | default                                  |
| ---------------- | -------------------- | ---------------------------------------- |
| `themeColor?`    | `string`             | #2d00c6                                  |
| `textColor?`     | `string`             | #fff                                     |
| `title?`         | `string`             | Hi 👋                                    |
| `description?`   | `string`             | Ask us anything, or share your feedback. |
| `showOnInitial?` | `boolean`            | false                                    |
| `customIcon?`    | `React.ReactElement` |                                          |
| `userLocation?`  | `string`             | Miami, Fl                                |
| `user?`          | `ChatUser`           | authenticated chat user                  |

```js

export type ChatUser = {
  name: string
  firstName: string
  image: string
  email: string
  userId: string
}

```

### 4. Admin Dashboard

```js
// app/chat/[id]/page.tsx

import dynamic from 'next/dynamic'
const ChatBoxAdmin = dynamic(() => import('@drivly/chatbox/admin'), {
  ssr: false,
})

const AdminPage = async ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ChatBoxAdmin params={params} />
    </div>
  )
}

export default AdminPage
```

The options can be passed as React props

| key              | type                 | default                                  |
| ---------------- | -------------------- | ---------------------------------------- |
| `themeColor?`    | `string`             | #2d00c6                                  |
| `textColor?`     | `string`             | #fff                                     |
| `className?`     | `string`             |                                          |
| `params`         | `object`             | id: Chat ID.                             |
| `user?`          | `ChatUser`           | authenticated admin user                 |

### 5. Create API

```js
// app/api/chatbox/[...chatbox]/route.ts

import createChatApi from '@drivly/chatbox/api'

const chatApi = createChatApi({
  db: process.env.MONGODB_DB,
  collection: process.env.MONGODB_COLLECTION,
  webhooks: [process.env.SLACK_WEBHOOK_URL!],
})

export { chatApi as GET, chatApi as POST }
```

The options for the API are:

```ts
type ChatApiOptions = {
  db?: string
  collection?: string
  webhooks: string[]
}

interface IChatCollection {
  _id: ObjectId
  chatId: string
  chatData: ChatMessage[]
}

type ChatMessage = {
  content: string
  createdAt: number
  name: string
  picture?: string
  email: string
  location: string
  userId?: string
}
```