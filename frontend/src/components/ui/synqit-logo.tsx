import { cn } from "@/lib/utils"
import Image from "next/image"

interface SynqitLogoProps {
    className?: string
}

export function SynqitLogo({ className }: SynqitLogoProps) {
    return (
        <Image
            src="/logo.svg"
            alt="Synqit Logo"
            width={100}
            height={100}
            className={cn("", className)}
            priority
        />
    )
}
