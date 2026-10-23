// Données qui ne dépendent pas de la langue : coordonnées, liens, images.
// Modifie ici tes informations de contact.

export const asset = (path) => `${import.meta.env.BASE_URL}${path}`

export const site = {
  name: 'Jaurès Ayida',
  fullName: 'AYIDA AYIDA Michel Jaurès',
  email: 'ayidajaures3@gmail.com',
  github: 'https://github.com/ayidajaures',
  linkedin: 'https://www.linkedin.com/in/jaur%C3%A8s-ayida-33577835b',
  // Numéro WhatsApp au format international, sans "+" ni espaces (il n'est jamais affiché sur le site)
  whatsapp: '23561432407',
  // Pour que le formulaire t'envoie de vrais e-mails : crée un formulaire gratuit sur formspree.io
  // puis copie son adresse dans un fichier .env : VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || '',
  photo: asset('images/profile.webp'),
  // CV téléchargeable (fichier dans public/cv/)
  cv: asset('cv/CV_Jaures_Ayida.pdf'),
}

// Captures d'écran d'IntelliRoom (fichiers dans public/images/intelliroom/)
export const intelliroomShots = [
  'home-dark',
  'live-board',
  'rooms',
  'planning',
  'services',
  'chatbot',
  'home-light',
].map((name) => asset(`images/intelliroom/${name}.webp`))

// Liens du projet : laisse '' pour masquer le bouton
export const intelliroomLinks = {
  github: '',
  demo: '',
}

// Captures de l'application mobile IntelliRoom (React Native), à afficher dans un cadre de téléphone.
// Ajoute tes captures (format portrait) dans public/images/intelliroom/ puis liste-les ici, par exemple :
// export const intelliroomMobileShots = [asset('images/intelliroom/mobile-1.webp')]
// Tant que la liste est vide, le téléphone n'apparaît pas.
export const intelliroomMobileShots = []

// Galerie photo : ajoute tes images dans public/img/galerie/ puis déclare-les ici.
// Exemple : { src: asset('img/galerie/hackathon.jpg'), fr: 'Journée de l’innovation', en: 'Innovation Day' }
// Tant que la liste est vide, la section n'apparaît pas sur le site publié.
export const gallery = [
  { src: asset('img/galerie/semainedeletudiant.jpg'), fr: 'Semaine de l’étudiant du CEFOD Business School', en: 'CEFOD Business School’s Student Week' },
  { src: asset('img/galerie/jubileducbs.jpg'), fr: 'Jubilé des 10 ans du CEFOD Business School', en: '10th Anniversary of CEFOD Business School' },
  { src: asset('img/galerie/soutenance2.jpg'), fr: 'Soutenance de licence', en: 'Bachelor’s defense' },
  { src: asset('img/galerie/soutenance1.jpg'), fr: 'Soutenance de licence', en: 'Bachelor’s defense' },
  { src: asset('img/galerie/graduation2.jpg'), fr: 'Cérémonie de remise des diplômes', en: 'Graduation ceremony' },
  { src: asset('img/galerie/soutenance3.jpg'), fr: 'Interview après la soutenance', en: 'Interview after the defense' },
]