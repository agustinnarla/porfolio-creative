import gsap from "gsap";

const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const hasHover = window.matchMedia("(hover: hover)").matches

function contactAnimation() {
    const $contact = document.querySelector("[data-trigger-contact]");
    if (!$contact || !hasHover) return;

    $contact.addEventListener("mouseenter", () => {
        gsap.killTweensOf($contact);
        gsap.to($contact, { scale: 1.05, duration: isReducedMotion ? 0 : 0.4, y: -10, x: 20, ease: "power2.out" });
    });

    $contact.addEventListener("mouseleave", () => {
        gsap.killTweensOf($contact);
        gsap.to($contact, { scale: 1, y: 0, x: 0, duration: isReducedMotion ? 0 : 0.4, ease: "power2.out" });
    });
}

export default contactAnimation
