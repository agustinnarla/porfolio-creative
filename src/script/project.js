import gsap from "gsap"

const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const hasHover = window.matchMedia("(hover: hover)").matches

function projectAnimation() {

    const $section = document.querySelector("[data-trigger-project]")
    const cards = gsap.utils.toArray("[data-project-card]")

    const modal = document.querySelector("[data-project-modal]");
    const modalContent = document.querySelector("[data-project-modal-content]");
    const closeButton = document.querySelector("[data-project-modal-close]");

    const modalType = document.querySelector("[data-modal-type]");
    const modalTitle = document.querySelector("[data-modal-title]");
    const modalDescription = document.querySelector("[data-modal-description]");
    const modalTechnologies = document.querySelector("[data-modal-technologies]");
    const modalGithub = document.querySelector("[data-modal-github]")
    const modalDemo = document.querySelector("[data-modal-demo]")

    const detailButtons = document.querySelectorAll("[data-project-detail]");

    if (!$section || !cards.length) return

    let stack = [...cards]

    if (hasHover) {
        $section.addEventListener("mouseenter", () => {
            gsap.killTweensOf($section);
            gsap.to($section, {
                scale: 1.05,
                duration: isReducedMotion ? 0 : 0.4,
                y: -10,
                ease: "power2.out"
            });
        });

        $section.addEventListener("mouseleave", () => {
            gsap.killTweensOf($section);
            gsap.to($section, {
                scale: 1,
                y: 0,
                duration: isReducedMotion ? 0 : 0.4,
                ease: "power2.out"
            });
        });
    }

    function updateStack() {
        stack.forEach((card, index) => {
            gsap.to(card, {
                x: 0,
                y: index * 18,
                scale: 1 - index * 0.04,
                rotation: index % 2 === 0 ? -1 : 1,
                zIndex: stack.length - index,
                duration: isReducedMotion ? 0 : 0.6,
                ease: "power3.out"
            })
        })
    }

    updateStack()

    stack.forEach((card) => {
        card.addEventListener("click", () => {
            const index = stack.indexOf(card)
            if (index === 0) return

            stack.splice(index, 1)
            stack.unshift(card)

            updateStack()

            gsap.fromTo(
                card,
                { x: 120, rotation: 8, scale: 0.9 },
                { x: 0, rotation: 0, scale: 1, duration: isReducedMotion ? 0 : 0.7, ease: "power3.out" }
            )
        })
    })

    detailButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();

            const type = button.dataset.projectType;
            const title = button.dataset.projectTitle;
            const description = button.dataset.projectDescription;
            const technologies =
                button.dataset.projectTechnologies?.split(",") ?? [];
            const github = button.dataset.projectGithub
            const demo = button.dataset.projectDemo

            modalType.textContent = type ?? "";
            modalTitle.textContent = title ?? "";
            modalDescription.textContent = description ?? "";
            modalGithub.href = github
            modalDemo.href = demo

            modalTechnologies.innerHTML = technologies
                .map((technology) => `
                    <span class="rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-700">
                        ${technology}
                    </span>
                `)
                .join("");

            modal.classList.remove("hidden");
            modal.classList.add("flex");

            gsap.fromTo(
                modalContent,
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: isReducedMotion ? 0 : 0.4, ease: "power3.out" }
            );
        });
    });

    closeButton?.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        gsap.to(modalContent, {
            opacity: 0,
            scale: 0.9,
            y: 20,
            duration: isReducedMotion ? 0 : 0.25,
            ease: "power2.in",
            onComplete: () => {
                modal.classList.add("hidden");
                modal.classList.remove("flex");
                gsap.set(modalContent, { clearProps: "all" });
            }
        });
    }

}

export default projectAnimation
