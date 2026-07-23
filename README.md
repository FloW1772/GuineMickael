# Site vitrine — SARL Guiné Mickaël

Site vitrine professionnel pour artisan carreleur.  
Stack : **Astro** + **Tailwind CSS** + **TypeScript strict**.

---

## Ajouter des photos de réalisations

1. **Nommer le fichier** selon la convention : `prefixe_description_numero.jpg`  
   - Salon → `salon_description.jpg` (ex : `salon_mur-carrelage_03.jpg`)  
   - Salle de bain → `sdb_description.jpg` (ex : `sdb_douche-italienne_04.jpg`)  
   - Pas d'espace, pas d'accent dans les noms de fichiers.

2. **Déposer le fichier** dans le dossier `incoming/`

3. **Lancer le script de tri** :
   ```bash
   node scripts/sort-images.mjs
   ```
   Le script déplace l'image dans le bon sous-dossier et vous signale tout préfixe inconnu.

4. La photo apparaît automatiquement sur le site — aucune modification de code nécessaire.

---

## Ajouter une nouvelle catégorie

1. Choisir un préfixe (ex : `cuisine`)
2. Ouvrir `scripts/sort-images.mjs` et ajouter une ligne dans `PREFIX_MAP` :
   ```js
   cuisine: "cuisine",
   ```
3. Les images `cuisine_*.jpg` seront désormais triées et affichées automatiquement.

---

## Développement local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:4321](http://localhost:4321)

---

## Déploiement sur Netlify

1. Connecter le dépôt Git à Netlify
2. Commande de build : `npm run build`
3. Dossier publié : `dist`
4. Variables d'environnement à configurer dans Netlify :
   - (Voir `.env.example`)

Le fichier `netlify.toml` configure automatiquement les headers de sécurité (CSP, HSTS, etc.).

---

## Formulaire de contact (Formspree)

1. Créer un compte sur [formspree.io](https://formspree.io)
2. Créer un formulaire et copier l'ID (ex : `xpwzbqkj`)
3. Dans le fichier `src/pages/contact.astro`, remplacer `YOUR_FORM_ID` par votre ID
4. Configurer l'email de réception dans le dashboard Formspree

---

## À compléter avant mise en ligne

- [ ] `src/pages/contact.astro` — remplacer `YOUR_FORM_ID` par l'ID Formspree
- [ ] `src/pages/mentions-legales.astro` — compléter SIRET, assurance, hébergeur
- [ ] `src/pages/confidentialite.astro` — compléter nom hébergeur
- [ ] `src/pages/a-propos.astro` — rédiger la présentation de l'artisan
- [ ] `src/components/SchemaOrg.astro` — vérifier coordonnées GPS et URL Facebook
- [ ] `public/favicons/` — remplacer les favicons SVG par des PNG générés depuis le vrai logo
- [ ] Fournir une image hero (`public/hero.jpg`) ou utiliser une des réalisations
- [ ] Vérifier le nom de domaine dans `astro.config.mjs` (`site:`)

---

## Structure du projet

```
/src
  /assets/images/realisations/
    /salon/          ← photos salon (préfixe salon_)
    /salle-de-bain/  ← photos salle de bain (préfixe sdb_)
  /components/       ← Header, Footer, GalleryGrid, TileDivider, SchemaOrg
  /layouts/          ← Layout.astro (base de toutes les pages)
  /pages/            ← index, realisations, services, a-propos, contact, légales
  /styles/           ← global.css (tokens Tailwind v4)
/public/
  /favicons/
  robots.txt
  site.webmanifest
/scripts/
  sort-images.mjs    ← tri des images incoming/
/incoming/           ← déposer les nouvelles photos ici
```
