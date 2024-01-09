import dynamic from 'next/dynamic'
const ChatBoxAdmin = dynamic(() => import('../../../components/admin'), {
  ssr: false,
})
const AdminPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ChatBoxAdmin params={params} />
    </div>
  )
}

export default AdminPage
