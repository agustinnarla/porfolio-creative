import gsap from "gsap"
import { d, initCard, magnetic } from "./motion.js"

const EMAIL = "arlaagustin1@gmail.com"

function contactAnimation() {
    const $contact = document.querySelector("[data-contact]")
    if (!$contact) return

    initCard($contact)
    $contact.querySelectorAll("[data-magnetic]").forEach((el) => magnetic(el))

    const $button = $contact.querySelector("[data-copy-email]")
    const $default = $contact.querySelector("[data-copy-default]")
    const $done = $contact.querySelector("[data-copy-done]")
    const $status = $contact.querySelector("[data-copy-status]")
    if (!$button) return

    let timeline

    $button.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(EMAIL)
        } catch {
            // Clipboard unavailable (permissions / insecure context): open the mail client instead
            window.location.href = `mailto:${EMAIL}`
            return
        }

        if ($status) $status.textContent = `Email copiado: ${EMAIL}`

        timeline?.kill()
        timeline = gsap
            .timeline()
            .to($default, { yPercent: -120, duration: d(0.35), ease: "power3.in" })
            .fromTo($done, { yPercent: 120, opacity: 1 }, { yPercent: 0, duration: d(0.5), ease: "back.out(2)" })
            .to($done, { yPercent: -120, duration: d(0.35), ease: "power3.in" }, "+=1.6")
            .fromTo($default, { yPercent: 120 }, { yPercent: 0, duration: d(0.5), ease: "expo.out" })
            .add(() => $status && ($status.textContent = ""))
    })
}

export default contactAnimation
