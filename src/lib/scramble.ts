const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*&%'

export function scrambleText(el: HTMLElement, finalText: string, duration = 1000) {
  const start = performance.now()
  let frame = 0
  let last = 0

  const tick = (now: number) => {
    if (now - last < 32) {
      frame = requestAnimationFrame(tick)
      return
    }
    last = now
    const t = Math.min(1, (now - start) / duration)
    const reveal = Math.floor(t * finalText.length)
    let out = ''
    for (let i = 0; i < finalText.length; i++) {
      const ch = finalText[i]
      if (ch === ' ' || ch === '.') {
        out += ch
        continue
      }
      out += i < reveal ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    el.textContent = out
    if (t < 1) frame = requestAnimationFrame(tick)
    else el.textContent = finalText
  }

  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}
