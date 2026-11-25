import gsap from "gsap"
import { reduced, hasHover, initCard } from "./motion.js"

function cvAnimation() {
    const $cv = document.querySelector("[data-cv]")
    if (!$cv) return

    initCard($cv)

    const $front = $cv.querySelector("[data-cv-paper-front]")
    const $back = $cv.querySelector("[data-cv-paper-back]")
    if (!$front || !$back || reduced) return

    gsap.set($front, { rotation: 6, transformOrigin: "50% 100%" })
    gsap.set($back, { rotation: -4, transformOrigin: "50% 100%" })

    if (!hasHover) return

    const hover = gsap
        .timeline({ paused: true, defaults: { duration: 0.7, ease: "expo.out" } })
        .to($front, { rotation: -2, y: -36, scale: 1.04 })
        .to($back, { rotation: -10, x: -18, y: -14 }, "<")

    $cv.addEventListener("pointerenter", () => hover.play())
    $cv.addEventListener("pointerleave", () => hover.reverse())
}

export default cvAnimation
