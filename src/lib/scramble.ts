const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*'

export function scrambleText(
  el: HTMLElement,
  finalText: string,
  options?: { duration?: number; fps?: number },
) {
  const duration = options?.duration ?? 900
  const fps = options?.fps ?? 28
  const frameTime = 1000 / fps
  const start = performance.now()
  let last = 0
  let frame = 0

  const tick = (now: number) => {
    if (now - last < frameTime) {
      frame = requestAnimationFrame(tick)
      return
    }
    last = now
    const t = Math.min(1, (now - start) / duration)
    const reveal = Math.floor(t * finalText.length)
    let out = ''
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ' || finalText[i] === '\n') {
        out += finalText[i]
        continue
      }
      if (i < reveal) out += finalText[i]
      else out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    el.textContent = out
    if (t < 1) frame = requestAnimationFrame(tick)
    else el.textContent = finalText
  }

  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}
