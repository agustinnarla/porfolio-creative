import gsap from "gsap";

const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

function loadingAnimation() {
  const $screen = document.querySelector("[data-trigger-screen]");
  const $title = document.querySelector("[data-trigger-title]");
  const $subtitle = document.querySelector("[data-trigger-subtitle]");
  const $main = document.querySelector("[data-trigger-main]");

  if (!$screen || !$title || !$subtitle || !$main) return;

  if (isReducedMotion) {
    gsap.set($screen, { opacity: 0, pointerEvents: "none" });
    gsap.set($main, { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline();

  tl.fromTo(
    $title,
    { clipPath: "inset(0 100% 0 0)" },
    { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power2.out" }
  )
  .fromTo(
    $subtitle,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
  )
  .to($screen, {
    opacity: 0,
    pointerEvents: "none",
    duration: 1,
    ease: "power2.inOut",
  })
  .fromTo(
    $main,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
    "-=0.3"
  );
}

export default loadingAnimation;
