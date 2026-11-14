# SVT Cycle 4 — La Dynamique des Masses d'Air et des Masses d'Eau

Application pédagogique interactive complète de SVT (Cycle 4 — Démarche d'investigation scientifique) fusionnant :
1. **La dynamique des masses d'air** (Phénomène météorologique du Dust saharien de septembre 2023, modèles 3D air chaud/froid, boîte à convection, et carte synoptique animée).
2. **La dynamique des masses d'eau** (Constat réel de l'accumulation de plastiques sur l'atoll isolé d'Henderson, modèles 3D courants de surface et courants profonds thermohalins, carte vectorielle interactive de l'Atlantique Nord avec orientation des flux).
3. **Tableau de bord enseignant & Remédiation** avec récolte automatisée et sécurisée sur Google Sheets (`Code.gs.js`).

---

## 🚀 Mise en ligne sur GitHub Pages / Dépôt GitHub

Cette application est conçue pour être partagée directement aux élèves et aux collègues enseignants (via GitHub Pages ou tout hébergeur web statique).

### 🔒 Sécurité du lien Google Sheet (Protection anti-fuite)

Le projet intègre un système d'isolation de configuration :
- **`config.example.js`** : Fichier modèle versionné sur GitHub (ne contient aucun lien secret).
- **`config.local.js`** : Fichier contenant **votre propre URL** Google Apps Script. Ce fichier est **automatiquement ignoré** par Git grâce au `.gitignore` et ne sera **jamais publié sur GitHub**.

### 📝 Déploiement étape par étape :

1. **Créer le Google Sheet et le script de récolte :**
   - Créez une nouvelle feuille Google Sheets sur votre Google Drive.
   - Allez dans **Extensions > Apps Script**.
   - Effacez le code existant et collez l'intégralité du fichier [`Code.gs.js`](Code.gs.js).
   - Cliquez sur **Déployer > Nouveau déploiement**.
   - Choisissez le type **Application Web**.
   - Configurez :
     - *Exécuter en tant que :* **Moi**
     - *Qui a accès :* **Tout le monde** (indispensable pour que les élèves puissent poster leurs réponses sans compte Google).
   - Copiez l'URL du Web App (se terminant par `/exec`).

2. **Renseigner votre URL en local :**
   - Ouvrez le fichier `config.local.js`.
   - Remplacez `"COLLEZ_VOTRE_URL_APPS_SCRIPT_ICI"` par votre URL de Web App.

3. **Publier sur GitHub :**
   ```bash
   git init
   git add .
   git commit -m "Application SVT Cycle 4 : Dynamique des masses d'air et d'eau"
   git remote add origin https://github.com/VOTRE_COMPTE/VOTRE_DEPOT.git
   git branch -M main
   git push -u origin main
   ```
   *(Grâce au fichier `.gitignore`, `config.local.js` ne sera pas envoyé sur GitHub, préservant votre lien privé).*

4. **Accès élèves et enseignant :**
   - **Élèves :** Ouvrent `index.html` (ou l'URL GitHub Pages). L'envoi des résultats se fait en 1 clic de manière totalement transparente.
   - **Enseignant :** Ouvre `Tableau de bord.html` pour consulter en direct les graphiques de réussite par classe, les niveaux de maîtrise du socle et les fiches de remédiation individualisées.
