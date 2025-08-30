import MessagesView from "./MessagesView"

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
        <h2 className="text-3xl font-bold text-white mb-2">Messages</h2>
        <p className="text-synqit-muted-foreground">
          Communicate with your Web3 partners and manage all your conversations
          in one place.
        </p>
      </div>

      <MessagesView />
    </div>
  )
}
