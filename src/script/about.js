import gsap from "gsap"
import { createModalA11y } from "./modal.js"

const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const hasHover = window.matchMedia("(hover: hover)").matches

function aboutAnimation() {
    const $about = document.querySelector("[data-trigger-about]")
    const $bg = document.querySelector("[data-trigger-bg]")

    const $modalAbout = document.querySelector("[data-trigger-about-modal]")
    const $modalBg = document.querySelector("[data-trigger-about-modal-bg]")
    const $modalContent = document.querySelector("[data-trigger-about-modal-content]")
    const $modalClose = document.querySelector("[data-trigger-about-modal-close]")

    if (!$about || !$modalAbout) return;

    const a11y = createModalA11y($modalAbout, { onClose: closeModal })
    let isOpen = false

    gsap.set($bg, { opacity: 0 })

    if (hasHover) {
        $about.addEventListener("mouseenter", () => {
            gsap.killTweensOf($about)
            gsap.killTweensOf($bg)
            gsap.to($about, {
                scale: 1.05,
                duration: isReducedMotion ? 0 : 0.4,
                y: -10,
                x: -10,
                ease: "power2.out"
            })
            gsap.to($bg, {
                opacity: 1,
                duration: isReducedMotion ? 0 : 0.5,
                ease: "power2.in"
            })
        })

        $about.addEventListener("mouseleave", () => {
            gsap.killTweensOf($about)
            gsap.killTweensOf($bg)
            gsap.to($about, {
                scale: 1.00,
                y: 0,
                x: 0,
                duration: isReducedMotion ? 0 : 0.5,
                ease: "power2.out"
            })
            gsap.to($bg, {
                opacity: 0,
                duration: isReducedMotion ? 0 : 0.5,
                ease: "power2.in"
            })
        })
    }

    function openModal() {
        if (isOpen) return
        isOpen = true
        gsap.killTweensOf([$modalAbout, $modalContent])

        $modalAbout.classList.remove("hidden")
        $modalAbout.classList.add("flex")

        gsap.fromTo($modalAbout, { opacity: 0 }, {
            opacity: 1,
            duration: isReducedMotion ? 0 : 0.4
        })

        gsap.fromTo($modalContent, {
            y: 80,
            scale: 0.6,
            opacity: 0,
        }, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: isReducedMotion ? 0 : 0.6,
            ease: "power2.in"
        })

        a11y.activate($modalClose)
    }

    function closeModal() {
        if (!isOpen) return
        isOpen = false
        a11y.deactivate()
        gsap.killTweensOf([$modalAbout, $modalContent])

        gsap.to($modalContent, {
            y: 50,
            scale: 0.9,
            opacity: 0,
            duration: isReducedMotion ? 0 : 0.3,
            ease: "power3.in"
        })

        gsap.to($modalAbout, {
            opacity: 0,
            duration: isReducedMotion ? 0 : 0.3,
            onComplete: () => {
                $modalAbout.classList.add("hidden")
                $modalAbout.classList.remove("flex")
                gsap.set($modalAbout, { clearProps: "all" })
                gsap.set($modalContent, { clearProps: "all" })
            }
        })
    }

    $about.addEventListener("click", openModal)
    $about.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            openModal()
        }
    })
    $modalClose.addEventListener("click", closeModal)
    $modalBg.addEventListener("click", closeModal)
}

export default aboutAnimation
