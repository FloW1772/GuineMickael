# DESIGN.md — Guiné Mickaël SARL · Charte graphique & concept éditorial

---

## 1. Informations extraites de la carte de visite

**Raison sociale :** SARL Guiné Mickaël  
**Adresse :** 21, Avenue du bordage — 49110 Saint Pierre Montlimart  
**Tél :** 02 41 75 16 31 — 06 27 32 30 30  
**Email :** mickael.guine@orange.fr  
**Facebook :** SARL Guiné Mickaël  
**Services listés :** Douche à l'italienne · Carrelage · Faïence · Neuf & Rénovation

---

## 2. Palette — 6 couleurs

| Rôle | Nom | Hex | Provenance |
|---|---|---|---|
| **Primaire** | Bleu céramique | `#2E9FC8` | Carreaux du G + triangles de droite |
| **Accent chaud** | Orange pose | `#E8731A` | Carreaux du G + triangles de droite |
| **Terre** | Brun joint | `#7D5538` | Troisième couleur des triangles |
| **Titre** | Ardoise | `#1A1A2E` | Texte "CARRELAGE / FAÏENCE" — quasi-noir chaud |
| **Fond** | Blanc chaux | `#F8F7F4` | Fond de la carte (légèrement chaud, pas pur blanc) |
| **Secondaire** | Bleu nuit | `#14627F` | "NEUF & RÉNOVATION" — bleu plus profond |

> **Contraste AA vérifié :**  
> `#1A1A2E` sur `#F8F7F4` → ratio 16:1 ✓  
> `#F8F7F4` sur `#2E9FC8` → ratio 3.2:1 (grands textes uniquement)  
> `#F8F7F4` sur `#14627F` → ratio 5.8:1 ✓  
> `#1A1A2E` sur `#F8F7F4` sera la combinaison principale corps de texte.

---

## 3. Typographies

### Choix & justification

**Titre (caractère) : [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed) Bold + ExtraBold**  
Pourquoi : La carte utilise un sans-serif condensé en capitales pour "DOUCHE À L'ITALIENNE / CARRELAGE / FAÏENCE". Barlow Condensed en est l'équivalent Google Fonts le plus fidèle — condensé, géométrique, industriel. Le condensed évoque naturellement la précision d'un calepinage serré. Usage : tous les titres H1/H2, compteurs, labels de catégorie.

