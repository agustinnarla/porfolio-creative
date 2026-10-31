import gsap from "gsap"
import { createModalA11y } from "./modal.js"

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

    if (!$section || !cards.length || !modal) return

    const a11y = createModalA11y(modal, { onClose: closeModal })
    let isOpen = false
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

    function bringToFront(card) {
        const index = stack.indexOf(card)
        if (index <= 0) return

        stack.splice(index, 1)
        stack.unshift(card)

        updateStack()

        gsap.fromTo(
            card,
            { x: 120, rotation: 8, scale: 0.9 },
            { x: 0, rotation: -1, scale: 1, duration: isReducedMotion ? 0 : 0.7, ease: "power3.out", overwrite: "auto" }
        )
    }

    updateStack()

    stack.forEach((card) => {
        card.addEventListener("click", () => bringToFront(card))
        // Keyboard users tab through the "Ver detalle" buttons; show the card that holds the focused one
        card.addEventListener("focusin", () => bringToFront(card))
    })

    function renderTechnologies(technologies) {
        modalTechnologies.replaceChildren(
            ...technologies.map((technology) => {
                const tag = document.createElement("span")
                tag.className = "rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-700"
                tag.textContent = technology
                return tag
            })
        )
    }

    function setLink(link, href, label) {
        link.hidden = !href
        link.href = href || "#"
        link.setAttribute("aria-label", label)
    }

    detailButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            if (isOpen) return
            isOpen = true

            const { projectType, projectTitle, projectDescription, projectTechnologies, projectGithub, projectDemo } = button.dataset
            const title = projectTitle ?? ""

            modalType.textContent = projectType ?? "";
            modalTitle.textContent = title;
            modalDescription.textContent = projectDescription ?? "";
            renderTechnologies(projectTechnologies ? projectTechnologies.split(",") : [])
            setLink(modalGithub, projectGithub, `Código de ${title} en GitHub (se abre en una pestaña nueva)`)
            setLink(modalDemo, projectDemo, `Demo de ${title} (se abre en una pestaña nueva)`)

            gsap.killTweensOf(modalContent)
            modal.classList.remove("hidden");
            modal.classList.add("flex");

            gsap.fromTo(
                modalContent,
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: isReducedMotion ? 0 : 0.4, ease: "power3.out" }
            );

            a11y.activate(closeButton)
        });
    });

    closeButton?.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        if (!isOpen) return
        isOpen = false
        a11y.deactivate()
        gsap.killTweensOf(modalContent)

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
