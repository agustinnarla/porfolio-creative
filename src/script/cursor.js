import gsap from "gsap"
import { reduced, hasHover } from "./motion.js"

/**
 * Dot + ring cursor. Elements with [data-cursor="Texto"] grow the ring and show a label;
 * any other link or button just grows it a bit.
 */
function cursor() {
    const $root = document.querySelector("[data-cursor-root]")
    const $dot = document.querySelector("[data-cursor-dot]")
    const $ring = document.querySelector("[data-cursor-ring]")
    const $label = document.querySelector("[data-cursor-label]")

    if (!$root || !hasHover || reduced) {
        $root?.remove()
        return
    }

    $root.classList.remove("hidden")
    gsap.set([$dot, $ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const dotX = gsap.quickTo($dot, "x", { duration: 0.1, ease: "power3" })
    const dotY = gsap.quickTo($dot, "y", { duration: 0.1, ease: "power3" })
    const ringX = gsap.quickTo($ring, "x", { duration: 0.5, ease: "power3" })
    const ringY = gsap.quickTo($ring, "y", { duration: 0.5, ease: "power3" })

    let visible = false
    let current = null

    window.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return
        if (!visible) {
            visible = true
            gsap.set([$dot, $ring], { x: event.clientX, y: event.clientY })
            gsap.to([$dot, $ring], { autoAlpha: 1, duration: 0.3 })
        }
        dotX(event.clientX)
        dotY(event.clientY)
        ringX(event.clientX)
        ringY(event.clientY)
    })

    document.documentElement.addEventListener("pointerleave", () => {
        visible = false
        gsap.to([$dot, $ring], { autoAlpha: 0, duration: 0.3 })
    })

    function setState(target) {
        if (target === current) return
        current = target
        const label = target?.dataset?.cursor

        gsap.to($ring, {
            width: label ? 92 : target ? 56 : 40,
            height: label ? 92 : target ? 56 : 40,
            backgroundColor: label ? "#141414" : "rgba(20,20,20,0)",
            borderColor: label ? "rgba(20,20,20,1)" : "rgba(20,20,20,0.4)",
            duration: 0.45,
            ease: "expo.out",
        })
        gsap.to($dot, { scale: target ? 0 : 1, duration: 0.3 })
        $label.textContent = label ?? ""
        gsap.to($label, { autoAlpha: label ? 1 : 0, duration: 0.25 })
    }

    document.addEventListener("pointerover", (event) => {
        setState(event.target.closest("[data-cursor], a, button") ?? null)
    })

    window.addEventListener("pointerdown", () => gsap.to($ring, { scale: 0.85, duration: 0.2 }))
    window.addEventListener("pointerup", () => gsap.to($ring, { scale: 1, duration: 0.4, ease: "back.out(3)" }))
}

export default cursor
