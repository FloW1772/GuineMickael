# Rapport d'audit sécurité — SARL Guiné Mickaël

**Date :** 2026-06-21  
**Périmètre :** code source du projet (c:\dev\carrelage) + configuration Netlify  
**Auditeur :** analyse statique complète, tests locaux

---

## Note globale : **B+ / Très correct pour un site vitrine statique**

La surface d'attaque est faible (pas de base de données, pas de comptes). Les fondations sont solides. Deux points demandent une correction avant mise en production, deux autres sont des améliorations recommandées. Rien de critique.

### 3 priorités avant le déploiement

| Priorité | Problème | Effort |
|----------|----------|--------|
| 1 | L'ID Formspree est un placeholder `YOUR_FORM_ID` — formulaire non fonctionnel | 5 min |
| 2 | L'iframe Maps n'a pas d'attribut `sandbox` | 10 min |
| 3 | URL Facebook dans SchemaOrg contient des caractères Unicode non encodés | 5 min |

---

## 1. En-têtes HTTP de sécurité

### Content-Security-Policy
**⚠️ À améliorer — Risque : Moyen**

La CSP est présente et structurée, mais elle autorise `'unsafe-inline'` sur `script-src` et `style-src`.

```
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
```

**Pourquoi c'est là :** Astro génère des scripts inline pour l'hydratation/animations, et Tailwind v4 génère des variables CSS inline. C'est une contrainte du framework, pas un oubli.

**Risque réel :** faible pour un site statique sans données utilisateur. Un attaquant qui réussirait à injecter du HTML (via le formulaire Formspree par exemple) pourrait exécuter du JS — mais Formspree affiche les données dans *son* interface, pas sur ce site.

**Ce qui est bien :** le reste de la CSP est strict :
- `default-src 'none'` — bloqué par défaut ✅
- `connect-src` limité à Formspree ✅
- `frame-src https://www.google.com` uniquement ✅
- `form-action https://formspree.io` — empêche les redirections de formulaire ✅
- `base-uri 'self'` — empêche les injections via `<base>` ✅
- `font-src 'self'` — polices auto-hébergées, aucun CDN externe ✅

**Recommandation (post-déploiement, non bloquant) :** si un jour Astro supporte les nonces, remplacer `'unsafe-inline'` par `'nonce-xxx'` pour script-src.

---

### Strict-Transport-Security (HSTS)
**✅ OK — Risque : Aucun**

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

2 ans, incluant sous-domaines, avec la directive preload. C'est le maximum recommandé.

⚠️ **Attention avant déploiement :** le preload HSTS est irréversible pendant 2 ans. Ne l'activer qu'une fois le site définitivement en HTTPS sur le domaine cible. Si vous n'avez pas encore de domaine, c'est OK pour l'instant.

---

### X-Content-Type-Options
**✅ OK**  
`nosniff` présent.

---

### X-Frame-Options
**✅ OK**  
`DENY` présent — le site ne peut pas être intégré dans une iframe tierce (anti-clickjacking).

---

### Referrer-Policy
**✅ OK**  
`strict-origin-when-cross-origin` — envoie le domaine d'origine mais pas le chemin complet vers les sites tiers.

---

### Permissions-Policy
**✅ OK**  
Caméra, micro, géolocalisation et paiements désactivés.

```
camera=(), microphone=(), geolocation=(), payment=()
```

---

### En-têtes qui divulguent la stack
**✅ OK (Netlify)**  
Netlify retire automatiquement `X-Powered-By` et `Server` bavard. Aucun en-tête suspect dans la config.

---

## 2. Formulaire de contact

### ID Formspree placeholder
**❌ Problème — Risque : Élevé (fonctionnel, pas sécurité)**

```astro
const FORMSPREE_ID = "YOUR_FORM_ID"; // TODO
```

Le formulaire enverra vers `https://formspree.io/f/YOUR_FORM_ID` — Formspree rejettera la requête. Aucune donnée ne sera reçue. À corriger avant le lancement.

---

### Validation côté client
**✅ OK**

- Champs requis : nom (min 2 car.), téléphone (regex), type de travaux, message (min 20 car.)
- Email optionnel mais validé par regex si renseigné
- `maxlength` sur tous les champs (100, 200, 2000 caractères)
- Pattern sur le téléphone : `[0-9\s\+\-\.]{8,20}`

---

### Protection anti-spam
**✅ OK**

- **Honeypot** `_gotcha` caché (display:none, tabindex=-1, autocomplete off) ✅
- **Délai minimum 3 secondes** entre chargement de la page et soumission ✅
- Formspree gère aussi sa propre détection de spam côté serveur ✅

Note : le délai 3s est côté client et contournable par un attaquant déterminé. C'est suffisant pour bloquer les bots standards.

---

### Adresse email en clair dans le HTML
**✅ OK**

Aucune adresse email dans le HTML. Le formulaire passe par Formspree — l'email de destination est uniquement dans le tableau de bord Formspree, jamais dans le code.

---

### Risque XSS via le formulaire
**✅ OK**

