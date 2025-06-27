'use client'

import { useState } from "react"
import Image from "next/image"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

interface Notification {
    id: string
    sender: string
    avatar: string
    title: string
    description: string
    timestamp: Date
}

const notifications: Notification[] = [
    {
        id: "1",
        sender: "WeSoost",
        avatar: "/avatars/avatar1.png",
        title: "New Partnership Request from WeSoost!",
        description: "WeSoost is interested in partnering with Mintrise for potential collaboration.",
        timestamp: new Date()
    },
    {
        id: "2", 
        sender: "ShortletLagos",
        avatar: "/avatars/avatar2.png",
        title: "New Partnership Request from WeSoost!",
        description: "WeSoost is interested in partnering with Mintrise for potential collaboration.",
        timestamp: new Date()
    }
]

interface NotificationDrawerProps {
    children: React.ReactNode
}

export function NotificationDrawer({ children }: NotificationDrawerProps) {
    const [open, setOpen] = useState(false)

    const handleViewRequest = (notificationId: string) => {
        console.log("View request:", notificationId)
        // Handle view request logic here
    }

    const handleIgnoreRequest = (notificationId: string) => {
        console.log("Ignore request:", notificationId)
        // Handle ignore request logic here
    }

    const handleDismissNotification = (notificationId: string) => {
        console.log("Dismiss notification:", notificationId)
        // Handle dismiss notification logic here
    }

    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="h-full w-[500px] fixed right-0 top-0 bg-[#0a0f1c] border-l border-synqit-border">
                <DrawerHeader className="border-b border-synqit-border px-6 py-4">
                    <DrawerTitle className="text-xl font-bold text-white">
                        Notifications
                    </DrawerTitle>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-xl p-4 relative"
                            >
                                {/* Dismiss Button */}
                                <button 
                                    onClick={() => handleDismissNotification(notification.id)}
                                    className="absolute top-3 right-3 p-1 text-synqit-muted-foreground hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Notification Content */}
                                <div className="flex items-start gap-3 mb-4">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={notification.avatar}
                                            alt={notification.sender}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Title with Warning Icon */}
                                        <div className="flex items-start gap-2 mb-2">
                                            <div className="mt-0.5">
                                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                                                </svg>
                                            </div>
                                            <h3 className="text-white text-sm font-medium leading-tight">
                                                {notification.title}
                                            </h3>
                                        </div>

                                        {/* Description */}
                                        <p className="text-synqit-muted-foreground text-sm mb-4 leading-relaxed">
                                            {notification.description}
                                        </p>

                                        <p className="text-synqit-muted-foreground text-sm mb-4">
                                            Check out their profile and decide whether to accept their request
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleViewRequest(notification.id)}
                                        className="flex-1 bg-synqit-primary hover:bg-synqit-primary/80 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors"
                                    >
                                        View Request
                                    </button>
                                    <button 
                                        onClick={() => handleIgnoreRequest(notification.id)}
                                        className="flex-1 bg-synqit-surface/50 hover:bg-synqit-surface border border-synqit-border text-synqit-muted-foreground hover:text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors"
                                    >
                                        Ignore Request
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {notifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-synqit-surface/50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-synqit-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V7a4 4 0 00-8 0v5l-5 5h5m7 0a3 3 0 11-6 0" />
                                </svg>
                            </div>
                            <h3 className="text-white text-lg font-medium mb-2">No notifications</h3>
                            <p className="text-synqit-muted-foreground text-sm">You're all caught up! New notifications will appear here.</p>
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
