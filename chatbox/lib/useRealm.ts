'use client'

import React, { useEffect, useState } from 'react'
import * as Realm from 'realm-web'
import useChats from './useChats'
import fetcher from './fetcher'

const app = new Realm.App({
  id: process.env.NEXT_PUBLIC_REALM_APP_ID as string,
})
const db = process.env.NEXT_PUBLIC_MONGODB_DB as string
const coll = process.env.NEXT_PUBLIC_MONGODB_COLLECTION as string

type ChangeRealmEvent =
  | AsyncGenerator<
      globalThis.Realm.Services.MongoDB.ChangeEvent<any>,
      any,
      unknown
    >
  | undefined

const useRealm = (chatId: string) => {
  const [user, setUser] = useState<Realm.User>()
  const { data: chat, error, mutate } = useChats(chatId)

  useEffect(() => {
    let changeStream: ChangeRealmEvent
    let realmUser: Realm.User
    const login = async () => {
      if (!user) {
        const anonymousCredential = Realm.Credentials.anonymous()
        realmUser = await app.logIn(anonymousCredential)
        setUser(realmUser)
      }

      const mongodb = app.currentUser?.mongoClient('mongodb-atlas')
      const collection = mongodb?.db(db).collection(coll)
      changeStream = collection?.watch()

      changeStream?.next().then((change) => {
        const changeChatId = change.value?.fullDocument?.chatId 
        if (changeChatId === chatId) {
          const data = change.value.fullDocument.chatData

          if (chat && data.length === chat.length) return

          if (!chat) {
            mutate(fetcher(`/api/chatbox/chat/${chatId}`))
          } else {
            mutate(fetcher(`/api/chatbox/chat/${chatId}`), {
              optimisticData: [...chat!, data[data.length - 1]],
              rollbackOnError: true,
            })
          }
        }
      })
    }
    login()

    return () => {
      changeStream?.return(null)
      realmUser?.logOut()
    }
  }, [chatId, chat, mutate, user])

  return null
}

export default useRealm