Les données du formulaire sont envoyées à Formspree via `fetch()` + `FormData`. Elles ne sont jamais réaffichées dans le DOM de ce site. Le message de succès est statique (`Votre demande a bien été envoyée.`). Zéro risque XSS ici.

---

### Redirection ouverte
**✅ OK**

Aucun paramètre d'URL réfléchi dans le formulaire. Le `form.action` est construit à partir d'une constante côté serveur, pas depuis l'URL.

---

## 3. Dépendances (npm audit)

### Résultat

```
2 vulnérabilités : 2 faibles (low)
Paquet concerné : esbuild (via astro)
CVE : GHSA-g7r4-m6w7-qqqr
```

**⚠️ Faible — Risque : Faible**

`esbuild >=0.27.3 <0.28.1` permet une lecture arbitraire de fichiers quand le **serveur de développement** tourne sur Windows. 

**Conditions d'exploitation :** 
1. Le serveur `npm run dev` doit être actif
2. L'attaquant doit avoir accès au réseau local
3. Uniquement en développement, **jamais en production** (le site est statique)

**Impact réel :** nul en production (Netlify sert des fichiers HTML/CSS/JS statiques, pas esbuild). Le risque existe uniquement sur votre machine pendant le développement, et seulement si quelqu'un d'autre peut accéder à votre réseau.

**Correction disponible :** `npm update astro` vers la version ≥5.17.2 corrigerait esbuild. Mais attention : c'est un saut de version majeure (v5 → actuel v6). À tester avant d'appliquer.

---

### Paquets inutiles ou suspects
**✅ OK**

Dépendances minimales et justifiées :
- `astro` + `@astrojs/sitemap` — framework + sitemap
- `@fontsource/*` × 3 — polices auto-hébergées (RGPD)
- `@tailwindcss/vite` + `tailwindcss` — styles

Aucun script `postinstall` suspect dans les dépendances directes. Aucun paquet abandonné.

---

### Lockfile
**⚠️ À vérifier**

`package-lock.json` existe (npm). Les versions sont épinglées dans le lockfile. ✅  
En revanche, les versions dans `package.json` utilisent `^` (caret) — les mises à jour mineures/patches s'installent automatiquement. Acceptable pour ce type de projet.

---

## 4. Fuites de secrets et données

### Scan de patterns de secrets
**✅ OK — Aucun secret trouvé**

Recherche sur : `sk_`, `AIza`, `ghp_`, `xox*`, `AKIA`, `api_key`, `password`, `token`, `secret` — **zéro résultat** dans `src/`.

---

### .gitignore
**✅ OK (avec une remarque)**

Couvert : `dist/`, `node_modules/`, `.env`, `.env.production`, `.env.local`, `.env.*.local`, `.DS_Store`, `Thumbs.db`.

⚠️ **Remarque :** `.env.development` n'est pas explicitement couvert. Peu de risque en pratique (le projet n'utilise pas ce nom), mais bonne pratique d'ajouter `.env.*` pour couvrir tous les cas.

---

### .env.example
**✅ OK**

Présent, avec uniquement une valeur placeholder `your_formspree_form_id`. Aucune vraie valeur.

---

### Historique Git
**ℹ️ Info**

Le projet n'est pas un dépôt Git (`is a git repository: false`). Aucun historique à auditer. Quand vous initialiserez Git, vérifier qu'aucun secret n'a été commis dans les premiers commits.

---

### Données personnelles dans le code
**✅ OK**

Les coordonnées (adresse, téléphones) sont volontairement publiques — c'est le contenu du site vitrine. Aucun numéro de sécurité sociale, IBAN, ou donnée personnelle tierce dans le code.

---

## 5. Liens et ressources externes

### Liens target="_blank" sans noopener
**✅ OK**

Aucun lien `target="_blank"` trouvé dans le projet. Pas de risque de tabnabbing.

---

### Scripts/styles externes (SRI)
**✅ OK — aucune ressource externe**

Toutes les polices sont auto-hébergées via `@fontsource`. Aucun CDN externe (Google Fonts, jQuery, Bootstrap...). Les SRI (Subresource Integrity) ne sont pas nécessaires.

---

### Iframe Google Maps — sandbox
**❌ Problème — Risque : Moyen**

L'iframe Google Maps n'a pas d'attribut `sandbox` :

```html
<iframe
  id="maps-iframe"
  title="Localisation Guiné Mickaël SARL"
  loading="lazy"
  allowfullscreen
  hidden
></iframe>
```

Sans `sandbox`, l'iframe a accès à l'API `window.top`, peut déclencher des navigations sur la page parente, et a accès aux cookies same-site (aucun ici, mais bonne pratique).

**Correction recommandée :**
```html
sandbox="allow-scripts allow-same-origin"
```

---

### URL Facebook dans SchemaOrg — caractères Unicode
**⚠️ À corriger — Risque : Faible (fonctionnel)**

```json
"sameAs": ["https://www.facebook.com/SARL-Guiné-Mickaël"]
```

