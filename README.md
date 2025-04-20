# 🐈‍⬛ Chat le Fataliste ✍️

[![Déployé sur Vercel](https://img.shields.io/badge/Déployé%20sur-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/benjs-projects-6b359cc1/v0-chat-le-fataliste)
[![Construit avec v0](https://img.shields.io/badge/Construit%20avec-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/27Sy8xS2USr)
[![Tech Stack](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-black?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Tech Stack](https://img.shields.io/badge/Shadcn/UI-black?style=for-the-badge)](https://ui.shadcn.com/)
[![Tech Stack](https://img.shields.io/badge/Vercel_AI_SDK-black?style=for-the-badge)](https://sdk.vercel.ai/)

> « Vous voyez, lecteur, que je suis en beau chemin, et qu'il ne tiendrait qu'à moi de vous faire attendre un an, deux ans, trois ans... » - Denis Diderot

**Chat le Fataliste** est une expérience littéraire interactive où vous co-écrivez une histoire avec une intelligence artificielle (propulsée par GPT-4o Mini). Inspiré par l'esprit joueur et disruptif de Diderot dans *Jacques le fataliste*, ce projet vous invite non seulement à suivre une narration, mais aussi à la commenter, l'interrompre et la rediriger constamment. Prenez les rênes du récit en définissant le style littéraire, le genre, la personnalité du narrateur, et bien plus encore !

<!-- Ajoutez une capture d'écran ou un GIF animé ici pour montrer l'interface ! -->
<!-- ![Chat le Fataliste en action](lien_vers_votre_gif_ou_screenshot.gif) -->

## ✨ Fonctionnalités Clés

*   **Co-création Narrative Interactive** : Dialoguez avec une IA pour construire une histoire unique, tour après tour.
*   **Contrôle "à la Diderot"** : Influencez activement le déroulement de l'histoire via des choix ou vos propres instructions.
*   **Configuration Narrative Poussée** :
    *   Choisissez parmi des **styles littéraires** prédéfinis (Diderot, Balzac, Proust, Camus...) ou définissez le vôtre.
    *   Sélectionnez un **genre littéraire** (Conte philosophique, Réalisme, SF, Fantasy, Policier...).
    *   Définissez la **personnalité du narrateur** (Espiègle, Ironique, Dramatique...).
    *   Configurez la **voix narrative** (Hétéro/Homo/Autodiégétique), la **focalisation** (Omnisciente, Interne, Externe), la **personne** (Je, Il/Elle, Tu/Vous) et le **temps principal** (Passé, Présent).
*   **Paramètres Personnalisables** : Utilisez l'option "Autre" pour définir précisément vos propres styles, genres ou personnalités.
*   **Interface Élégante** : Construite avec Shadcn/UI et Tailwind CSS pour une expérience utilisateur agréable et responsive.
*   **Options d'Export** : Copiez facilement les réponses de l'IA ou téléchargez l'intégralité de l'histoire générée au format PDF.
*   **Gestion des Clés API** : Utilise la clé API OpenAI fournie par l'utilisateur et stockée localement dans le navigateur (`localStorage`).
*   **Mode Clair / Sombre** : Adapté à vos préférences visuelles.
*   **(Optionnel) Synchronisation v0.dev** : Le projet peut être synchronisé avec les déploiements v0.dev (voir section dédiée).

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Langage**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Composants UI**: [Shadcn/UI](https://ui.shadcn.com/)
*   **IA & SDK**: [Vercel AI SDK](https://sdk.vercel.ai/), [@ai-sdk/openai](https://sdk.vercel.ai/docs/adapters/openai) (utilisant GPT-4o Mini par défaut)
*   **Export PDF**: [jsPDF](https://github.com/parallax/jsPDF)
*   **Déploiement**: [Vercel](https://vercel.com/)

## 🚀 Démarrage Rapide

Suivez ces étapes pour lancer le projet localement :

1.  **Cloner le dépôt** :
    ```bash
    git clone https://github.com/benjyazoulay/benjyazoulay-chat-le-fataliste.git
    cd benjyazoulay-chat-le-fataliste
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    # ou yarn install ou pnpm install
    ```

3.  **Configuration de la Clé API OpenAI** :
    Ce projet **ne nécessite pas** de fichier `.env.local` pour la clé API OpenAI. La clé est gérée côté client :
    *   Lancez l'application (voir étape suivante).
    *   Ouvrez l'interface de chat (`/chat`).
    *   Cliquez sur l'icône d'engrenage (⚙️) pour ouvrir le panneau de configuration.
    *   Entrez votre clé API OpenAI dans le champ prévu. Elle sera sauvegardée dans le `localStorage` de votre navigateur.
    *   **Important** : Votre clé API n'est jamais envoyée au serveur de l'application, elle est utilisée directement par le navigateur pour interroger l'API OpenAI via la route API du projet (`/api/chat`) qui la relaie.

4.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    # ou yarn dev ou pnpm dev
    ```

5.  **Ouvrir l'application** :
    Naviguez vers [`http://localhost:3000`](http://localhost:3000) dans votre navigateur. Cliquez sur "Commencer l'aventure" pour accéder au chat sur `/chat`.

## ⚙️ Configuration Narrative

L'un des aspects uniques de *Chat le Fataliste* est la possibilité de finement configurer les paramètres narratifs que l'IA doit suivre.

*   **Accès** : Cliquez sur l'icône d'engrenage (⚙️) dans l'interface de chat.
*   **Options** : Vous pouvez ajuster :
    *   Le **Genre Littéraire**
    *   Le **Style Littéraire**
    *   La **Personnalité / Ton** du narrateur
    *   La **Relation Narrateur/Histoire** (Voix)
    *   La **Focalisation** (Perspective)
    *   La **Personne Narrative** (Grammaire)
    *   Le **Temps Principal**
*   **Personnalisation** : Pour chaque paramètre, une option "Autre (préciser)" vous permet de décrire votre propre choix si les options prédéfinies ne vous conviennent pas. Les descriptions sont fournies dans `lib/narrative-constants.ts`.
*   **Sauvegarde** : Les paramètres sont sauvegardés dans le `localStorage` de votre navigateur et sont utilisés pour générer le *prompt système* envoyé à l'IA à chaque tour de conversation. Les modifications sont appliquées lors de la prochaine interaction avec l'IA (un rechargement de page est parfois nécessaire pour réinitialiser complètement le contexte).

## 🔄 Fonctionnement

1.  **Initialisation** : Au chargement de la page `/chat`, les paramètres narratifs sont lus depuis `localStorage` (ou les valeurs par défaut sont utilisées). Un *prompt système* détaillé est généré (`app/chat/page.tsx`), instruisant l'IA sur le style, le genre, la personnalité, etc., à adopter, et lui demandant de toujours proposer des options numérotées à la fin de sa réponse.
2.  **Interaction Utilisateur** : L'utilisateur envoie un message (pour commencer l'histoire ou continuer) ou clique sur l'une des options proposées par l'IA.
3.  **Appel API** : Le frontend (`useChat` hook) envoie l'historique complet des messages (incluant le prompt système) et la clé API de l'utilisateur (via l'état, lu depuis `localStorage`) à la route API Next.js (`/api/chat/route.ts`).
4.  **Traitement Backend** : La route API reçoit la requête, initialise le client OpenAI avec la clé API fournie, et effectue un appel `streamText` à l'API OpenAI avec l'historique des messages et les paramètres (température, etc.).
5.  **Streaming de la Réponse** : L'API OpenAI renvoie la réponse en streaming. La route API la transmet directement au frontend.
6.  **Affichage & Extraction** : Le frontend affiche la réponse de l'IA au fur et à mesure. Une fois la réponse complète, il tente d'extraire les options narratives numérotées (`1. ...`, `2. ...`) de la fin du texte pour les afficher sous forme de boutons cliquables. Le contenu du message de l'IA est nettoyé pour retirer ces options et éventuelles phrases introductives indésirables.
7.  **Cycle** : Le processus recommence à l'étape 2.

## 🔗 Intégration v0.dev

Ce dépôt est configuré pour rester synchronisé avec les déploiements effectués via [v0.dev](https://v0.dev).

*   **Développement** : Vous pouvez continuer à construire et modifier votre application sur [v0.dev/chat/projects/27Sy8xS2USr](https://v0.dev/chat/projects/27Sy8xS2USr).
*   **Déploiement v0** : Lorsque vous déployez depuis l'interface v0, les changements sont automatiquement poussés vers ce dépôt GitHub.
*   **Déploiement Vercel** : Vercel détecte les mises à jour du dépôt et déploie automatiquement la dernière version.
*   **Application Live** : [https://vercel.com/benjs-projects-6b359cc1/v0-chat-le-fataliste](https://vercel.com/benjs-projects-6b359cc1/v0-chat-le-fataliste)

## 🤝 Contribution

Les contributions sont les bienvenues ! Si vous avez des idées d'amélioration, de nouvelles fonctionnalités (comme d'autres styles littéraires, genres, etc.) ou des corrections de bugs, n'hésitez pas à :

1.  Forker le dépôt.
2.  Créer une nouvelle branche (`git checkout -b feature/ma-nouvelle-feature`).
3.  Commiter vos changements (`git commit -am 'Ajout de telle fonctionnalité'`).
4.  Pousser la branche (`git push origin feature/ma-nouvelle-feature`).
5.  Ouvrir une Pull Request.

## 📜 Licence

Ce projet est distribué sous la licence MIT. Voir le fichier `LICENSE` (s'il existe) pour plus de détails.

## Auteur

Benjamin Azoulay - 2025
