export function BackgroundPattern() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {/* Base dark background */}
            <div className="absolute inset-0 bg-[#0a0f1c]" />

            {/* Dotted pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.3]"
                style={{
                    backgroundImage: `radial-gradient(circle, #2a2f3e 1.5px, transparent 1.5px)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                }}
            />

            {/* Additional accent dots for depth */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `radial-gradient(circle, #4285f4 1.5px, transparent 1.5px)`,
                    backgroundSize: '40px 40px',
                    backgroundPosition: '20px 20px'
                }}
            />

            {/* Gradient overlay for fade effect */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1c]/30 to-[#0a0f1c]/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c]/20 via-transparent to-[#0a0f1c]/20" />
            </div>
        </div>
    )
}