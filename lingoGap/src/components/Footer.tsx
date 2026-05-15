import { useCallback, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import kitty from '../assets/kitty.png'

type FooterProps = {
  isDark: boolean
}

export function Footer({ isDark }: FooterProps) {
  const [catXPercent, setCatXPercent] = useState(50)
  const [flip, setFlip] = useState(false)
  const lastHopRef = useRef(0)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const catRef = useRef<HTMLButtonElement | null>(null)

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    const cat = catRef.current
    if (!track || !cat) return

    const trackRect = track.getBoundingClientRect()
    const catRect = cat.getBoundingClientRect()
    if (trackRect.width === 0) return

    const catCenterX = catRect.left + catRect.width / 2
    const catCenterY = catRect.top + catRect.height / 2
    const dx = event.clientX - catCenterX
    const dy = event.clientY - catCenterY
    const distance = Math.hypot(dx, dy)

    const closeThreshold = 90
    if (distance > closeThreshold) return

    const edgeThreshold = 70
    const isNearLeft = catCenterX - trackRect.left < edgeThreshold
    const isNearRight = trackRect.right - catCenterX < edgeThreshold

    const now = performance.now()
    const minDelay = isNearLeft || isNearRight ? 80 : 160
    if (now - lastHopRef.current < minDelay) return
    lastHopRef.current = now

    const travel = 140
    let direction = dx < 0 ? 1 : -1
    let targetCenterX = catCenterX + direction * travel

    const randomBetween = (min: number, max: number) => {
      if (max <= min) return min
      return min + Math.random() * (max - min)
    }

    if (isNearLeft) {
      direction = 1
      const rightMin = trackRect.left + trackRect.width * 0.55
      const rightMax = trackRect.right - catRect.width / 2 - 12
      targetCenterX = randomBetween(rightMin, rightMax)
    } else if (isNearRight) {
      direction = -1
      const leftMin = trackRect.left + catRect.width / 2 + 12
      const leftMax = trackRect.left + trackRect.width * 0.45
      targetCenterX = randomBetween(leftMin, leftMax)
    }
    const minCenter = trackRect.left + catRect.width / 2
    const maxCenter = trackRect.right - catRect.width / 2
    const clampedCenterX = Math.min(maxCenter, Math.max(minCenter, targetCenterX))
    const nextPercent = ((clampedCenterX - trackRect.left) / trackRect.width) * 100

    setCatXPercent(nextPercent)
    setFlip(direction < 0)
  }, [])

  return (
    <footer className={`mt-10 border-t ${isDark ? 'border-zinc-800/80' : 'border-zinc-200/70'}`}>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="space-y-1 sm:w-[30%]">
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              LingoGap
            </p>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Practice dictation with smart translation.
            </p>
          </div>

          <div className="hidden w-full sm:block sm:w-[70%]">
            <div
              ref={trackRef}
              onPointerMove={handlePointerMove}
              className="relative h-16 w-full overflow-hidden"
            >
              <button
                type="button"
                aria-label="Runaway cat"
                ref={catRef}
                className={`absolute top-1/2 flex h-10 w-10 items-center justify-center leading-none transition-[transform,left] duration-150 ease-out ${
                  isDark ? 'text-zinc-200' : 'text-zinc-700'
                }`}
                style={{
                  left: `${catXPercent}%`,
                  transform: `translate(-50%, -50%) ${flip ? 'scaleX(-1)' : 'scaleX(1)'}`,
                }}
              >
                <span className="sr-only">Runaway cat</span>
                <img
                  src={kitty}
                  alt="Kitty"
                  className="block h-10 w-10 object-contain"
                  draggable={false}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
