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
