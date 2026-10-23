// Petites icônes en SVG, toutes dessinées sur une grille 24x24.
const paths = {
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  github: <path d="M12 .3a12 12 0 0 0-3.800 23.400c.6.100.8-.3.8-.6v-2c-3.300.7-4-1.600-4-1.600-.6-1.400-1.400-1.800-1.400-1.800-1-.7.100-.7.100-.7 1.200.1 1.800 1.200 1.800 1.200 1 1.800 2.800 1.300 3.500 1 .1-.8.4-1.300.7-1.600-2.700-.3-5.500-1.300-5.500-5.900 0-1.300.5-2.400 1.200-3.200-.1-.3-.5-1.500.1-3.200 0 0 1-.3 3.300 1.200a11.500 11.500 0 0 1 6 0c2.300-1.500 3.300-1.200 3.300-1.200.7 1.700.2 2.900.1 3.200.8.800 1.200 1.900 1.200 3.200 0 4.600-2.800 5.600-5.500 5.900.4.400.8 1.100.8 2.200v3.300c0 .3.2.7.8.6A12 12 0 0 0 12 .3" fill="currentColor" stroke="none" />,
  linkedin: <path d="M4.5 3a1.800 1.800 0 1 0 0 3.600 1.800 1.800 0 0 0 0-3.600zM3 8.500h3V21H3zM9 8.500h2.900v1.700h.1c.4-.8 1.400-1.900 3.300-1.900 3.500 0 4.200 2.300 4.200 5.300V21h-3v-6.600c0-1.600 0-3.600-2.200-3.600s-2.500 1.700-2.500 3.500V21H9z" fill="currentColor" stroke="none" />,
  whatsapp: <><path d="M3 21l1.6-4.800A8.500 8.500 0 1 1 8 19.500z" /><path d="M9 8.500c0 3 3 6 6 6l1.200-1.300-2-1-.9.700c-.9-.4-1.700-1.200-2.100-2.100l.7-.9-1-2z" fill="currentColor" stroke="none" /></>,
  pin: <><path d="M12 21s7-6.100 7-11.500A7 7 0 0 0 5 9.500C5 14.900 12 21 12 21z" /><circle cx="12" cy="9.500" r="2.500" /></>,
  check: <path d="m5 12.500 4.500 4.500L19 7.500" />,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7" />,
  arrowLeft: <path d="M19 12H5M12 5l-7 7 7 7" />,
  arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.800" /><path d="m21 16-5-5-9 9" /></>,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
}

export default function Icon({ name, className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  )
}
