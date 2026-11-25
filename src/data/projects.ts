export interface Project {
    id: number
    type: string
    title: string
    details: string
    description: string
    technologies: string[]
    /** Empty string = private repo, the link is hidden */
    github: string
    demo: string
    /** Card colors */
    bg: string
    fg: string
    /** Optional visuals */
    image?: string
    logo?: string
    video?: string
    poster?: string
}

export const projects: Project[] = [
    {
        id: 1,
        type: "Web + Mobile",
        title: "Chanchito",
        details: "Finanzas personales en ARS y USD",
        description:
            "App de finanzas personales para web y Android. Movimientos por cuenta, transferencias, presupuestos mensuales y semanales, metas de ahorro y balance del mes en pesos y dólares. Monorepo con la lógica de dominio compartida entre web y mobile, Row Level Security en Supabase y desarrollo guiado por specs con CI en GitHub Actions.",
        technologies: ["React", "TypeScript", "Expo", "Supabase", "PostgreSQL", "TanStack Query", "Tailwind CSS", "Vitest"],
        github: "https://github.com/agustinnarla/chanchito",
        demo: "/videos/chanchito.mp4",
        bg: "#efe7ff",
        fg: "#3b1f6e",
        image: "/images/projects/chanchito-inicio.webp",
        logo: "/images/projects/chanchito-logo.webp",
        video: "/videos/chanchito.mp4",
        poster: "/images/projects/chanchito-poster.webp",
    },
    {
        id: 2,
        type: "Full Stack",
        title: "KaleidoFest",
        details: "Festival juvenil",
        description:
            "Sitio oficial del festival gratuito para chicos de 10 a 14 años en Río Ceballos, con fiesta We Color. Inscripción online con cupo, emails de confirmación con Resend, registro en Google Sheets y validación de acreditaciones desde la API.",
        technologies: ["Astro", "Tailwind CSS", "GSAP", "TypeScript", "Resend", "Google Sheets API"],
        github: "",
        demo: "https://kaleidofest.com.ar/",
        bg: "#ffd23f",
        fg: "#1a1405",
    },
    {
        id: 3,
        type: "Landing Page",
        title: "Tha Vibbes Company",
        details: "Grupo de baile",
        description:
            "Landing page oficial para crew de danza urbana de Córdoba, representantes de Argentina en el mundial de Hip Hop International 2026. Estética de alto impacto visual y cultura urbana.",
        technologies: ["Astro", "Tailwind CSS"],
        github: "https://github.com/agustinnarla/ThaVibbesCompany",
        demo: "https://tha-vibbes-company.vercel.app/",
        bg: "#151515",
        fg: "#f4f2ec",
    },
    {
        id: 4,
        type: "App Móvil",
        title: "Indarra",
        details: "Rutinas de gimnasio",
        description:
            "Aplicación móvil para seguimiento personalizado de rutinas de ejercicio. Módulo avanzado de analítica para registrar progreso y evaluar evolución de cargas.",
        technologies: ["React Native", "Node.js", "Express", "PostgreSQL"],
        github: "https://github.com/agustinnarla/Indarra.git",
        demo: "https://youtube.com/shorts/h_xxbB0ZyPU",
        bg: "#c8f169",
        fg: "#132008",
    },
    {
        id: 5,
        type: "Full Stack",
        title: "Gestión Nuestra Señora del Huerto",
        details: "Gestión académica",
        description:
            "Plataforma omnicanal para la digitalización de instituciones educativas. Eliminación total del uso de papel con módulos de asistencia, amonestaciones, notas y observaciones en tiempo real.",
        technologies: ["React Native", "Node.js", "Express", "PostgreSQL"],
        github: "https://github.com/agustinnarla/GestionColegio",
        demo: "https://youtu.be/1ia6A2C0qoc",
        bg: "#5ee0f2",
        fg: "#062a30",
    },
]
