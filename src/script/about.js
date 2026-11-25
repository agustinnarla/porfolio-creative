import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { createModal } from "./modal.js"
import { reduced, hasHover, initCard, onIntroDone } from "./motion.js"

gsap.registerPlugin(SplitText)

function aboutAnimation() {
    const $about = document.querySelector("[data-about]")
    const $blob = document.querySelector("[data-about-blob]")
    const $name = document.querySelector("[data-about-name]")
    const $role = document.querySelector("[data-about-role]")
    const $open = document.querySelector("[data-about-open]")
    const $modal = document.querySelector("[data-about-modal]")

    if (!$about) return

    initCard($about, { max: 2.5 })

    if ($modal && $open) {
        const modal = createModal($modal)
        $open.addEventListener("click", modal.open)
    }

    // Name: letters rise from a mask once the intro hands over
    if (!reduced && $name) {
        const split = SplitText.create($name, { type: "chars,lines", mask: "lines" })
        gsap.set(split.chars, { yPercent: 110 })
        gsap.set($role, { autoAlpha: 0, y: 20 })

        onIntroDone(() => {
            gsap.timeline({ delay: 0.25 })
                .to(split.chars, { yPercent: 0, duration: 1.2, stagger: 0.04, ease: "expo.out" })
                .to($role, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out" }, "-=0.9")
                .add(() => split.revert())
        })
    }

    if (!$blob || reduced) return

    // Ambient drift; the pointer takes over while hovering
    const rect = () => $about.getBoundingClientRect()
    gsap.set($blob, { xPercent: -50, yPercent: -50, x: rect().width * 0.85, y: rect().height * 0.15 })

    const drift = gsap.to($blob, {
        x: () => rect().width * 0.65,
        y: () => rect().height * 0.4,
        scale: 1.25,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
    })

    if (!hasHover) return

    const blobX = gsap.quickTo($blob, "x", { duration: 1.2, ease: "power3" })
    const blobY = gsap.quickTo($blob, "y", { duration: 1.2, ease: "power3" })

    $about.addEventListener("pointerenter", () => {
        drift.pause()
        gsap.to($blob, { opacity: 0.9, scale: 1.1, duration: 0.8, ease: "power2.out" })
    })
    $about.addEventListener("pointermove", (event) => {
        const r = rect()
        blobX(event.clientX - r.left)
        blobY(event.clientY - r.top)
    })
    $about.addEventListener("pointerleave", () => {
        gsap.to($blob, { opacity: 0.5, scale: 1, duration: 0.8, ease: "power2.out", onComplete: () => drift.invalidate().restart() })
    })
}

export default aboutAnimation