L'URL contient des caractères accentués (`é`, `ë`). Les URLs doivent être en ASCII pur ou percent-encodées. Cette URL est probablement incorrecte de toute façon (l'URL Facebook réelle doit être vérifiée avec le client).

---

## 6. Configuration hébergement & build

### HTTPS / redirection HTTP→HTTPS
**✅ OK**

Netlify force HTTPS automatiquement. HSTS configuré dans `netlify.toml`.

---

### Fichiers sensibles exposés
**✅ OK**

- `dist/` (build output) exclu du repo ✅
- Pas de `.git/` exposé en prod (Netlify ne publie que `dist/`) ✅
- Pas de fichiers de sauvegarde `*.bak`, `*.sql` dans `public/` ✅
- Source maps : Astro ne génère pas de `.map` par défaut en prod ✅

---

### Pages d'erreur
**⚠️ À faire — Risque : Faible**

Aucune page `404.astro` personnalisée dans `src/pages/`. Netlify affichera sa page 404 générique, qui ne divulgue rien de sensible. Mais une page 404 personnalisée (avec la nav du site) est une bonne pratique UX.

---

### Cache des assets
**✅ OK**

```toml
[[headers]]
  for = "/_astro/*"
  Cache-Control = "public, max-age=31536000, immutable"
```

Assets avec hash de fingerprint Astro : cache 1 an immuable. Favicons : 7 jours. Correct.

---

## 7. Vie privée / RGPD

### Google Maps — chargement conditionnel
**✅ OK**

Google Maps n'est chargé qu'après un clic explicite sur le bouton "Afficher la carte". L'attribut `src` de l'iframe est ajouté dynamiquement côté JS. Aucun pixel Google ne part sans action de l'utilisateur.

---

### Trackers tiers silencieux
**✅ OK — Aucun tracker**

Pas de Google Analytics, Facebook Pixel, Hotjar, ni aucun autre script de suivi. Le site ne charge rien de tiers sans interaction utilisateur.

---

### Mentions légales et politique de confidentialité
**⚠️ À compléter — Risque : Légal**

Les pages `mentions-legales.astro` et `confidentialite.astro` existent dans le projet. Leur contenu doit être complété avec les informations réelles (SIRET, responsable du traitement, hébergeur) avant le lancement.

---

## 8. Conformité OWASP (statique)

| Catégorie OWASP | Applicable | Statut |
|-----------------|------------|--------|
| A01 Broken Access Control | Non (pas de zone privée) | N/A |
| A02 Cryptographic Failures | Partiel (HTTPS) | ✅ HSTS configuré |
| A03 Injection (XSS, etc.) | Partiel (formulaire) | ✅ Formspree isole les données |
| A04 Insecure Design | Oui | ✅ Honeypot, délai anti-spam |
| A05 Security Misconfiguration | Oui | ⚠️ iframe sans sandbox |
| A06 Vulnerable Components | Oui | ⚠️ esbuild (low, dev only) |
| A07 Auth Failures | Non (pas d'auth) | N/A |
| A08 Software Integrity | Oui | ✅ Lockfile présent |
| A09 Logging/Monitoring | Non (pas de serveur) | N/A |
| A10 SSRF | Non (statique) | N/A |

---

## Résumé des actions

| # | Statut | Priorité | Action |
|---|--------|----------|--------|
| 1 | ❌ | Haute | Remplacer `YOUR_FORM_ID` par le vrai ID Formspree |
| 2 | ❌ | Moyenne | Ajouter `sandbox="allow-scripts allow-same-origin"` sur l'iframe Maps |
| 3 | ⚠️ | Moyenne | Corriger/vérifier l'URL Facebook dans `SchemaOrg.astro` |
| 4 | ⚠️ | Faible | Ajouter `.env.*` dans `.gitignore` |
| 5 | ⚠️ | Faible | Créer une page `404.astro` personnalisée |
| 6 | ⚠️ | Faible | Compléter mentions légales et politique de confidentialité |
| 7 | ⚠️ | Info | Mettre à jour `astro` quand une version stable compatible est disponible |

---

## Section maintenance — Garder le site sûr dans le temps

### Dépendances (mensuel)
```bash
npm outdated        # lister les packages dépassés
npm audit           # scanner les vulnérabilités connues
npm update          # mettre à jour dans les contraintes semver
```

### Formspree (à chaque changement d'email)
- Vérifier que l'email de destination dans le dashboard Formspree est toujours actif
- Activer la limitation de taux dans les paramètres Formspree si le spam augmente

### Headers (après chaque évolution de la CSP)
Tester avec [securityheaders.com](https://securityheaders.com) après déploiement.

### HSTS preload
Une fois sur le domaine définitif, soumettre le domaine sur [hstspreload.org](https://hstspreload.org) pour être dans la liste préchargée des navigateurs.

### Git (avant chaque commit)
```bash
git diff --cached   # vérifier qu'aucun .env ou secret ne part
```

### Revue annuelle
- Vérifier que les numéros de téléphone et adresse sont toujours corrects
- Vérifier la validité du certificat SSL (automatique sur Netlify)
- Relire les mentions légales si changement de prestataire ou d'activité
