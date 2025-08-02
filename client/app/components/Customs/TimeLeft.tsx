import { useEffect, useState } from 'react'

export default function TimeLeft({ endDate }: { endDate: Date | undefined}) {
    const [timeLeft, setTimeLeft] = useState("")
    useEffect(() => {
        if (!endDate) return

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = endDate.getTime() - now

            if (distance <= 0) {
                clearInterval(interval)
                setTimeLeft("")
                return
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        }, 1000)

        return () => clearInterval(interval)
    }, [endDate])
    return (
        <>
            {timeLeft && (
                <span className="text-sm text-gray-500">Termina en: {timeLeft}</span>
            )}
        </>
    )
}