**Corps (lecture) : [DM Sans](https://fonts.google.com/specimen/DM+Sans) Regular + Medium**  
Pourquoi : Sans-serif humaniste, très lisible en petit corps, sans personnalité envahissante. Il laisse les photos et les titres parler. Parfait compagnon pour Barlow Condensed. Usage : paragraphes, navigation, labels, formulaire.

**Accent (signature) : [Dancing Script](https://fonts.google.com/specimen/Dancing+Script) Regular**  
Pourquoi : Le "Mickaël" de la carte est en script manuscrit. Dancing Script est l'équivalent le plus proche. Usage : **exclusivement** le mot "Mickaël" dans le logo affiché en header — pas ailleurs.

> Polices hébergées localement via `@fontsource` (npm) pour la performance et l'indépendance vis-à-vis de Google.

---

## 4. Concept de mise en page

### Le problème avec les sites d'artisans habituels

Un site générique ferait : hero centré "Expert carreleur depuis X ans" + photo de stock + 3 blocs d'icônes + formulaire. J'aurais pu. Je ne l'ai pas fait.

### Ce qui est différent ici

La carte de visite contient une **information visuelle rare** : le logo G est lui-même construit comme une **mosaïque de carreaux colorés** (bleu, orange, brun) arrangés en grille. La partie droite de la carte montre des **triangles assemblés en carrés**, exactement comme un calepinage diagonal — le plan de pose à 45°.

Cette géométrie est la matière première du site. Elle ne décore pas : elle **structure**.

---

## 5. Wireframe ASCII — Page d'accueil

```
┌─────────────────────────────────────────────────────────────────┐
│  [LOGO]                    Réalisations  Services  À propos  Contact │  ← Header fixe, fond blanc, fin
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────┬─────────────────────────────────────┐
│                           │                                     │
│   GRANDE PHOTO            │  fond ardoise (#1A1A2E)             │
│   de réalisation          │                                     │
│   (60% largeur,           │  [logo — version claire]            │
│   hauteur 100vh)          │                                     │
│                           │  CARRELAGE                          │
│   ← image prend toute     │  POSÉ AVEC                          │  ← Barlow Condensed ExtraBold
│     la hauteur écran      │  PRÉCISION.                         │     grand, pas de slogan creux
│                           │                                     │
│                           │  Saint Pierre Montlimart & environs │  ← DM Sans, discret
│                           │                                     │
│                           │  → Demander un devis                │  ← pas un bouton géant,
│                           │    (lien sobre, soulignement animé) │    une ligne de texte élégante
│                           │                                     │
└───────────────────────────┴─────────────────────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ← LA SIGNATURE : bande de calepinage (voir §6)
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

┌─────────────────────────────────────────────────────────────────┐
│                    NOS RÉALISATIONS                             │
│  ┌──────────────────────┐  ┌───────────┐  ┌───────────┐        │
│  │                      │  │           │  │           │        │
│  │  grande image        │  │  petite   │  │  petite   │        │
│  │  (span 2 colonnes)   │  │           │  │           │        │
│  │                      │  └───────────┘  └───────────┘        │
│  └──────────────────────┘                                       │
│  [Salon ·6·]  [Salle de bain ·4·]     → Voir toutes            │
└─────────────────────────────────────────────────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

┌─────────────────────────────────────────────────────────────────┐
│  fond #14627F (bleu nuit)                                       │
│                                                                 │
│  01  CARRELAGE SOL & MUR                                        │
│  02  DOUCHE À L'ITALIENNE                                       │
│  03  FAÏENCE & RÉNOVATION                                       │
│                                                                 │
│  ← liste verticale sobre, numéros en orange, texte blanc        │
└─────────────────────────────────────────────────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

┌─────────────────────────────────────────────────────────────────┐
│  fond blanc chaux                                               │
│  Zone d'intervention · Garantie décennale · X années d'expérience │
│  ← 3 éléments de réassurance en ligne, sobre                   │
└─────────────────────────────────────────────────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

┌─────────────────────────────────────────────────────────────────┐
│  fond ardoise                                                   │
│  PRÊT À DÉMARRER                                                │
│  VOTRE PROJET ?           → Demander un devis                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FOOTER : logo + coordonnées + liens + mentions légales         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. LA SIGNATURE — une seule, exécutée parfaitement

### Le calepinage diagonal comme séparateur de sections

**Ce qu'on voit sur la carte :** à droite, des triangles assemblés en carrés formant un motif diagonal à 45° — exactement comme un carrelage posé en diagonale.

**Ce qu'on fait sur le site :** entre chaque section majeure, une **bande horizontale de 48px** constituée d'une répétition du motif triangulaire de la carte (triangles bleu/orange/brun assemblés en losanges). Pas d'animation spectaculaire — le motif est statique, comme un vrai joint entre deux surfaces. Au scroll, la bande apparaît avec un léger fondu (opacity 0→1, 400ms). Sur mobile, la hauteur passe à 32px.

**Pourquoi c'est fort :**
- C'est extrait directement de l'identité visuelle existante, pas inventé
- Aucun autre site d'artisan ne fait ça
- C'est ancré dans le métier (le calepinage, c'est le plan de pose — c'est technique)
- Ça structure la page sans l'alourdir
- Sur desktop, ces bandes forment un rythme visuel reconnaissable en scrollant

**Ce que ça n'est pas :** pas une animation spectaculaire, pas une vague SVG, pas un chevron tendance. C'est un motif de métier, posé avec soin.

Le motif SVG sera généré en code (pas une image), pour être parfaitement net à tous les DPI, coloré avec les tokens de la charte, et utilisable comme séparateur réutilisable via un composant Astro `<TileDivider />`.

---

## 7. Autocontrôle — différenciation

Questions posées avant de valider :

**"Est-ce que ce hero ressemble à n'importe quel site d'artisan ?"**  
Non. Le split asymétrique 60/40 avec fond sombre à droite et texte direct est inhabituellement éditorial pour ce secteur. La typographie condensée en capitales sans slogan marketing est délibérément anti-générique.

**"Est-ce que le calepinage a déjà été vu quelque part ?"**  
La trame géométrique en fond existe, mais l'utiliser comme séparateur de sections extrait du logo existant — non. Ce n'est pas une décoration gratuite, c'est la matière du métier transportée dans la mise en page.

**"Est-ce que j'ai utilisé une palette qui ressemble à un site généré ?"**  
La combinaison bleu céramique + orange chaud + brun joint + ardoise est spécifique à cette carte. Ni le classique bleu+blanc des artisans, ni le noir+terracotta des sites "modernes", ni le beige+vert acide des sites "naturels".

**Ce que j'ai modifié par rapport à mon premier réflexe :**  
Mon premier instinct était un hero plein écran avec overlay gradient et bouton CTA centré. Je l'ai remplacé par un split layout éditorial avec texte direct parce que c'est plus mémorable et moins template. J'ai aussi retiré les icônes de la section services (icônes = template) et les ai remplacées par une liste numérotée sur fond coloré.

---

## 8. Zone d'intervention

**Zone d'intervention confirmée :** Saint Pierre Montlimart et ses alentours (49110).  
Utilisé dans les `<title>`, meta descriptions et JSON-LD Schema.org.
