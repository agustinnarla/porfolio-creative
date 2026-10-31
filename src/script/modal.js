const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Keyboard support for a modal: Escape closes it, Tab stays inside it,
 * and focus goes back to the element that opened it.
 */
export function createModalA11y(modal, { onClose }) {
    let lastFocused = null

    function getFocusable() {
        return [...modal.querySelectorAll(FOCUSABLE)].filter(
            (el) => !el.hidden && el.getClientRects().length > 0
        )
    }

    function onKeydown(event) {
        if (event.key === "Escape") {
            event.preventDefault()
            onClose()
            return
        }

        if (event.key !== "Tab") return

        const items = getFocusable()
        if (!items.length) return

        const first = items[0]
        const last = items[items.length - 1]

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }

    return {
        activate(initialFocus) {
            lastFocused = document.activeElement
            document.addEventListener("keydown", onKeydown)
            ;(initialFocus ?? getFocusable()[0])?.focus()
        },
        deactivate() {
            document.removeEventListener("keydown", onKeydown)
            lastFocused?.focus?.()
            lastFocused = null
        },
    }
}
