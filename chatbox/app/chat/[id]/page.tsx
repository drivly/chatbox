import ChatBoxAdminRoot from '../../../components/admin'

const AdminPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ChatBoxAdminRoot params={params} />
    </div>
  )
}

export default AdminPage
