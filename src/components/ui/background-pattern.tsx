export function BackgroundPattern() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {/* Base dark background */}
            <div className="absolute inset-0 bg-[#0a0f1c]" />

            {/* Geometric patterns */}
            <div className="absolute inset-0 opacity-20">
                {/* Top left pattern */}
                <svg className="absolute top-20 left-10 w-64 h-32" viewBox="0 0 256 128" fill="none">
                    <path d="M0 64L32 48L64 64L96 48L128 64L160 48L192 64L224 48L256 64" stroke="#2a2f3e" strokeWidth="1" />
                    <path d="M0 80L32 64L64 80L96 64L128 80L160 64L192 80L224 64L256 80" stroke="#2a2f3e" strokeWidth="1" />
                    <path d="M0 96L32 80L64 96L96 80L128 96L160 80L192 96L224 80L256 96" stroke="#2a2f3e" strokeWidth="1" />
                </svg>

                {/* Top right pattern */}
                <svg className="absolute top-32 right-10 w-64 h-32" viewBox="0 0 256 128" fill="none">
                    <path d="M0 32L32 48L64 32L96 48L128 32L160 48L192 32L224 48L256 32" stroke="#2a2f3e" strokeWidth="1" />
                    <path d="M0 48L32 64L64 48L96 64L128 48L160 64L192 48L224 64L256 48" stroke="#2a2f3e" strokeWidth="1" />
                    <path d="M0 64L32 80L64 64L96 80L128 64L160 80L192 64L224 80L256 64" stroke="#2a2f3e" strokeWidth="1" />
                </svg>

                {/* Bottom left pattern */}
                <svg className="absolute bottom-32 left-20 w-64 h-32" viewBox="0 0 256 128" fill="none">
                    <path d="M0 64L32 48L64 64L96 48L128 64L160 48L192 64L224 48L256 64" stroke="#2a2f3e" strokeWidth="1" />
                    <path d="M0 80L32 64L64 80L96 64L128 80L160 64L192 80L224 64L256 80" stroke="#2a2f3e" strokeWidth="1" />
                </svg>

                {/* Bottom right pattern */}
                <svg className="absolute bottom-20 right-20 w-64 h-32" viewBox="0 0 256 128" fill="none">
                    <path d="M0 32L32 48L64 32L96 48L128 32L160 48L192 32L224 48L256 32" stroke="#2a2f3e" strokeWidth="1" />
                    <path d="M0 48L32 64L64 48L96 64L128 48L160 64L192 48L224 64L256 48" stroke="#2a2f3e" strokeWidth="1" />
                </svg>

                {/* Center patterns */}
                <svg
                    className="absolute top-1/2 left-1/4 w-48 h-24 transform -translate-y-1/2"
                    viewBox="0 0 192 96"
                    fill="none"
                >
                    <path d="M0 48L24 32L48 48L72 32L96 48L120 32L144 48L168 32L192 48" stroke="#2a2f3e" strokeWidth="1" />
                    <path d="M0 64L24 48L48 64L72 48L96 64L120 48L144 64L168 48L192 64" stroke="#2a2f3e" strokeWidth="1" />
                </svg>

                <svg
                    className="absolute top-1/2 right-1/4 w-48 h-24 transform -translate-y-1/2"
                    viewBox="0 0 192 96"
                    fill="none"
                >
                    <path d="M0 32L24 48L48 32L72 48L96 32L120 48L144 32L168 48L192 32" stroke="#2a2f3e" strokeWidth="1" />
                    <path d="M0 48L24 64L48 48L72 64L96 48L120 64L144 48L168 64L192 48" stroke="#2a2f3e" strokeWidth="1" />
                </svg>
            </div>
        </div>
    )
}
