// Allège les photos de la galerie (public/img/galerie) : redimensionne, compresse, corrige l'orientation
// et supprime les métadonnées (dont la position GPS). Lance-le avec : npm run optimize
// Les originaux sont sauvegardés une seule fois dans originaux/galerie/ (hors du site publié).
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DIR = 'public/img/galerie'
const BACKUP = 'originaux/galerie'
const MAX = 1600

if (!existsSync(DIR)) {
  console.log(`Dossier ${DIR} introuvable : rien à optimiser.`)
  process.exit(0)
}

await mkdir(BACKUP, { recursive: true })
const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f))
if (!files.length) console.log('Aucune image .jpg/.png trouvée.')

let before = 0
let after = 0
for (const file of files) {
  const target = path.join(DIR, file)
  const backup = path.join(BACKUP, file)
  if (!existsSync(backup)) await copyFile(target, backup) // sauvegarde unique de l'original
  const size = (await stat(backup)).size
  const img = sharp(backup).rotate().resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
  const isPng = /\.png$/i.test(file)
  const out = isPng ? img.png({ compressionLevel: 9, palette: true }) : img.jpeg({ quality: 78, mozjpeg: true })
  await out.toFile(target + '.tmp')
  const { rename } = await import('node:fs/promises')
  await rename(target + '.tmp', target)
  const now = (await stat(target)).size
  before += size
  after += now
  console.log(`${file}: ${(size / 1024).toFixed(0)} Ko → ${(now / 1024).toFixed(0)} Ko`)
}
if (files.length) console.log(`Total : ${(before / 1048576).toFixed(1)} Mo → ${(after / 1048576).toFixed(1)} Mo`)
