import gsap from "gsap"

export const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
export const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches

/** Duration helper: everything is instant for reduced-motion users */
export const d = (seconds) => (reduced ? 0 : seconds)

const INTRO_EVENT = "intro:done"

export function markIntroDone() {
    window.__introDone = true
    window.dispatchEvent(new Event(INTRO_EVENT))
}

export function onIntroDone(callback) {
    if (window.__introDone) callback()
    else window.addEventListener(INTRO_EVENT, callback, { once: true })
}

/** Updates --x / --y so the CSS spotlight in .card follows the pointer */
export function spotlight(el) {
    if (!hasHover) return
    el.addEventListener("pointermove", (event) => {
        const rect = el.getBoundingClientRect()
        el.style.setProperty("--x", `${event.clientX - rect.left}px`)
        el.style.setProperty("--y", `${event.clientY - rect.top}px`)
    })
}

/** Subtle 3D tilt towards the pointer */
export function tilt(el, { max = 3 } = {}) {
    if (!hasHover || reduced) return

    gsap.set(el, { transformPerspective: 1200 })
    const rotateX = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" })
    const rotateY = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" })

    el.addEventListener("pointermove", (event) => {
        const rect = el.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width - 0.5
        const py = (event.clientY - rect.top) / rect.height - 0.5
        rotateY(px * max)
        rotateX(-py * max)
    })

    el.addEventListener("pointerleave", () => {
        rotateX(0)
        rotateY(0)
    })
}

/** Element drifts towards the pointer while hovered */
export function magnetic(el, { strength = 0.35 } = {}) {
    if (!hasHover || reduced) return

    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" })
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" })

    el.addEventListener("pointermove", (event) => {
        const rect = el.getBoundingClientRect()
        x((event.clientX - (rect.left + rect.width / 2)) * strength)
        y((event.clientY - (rect.top + rect.height / 2)) * strength)
    })

    el.addEventListener("pointerleave", () => {
        x(0)
        y(0)
    })
}

export function initCard(el, options) {
    if (!el) return
    spotlight(el)
    tilt(el, options)
}
