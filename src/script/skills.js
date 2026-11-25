import gsap from "gsap"
import { reduced, hasHover, initCard } from "./motion.js"

function skillsAnimation() {
    const $skills = document.querySelector("[data-skills]")
    if (!$skills) return

    initCard($skills)

    if (reduced) return

    // Each row holds two identical tracks; moving by one track width loops seamlessly
    const loops = gsap.utils.toArray("[data-marquee]", $skills).map((row) => {
        const direction = Number(row.dataset.direction)
        const track = row.querySelector("[data-marquee-track]")
        const width = () => track.offsetWidth

        gsap.set(row, { x: direction > 0 ? () => -width() : 0 })
        return gsap.to(row, {
            x: direction > 0 ? 0 : () => -width(),
            duration: 28,
            ease: "none",
            repeat: -1,
        })
    })

    // Slow down while hovered so chips can be read
    if (hasHover) {
        $skills.addEventListener("pointerenter", () => loops.forEach((loop) => gsap.to(loop, { timeScale: 0.25, duration: 0.6 })))
        $skills.addEventListener("pointerleave", () => loops.forEach((loop) => gsap.to(loop, { timeScale: 1, duration: 0.6 })))

        $skills.querySelectorAll("[data-skill]").forEach((chip) => {
            chip.addEventListener("pointerenter", () =>
                gsap.to(chip, { y: -4, backgroundColor: "#141414", color: "#f4f2ec", duration: 0.3, ease: "power2.out" })
            )
            chip.addEventListener("pointerleave", () =>
                gsap.to(chip, { y: 0, backgroundColor: "#ffffff", color: "#141414", duration: 0.4, ease: "power2.out" })
            )
        })
    }

    window.addEventListener("resize", () => loops.forEach((loop) => loop.invalidate()))
}

export default skillsAnimation
