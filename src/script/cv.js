import gsap from "gsap";

const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const hasHover = window.matchMedia("(hover: hover)").matches

function cvAnimation() {
    const $cv = document.querySelector("[data-trigger-cv]");
    if (!$cv || !hasHover) return;

    $cv.addEventListener("mouseenter", () => {
        gsap.killTweensOf($cv);
        gsap.to($cv, { scale: 1.05, duration: isReducedMotion ? 0 : 0.4, y: 20, ease: "power2.out" });
    });

    $cv.addEventListener("mouseleave", () => {
        gsap.killTweensOf($cv);
        gsap.to($cv, { scale: 1, y: 0, duration: isReducedMotion ? 0 : 0.4, ease: "power2.out" });
    });
}

export default cvAnimation
