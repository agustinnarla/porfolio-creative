import gsap from "gsap"
import { d } from "./motion.js"

/**
 * Animated wrapper around a native <dialog>.
 * The browser handles the focus trap, the top layer and returning focus;
 * this adds the GSAP enter/leave and closes on Escape or backdrop click.
 *
 * Markup: dialog.modal > [data-modal-backdrop] + [data-modal-panel],
 * [data-modal-close] buttons and optional [data-modal-stagger] children.
 */
export function createModal(dialog, { onClose } = {}) {
    const panel = dialog.querySelector("[data-modal-panel]")
    const backdrop = dialog.querySelector("[data-modal-backdrop]")
    let closing = false

    const items = () => panel.querySelectorAll("[data-modal-stagger]")

    function open() {
        if (dialog.open) return
        closing = false
        dialog.showModal()
        gsap.killTweensOf([panel, backdrop, ...items()])

        gsap.timeline()
            .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: d(0.4), ease: "power2.out" })
            .fromTo(
                panel,
                { y: 80, autoAlpha: 0, scale: 0.94, rotation: -1.5 },
                { y: 0, autoAlpha: 1, scale: 1, rotation: 0, duration: d(0.9), ease: "expo.out" },
                "<0.05"
            )
            .fromTo(
                items(),
                { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: d(0.7), stagger: 0.05, ease: "expo.out" },
                "<0.15"
            )
    }

    function close() {
        if (!dialog.open || closing) return
        closing = true
        gsap.killTweensOf([panel, backdrop, ...items()])

        gsap.timeline({
            onComplete() {
                dialog.close()
                closing = false
                gsap.set([panel, backdrop, ...items()], { clearProps: "all" })
                onClose?.()
            },
        })
            .to(panel, { y: 50, autoAlpha: 0, scale: 0.97, duration: d(0.35), ease: "power3.in" })
            .to(backdrop, { autoAlpha: 0, duration: d(0.3) }, "<0.1")
    }

    dialog.addEventListener("cancel", (event) => {
        event.preventDefault()
        close()
    })
    backdrop?.addEventListener("click", close)
    dialog.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", close))

    return { open, close }
}
