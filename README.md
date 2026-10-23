# Portfolio de Jaurès Ayida

Site d'une seule page, bilingue (FR/EN), avec mode clair/sombre. Fait avec **React + Vite + Tailwind CSS**.

## Lancer le site sur ton ordinateur

```bash
npm install      # à refaire après chaque mise à jour du projet (nouvelle bibliothèque : motion)
npm run dev      # lance le site sur http://localhost:5173
```

## Animations incluses

Écran d'ouverture avec robot (une fois par visite), fond de réseau neuronal, nom qui apparaît lettre par lettre, titres qui s'écrivent, cartes 3D avec lumière sous la souris, ordinateur 3D pour les captures d'IntelliRoom (diaporama automatique avec bouton pause), bandeau de technologies, chiffres animés, barre de progression, et un **mini terminal** : clique sur le robot en bas à droite puis tape `help`.
Les visiteurs qui désactivent les animations dans leur système n'en voient aucune.

## Où modifier quoi

| Je veux changer…                                  | Fichier                            |
| ------------------------------------------------- | ---------------------------------- |
| Les textes (FR et EN), compétences, parcours      | `src/data/content.js`              |
| E-mail, GitHub, LinkedIn, WhatsApp, photo         | `src/data/site.js`                 |
| Liens GitHub / démo d'IntelliRoom                 | `src/data/site.js` (`intelliroomLinks`) |
| Les photos de la galerie                          | `public/img/galerie/` + `src/data/site.js` (`gallery`) |
| Captures mobiles d'IntelliRoom (cadre téléphone)  | `src/data/site.js` (`intelliroomMobileShots`) |
| Les chiffres animés et le bandeau de technologies | `src/data/content.js` (`stats`, `marquee`) |
| Les couleurs (marron)                             | `src/index.css` (bloc `:root` et `.dark`) |
| Ta photo de profil                                | remplace `public/images/profile.webp` |

Niveaux de compétence dans `content.js` : `'pro'` (rond plein = utilisé en projet) ou `'learn'` (rond vide = en apprentissage). Ajuste-les honnêtement.

## Formulaire de contact

Sans configuration, le bouton ouvre la messagerie du visiteur avec le message prérempli.
Pour recevoir de vrais messages : crée un formulaire gratuit sur [formspree.io](https://formspree.io), puis crée un fichier `.env` à la racine :

```
VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
```

## Mettre en ligne (gratuit)

```bash
npm run build    # crée le dossier dist/
```

Puis glisse le dossier `dist/` sur [netlify.com/drop](https://app.netlify.com/drop), ou publie-le avec GitHub Pages / Vercel.

## Mise en ligne (Netlify, gratuit)

1. `npm run build` crée le dossier `dist/`.
2. Va sur https://app.netlify.com/drop et glisse le dossier `dist` : ton site est en ligne.
3. Dans Netlify : *Site configuration → Change site name* pour choisir une adresse (ex. `jaures-ayida.netlify.app`).
4. Ouvre `index.html`, remplace les occurrences de `VOTRE-SITE.netlify.app` par ton adresse, refais `npm run build` et glisse de nouveau `dist` (cela active l'aperçu de partage sur WhatsApp/LinkedIn).
5. Option avancée : mets le projet sur GitHub puis « Import from Git » dans Netlify : chaque modification publiée met le site à jour toute seule (`netlify.toml` est déjà prêt).

## Alléger les photos de la galerie

Place tes photos dans `public/img/galerie/`, puis lance `npm run optimize`. Elles sont réduites (1600 px max), compressées, et les données cachées (dont la position GPS) sont supprimées. Les originaux sont gardés dans `originaux/` (non publié).

## Mode recruteur et CV

Le bouton « L'essentiel » ouvre un résumé en 30 secondes (`src/components/Brief.jsx`, textes dans `content.js` → `brief`).
Pour activer « Télécharger mon CV » : mets le PDF dans `public/cv/` et renseigne `cv: asset('cv/NOM.pdf')` dans `src/data/site.js`. Retire d'abord ta date de naissance et ton téléphone du PDF.
