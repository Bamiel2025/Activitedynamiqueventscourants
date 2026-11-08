/**
 * ============================================================================
 * CONFIGURATION EXEMPLE — SVT CYCLE 4 (DYNAMIQUE DES MASSES D'AIR & D'EAU)
 * ============================================================================
 * Pour activer l'envoi automatique vers votre Google Sheet :
 * 1. Copiez ce fichier et renommez la copie en "config.local.js"
 *    (Le fichier "config.local.js" est protégé par .gitignore et ne sera
 *     jamais publié en clair sur votre dépôt GitHub public).
 * 2. Collez ci-dessous l'URL de déploiement de votre Google Apps Script (Web App).
 * ============================================================================
 */
window.SVT_CONFIG = {
    // URL du Web App Google Apps Script (Déployer > Nouvelle application Web > Accès : Tout le monde)
    GOOGLE_SHEET_WEBHOOK_URL: "COLLEZ_VOTRE_URL_APPS_SCRIPT_ICI",

    // Codes enseignants permettant de déverrouiller le corrigé et la grille critériée
    UNLOCK_CODES: ["2027", "SVT2027", "SVT2026", "AIR2026", "EAU2026"]
};
