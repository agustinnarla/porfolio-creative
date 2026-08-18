import gsap from "gsap";

const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const hasHover = window.matchMedia("(hover: hover)").matches

function skillsLoading() {
    const $skill = document.querySelector("[data-trigger-skills]");
    if (!$skill || !hasHover) return;

    $skill.addEventListener("mouseenter", () => {
        gsap.killTweensOf($skill);
        gsap.to($skill, { scale: 1.05, duration: isReducedMotion ? 0 : 0.4, y: -10, x: 20, ease: "power2.out" });
    });

    $skill.addEventListener("mouseleave", () => {
        gsap.killTweensOf($skill);
        gsap.to($skill, { scale: 1, y: 0, x: 0, duration: isReducedMotion ? 0 : 0.4, ease: "power2.out" });
    });
}

export default skillsLoading
