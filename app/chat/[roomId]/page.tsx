import { ChatContainer } from "@/components/chat-container"

export default function RoomPage({ params }: { params: { roomId: string } }) {
  return <ChatContainer roomId={params.roomId} />
}
