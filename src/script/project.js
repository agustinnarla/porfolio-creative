import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import { createModal } from "./modal.js"
import { reduced, hasHover, d, spotlight, onIntroDone } from "./motion.js"

gsap.registerPlugin(Draggable)

const VISIBLE_BEHIND = 3

function projectAnimation() {
    const $section = document.querySelector("[data-projects]")
    const $stack = document.querySelector("[data-project-stack]")
    const cards = gsap.utils.toArray("[data-project-card]")
    const $current = document.querySelector("[data-project-current]")
    const $live = document.querySelector("[data-project-live]")
    const $prev = document.querySelector("[data-project-prev]")
    const $next = document.querySelector("[data-project-next]")
    const $json = document.querySelector("[data-projects-json]")

    if (!$section || !$stack || !cards.length) return

    const projects = $json ? JSON.parse($json.textContent) : []
    let order = [...cards]
    let busy = false

    spotlight($section)

    /* ---------- Stack layout ---------- */

    function slot(index) {
        const hidden = index > VISIBLE_BEHIND
        return {
            x: 0,
            y: Math.min(index, VISIBLE_BEHIND) * 13,
            scale: 1 - Math.min(index, VISIBLE_BEHIND) * 0.045,
            rotation: index === 0 ? 0 : index % 2 ? 1.2 : -1.2,
            zIndex: cards.length - index,
            autoAlpha: hidden ? 0 : 1,
        }
    }

    function layout(duration = 0.8) {
        order.forEach((card, index) => {
            gsap.to(card, { ...slot(index), duration: d(duration), ease: "expo.out", overwrite: "auto" })

            const isFront = index === 0
            card.inert = !isFront
            card.toggleAttribute("aria-hidden", !isFront)
            draggables.get(card)?.[isFront ? "enable" : "disable"]()
        })

        const position = cards.indexOf(order[0])
        if ($current) $current.textContent = String(position + 1).padStart(2, "0")
        if ($live) $live.textContent = `Proyecto ${position + 1} de ${cards.length}: ${projects[position]?.title ?? ""}`
    }

    /** Front card leaves towards `direction` (-1 left, 1 right) and goes to the back */
    function sendToBack(direction = -1) {
        if (busy) return
        busy = true
        const card = order[0]
        const width = $stack.offsetWidth

        gsap.to(card, {
            x: direction * width * 1.15,
            rotation: direction * 14,
            duration: d(0.45),
            ease: "power2.in",
            overwrite: "auto",
            onComplete: () => {
                order.push(order.shift())
                gsap.set(card, { zIndex: 0 })
                layout()
                busy = false
            },
        })
    }

    /** Last card comes back to the front from the right */
    function bringBack() {
        if (busy) return
        busy = true
        const card = order.pop()
        order.unshift(card)

        gsap.set(card, {
            x: $stack.offsetWidth * 1.15,
            rotation: 14,
            zIndex: cards.length + 1,
            autoAlpha: 1,
        })
        layout()
        gsap.delayedCall(d(0.35), () => (busy = false))
    }

    /* ---------- Drag ---------- */

    const draggables = new Map()

    cards.forEach((card) => {
        const [draggable] = Draggable.create(card, {
            type: "x",
            zIndexBoost: false,
            dragClickables: false,
            minimumMovement: 6,
            onPress() {
                gsap.killTweensOf(card, "rotation")
            },
            onDrag() {
                gsap.set(card, { rotation: this.x * 0.04 })
            },
            onRelease() {
                const threshold = $stack.offsetWidth * 0.22
                if (Math.abs(this.x) > threshold) {
                    sendToBack(Math.sign(this.x))
                } else {
                    gsap.to(card, { x: 0, rotation: 0, duration: d(0.9), ease: "elastic.out(1, 0.6)" })
                }
            },
        })
        draggables.set(card, draggable)
    })

    $next?.addEventListener("click", () => sendToBack(-1))
    $prev?.addEventListener("click", bringBack)

    $section.addEventListener("keydown", (event) => {
        if (event.target.closest("dialog")) return
        if (event.key === "ArrowRight") sendToBack(-1)
        if (event.key === "ArrowLeft") bringBack()
    })

    /* ---------- Visual parallax on the front card ---------- */

    if (hasHover && !reduced) {
        cards.forEach((card) => {
            const $visual = card.querySelector("[data-project-visual]")
            if (!$visual) return
            const vx = gsap.quickTo($visual, "x", { duration: 0.9, ease: "power3" })
            const vy = gsap.quickTo($visual, "y", { duration: 0.9, ease: "power3" })

            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect()
                vx(((event.clientX - rect.left) / rect.width - 0.5) * -24)
                vy(((event.clientY - rect.top) / rect.height - 0.5) * -24)
            })
            card.addEventListener("pointerleave", () => {
                vx(0)
                vy(0)
            })
        })
    }

    /* ---------- Intro ---------- */

    order.forEach((card, index) => gsap.set(card, slot(index)))
    layout(0)

    if (!reduced) {
        gsap.set(cards, { y: "+=160", rotation: (i) => (i % 2 ? 10 : -10), autoAlpha: 0 })
        onIntroDone(() => {
            order.forEach((card, index) => {
                gsap.to(card, {
                    ...slot(index),
                    duration: 1.4,
                    delay: 0.35 + (order.length - index) * 0.07,
                    ease: "expo.out",
                })
            })
        })
    }

    /* ---------- Modal ---------- */

    const $modal = document.querySelector("[data-project-modal]")
    if (!$modal) return

    const $media = $modal.querySelector("[data-modal-media]")
    const $number = $modal.querySelector("[data-modal-number]")
    const $type = $modal.querySelector("[data-modal-type]")
    const $title = $modal.querySelector("[data-modal-title]")
    const $description = $modal.querySelector("[data-modal-description]")
    const $technologies = $modal.querySelector("[data-modal-technologies]")
    const $github = $modal.querySelector("[data-modal-github]")
    const $demo = $modal.querySelector("[data-modal-demo]")
    const $demoLabel = $modal.querySelector("[data-modal-demo-label]")
    const $private = $modal.querySelector("[data-modal-private]")

    const modal = createModal($modal, {
        onClose: () => $media.querySelector("video")?.pause(),
    })

    function renderMedia(project) {
        $media.style.background = project.bg
        $media.style.color = project.fg

        if (project.video) {
            const video = document.createElement("video")
            Object.assign(video, {
                src: project.video,
                poster: project.poster ?? "",
                muted: true,
                loop: true,
                playsInline: true,
                controls: true,
                autoplay: !reduced,
                preload: "metadata",
            })
            video.setAttribute("aria-label", `Video demo de ${project.title}`)
            video.className = "relative max-h-[70svh] w-auto max-w-[260px] rounded-[1.6rem] border-[6px] border-[#1d1530] shadow-2xl md:max-h-[480px]"
            $media.replaceChildren(video)
            return
        }

        const number = document.createElement("span")
        number.setAttribute("aria-hidden", "true")
        number.className = "font-script text-[10rem] leading-none opacity-20 md:text-[16rem]"
        number.textContent = String(project.id).padStart(2, "0")

        const title = document.createElement("span")
        title.setAttribute("aria-hidden", "true")
        title.className = "absolute bottom-6 left-6 right-6 text-3xl font-semibold uppercase leading-[0.9] tracking-tight"
        title.textContent = project.details

        $media.replaceChildren(number, title)
    }

    function openProject(index) {
        const project = projects[index]
        if (!project) return

        renderMedia(project)
        $number.textContent = `${String(project.id).padStart(2, "0")}.`
        $type.textContent = project.type
        $title.textContent = project.title
        $description.textContent = project.description
        $technologies.replaceChildren(
            ...project.technologies.map((tech) => {
                const li = document.createElement("li")
                li.className = "chip text-sm"
                li.textContent = tech
                return li
            })
        )

        $github.hidden = !project.github
        $github.href = project.github || "#"
        $github.setAttribute("aria-label", `Código de ${project.title} en GitHub (se abre en una pestaña nueva)`)
        $private.hidden = Boolean(project.github)

        const isVideo = project.demo.endsWith(".mp4") || /youtu/.test(project.demo)
        $demoLabel.textContent = isVideo ? "Ver video" : "Ver sitio"
        $demo.hidden = !project.demo
        $demo.href = project.demo || "#"
        $demo.setAttribute("aria-label", `${$demoLabel.textContent} de ${project.title} (se abre en una pestaña nueva)`)

        modal.open()
    }

    document.querySelectorAll("[data-project-open]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation()
            openProject(Number(button.dataset.projectOpen))
        })
    })
}

export default projectAnimation
