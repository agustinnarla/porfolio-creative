import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { reduced, markIntroDone } from "./motion.js"

gsap.registerPlugin(SplitText)

function loadingAnimation() {
    const $loader = document.querySelector("[data-loader]")
    const $title = document.querySelector("[data-loader-title]")
    const $subtitle = document.querySelector("[data-loader-subtitle]")
    const $count = document.querySelector("[data-loader-count]")
    const $bar = document.querySelector("[data-loader-bar]")
    const $meta = document.querySelectorAll("[data-loader-meta]")
    const reveals = gsap.utils.toArray("[data-reveal]")

    if (!$loader || !$title || reduced) {
        $loader?.remove()
        gsap.set(reveals, { autoAlpha: 1 })
        markIntroDone()
        return
    }

    // Second visit in the same tab: shorter intro
    let seen = false
    try {
        seen = sessionStorage.getItem("intro-seen") === "1"
        sessionStorage.setItem("intro-seen", "1")
    } catch {
        // storage blocked: play the full intro
    }

    const loadTime = seen ? 0.5 : 1.6

    function run() {
        const split = SplitText.create($title, { type: "chars", mask: "chars" })
        const counter = { value: 0 }

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } })

        tl.from(split.chars, { yPercent: 115, duration: 1.1, stagger: 0.035 })
            .from($subtitle, { autoAlpha: 0, y: 16, duration: 0.8 }, "-=0.8")
            .from($meta, { autoAlpha: 0, duration: 0.6 }, "<")
            .to(
                counter,
                {
                    value: 100,
                    duration: loadTime,
                    ease: "power2.inOut",
                    onUpdate: () => ($count.textContent = String(Math.round(counter.value))),
                },
                0.15
            )
            .to($bar, { scaleX: 1, duration: loadTime, ease: "power2.inOut" }, 0.15)
            .to(split.chars, { yPercent: -115, duration: 0.7, stagger: 0.015, ease: "expo.in" }, ">0.1")
            .to([$subtitle, $count, $bar.parentElement, ...$meta], { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, "<")
            .to($loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=0.15")
            .add(markIntroDone, "-=0.55")
            .fromTo(
                reveals,
                { autoAlpha: 0, y: 70, rotation: (i) => (i % 2 ? 1.5 : -1.5) },
                {
                    autoAlpha: 1,
                    y: 0,
                    rotation: 0,
                    duration: 1.3,
                    stagger: 0.07,
                    clearProps: "transform",
                },
                "<0.55"
            )
            .add(() => {
                $loader.remove()
                split.revert()
            })
    }

    // Wait for the fonts so SplitText measures the real glyphs (with a safety timeout)
    Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1200))]).then(run)
}

export default loadingAnimation
