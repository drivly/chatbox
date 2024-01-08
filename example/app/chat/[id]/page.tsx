import ChatBoxAdminRoot from '@drivly/chatbox/admin'

const AdminPage = async ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ChatBoxAdminRoot params={params} />
    </div>
  )
}

export default AdminPage
