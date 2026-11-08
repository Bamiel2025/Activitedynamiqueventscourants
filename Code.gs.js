/**
 * ============================================================================
 * CODE.GS - COLLECTEUR & API D'ANALYSE DES ACTIVITÉS SVT (CYCLE 4)
 * ============================================================================
 * Structure générée automatiquement dans votre Google Sheet :
 * 1. Onglet "Reponses_Brutes" : toutes les soumissions élèves détaillées (Air, Eau, ou les deux)
 * 2. Onglet "Synthese_Competences" : agrégation à jour par Classe / Élève / Activité / Compétences (D1, D4, Langue)
 * 3. Endpoint GET : export JSON direct pour le Tableau de bord enseignant
 */

const SHEET_RAW = "Reponses_Brutes";
const SHEET_SUMMARY = "Synthese_Competences";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const rawContents = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    const payload = JSON.parse(rawContents);

    // Supporte l'envoi d'une seule activité OU d'un lot (Air + Eau en même temps)
    const items = Array.isArray(payload.submissions) ? payload.submissions : [payload];

    // 1. Initialisation ou récupération de l'onglet "Reponses_Brutes"
    let rawSheet = ss.getSheetByName(SHEET_RAW);
    if (!rawSheet) {
      rawSheet = ss.insertSheet(SHEET_RAW);
      const headers = [
        "Horodatage",
        "ID_Eleve",
        "Classe",
        "Nom",
        "Prenom",
        "Activite",
        "Score_Total_Sur_10",
        "Score_Sur_20",
        "Pourcentage_Reussite",
        "Score_D4_Modelisation_Sur_4",
        "Score_D1_Explication_Sur_4",
        "Score_Langue_Sur_2",
        "Niveau_Maitrise",
        "Q1_Intitule",
        "Q1_Reponse_Eleve",
        "Q1_Score_Sur_5",
        "Q1_Criteres_Valides",
        "Q1_Criteres_Manquants",
        "Q2_Intitule",
        "Q2_Reponse_Eleve",
        "Q2_Score_Sur_5",
        "Q2_Criteres_Valides",
        "Q2_Criteres_Manquants",
        "JSON_Complet_Pour_App"
      ];
      rawSheet.appendRow(headers);
      rawSheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#1e293b")
        .setFontColor("#ffffff");
      rawSheet.setFrozenRows(1);
    }

    const results = [];

    items.forEach(data => {
      const timestamp = new Date();
      const cleanNom = (data.nom || "INCONNU").toString().trim().toUpperCase();
      const cleanPrenom = (data.prenom || "Inconnu").toString().trim();
      const cleanClasse = (data.classe || "Sans_Classe").toString().trim().toUpperCase();
      const cleanActivite = (data.activite || "Activité SVT").toString().trim();
      const idEleve = `${cleanClasse}_${cleanNom}_${cleanPrenom}`.replace(/\s+/g, "_");

      const scoreTotal = Math.round(Number(data.scoreTotal || 0) * 100) / 100;
      const scoreSur20 = Math.round(scoreTotal * 2 * 10) / 10;
      const pct = Math.round((scoreTotal / 10) * 100);

      let niveauMaitrise = "Insuffisant";
      if (pct >= 80) niveauMaitrise = "Très satisfaisant";
      else if (pct >= 55) niveauMaitrise = "Satisfaisant";
      else if (pct >= 35) niveauMaitrise = "Fragile";

      const rowData = [
        timestamp,
        idEleve,
        cleanClasse,
        cleanNom,
        cleanPrenom,
        cleanActivite,
        scoreTotal,
        scoreSur20,
        pct,
        Number(data.scoreD4 || 0),
        Number(data.scoreD1 || 0),
        Number(data.scoreLangue || 0),
        niveauMaitrise,
        data.q1?.intitule || "Question 1",
        data.q1?.reponse || "",
        Number(data.q1?.score || 0),
        (data.q1?.valides || []).join(" | "),
        (data.q1?.manquants || []).join(" | "),
        data.q2?.intitule || "Question 2",
        data.q2?.reponse || "",
        Number(data.q2?.score || 0),
        (data.q2?.valides || []).join(" | "),
        (data.q2?.manquants || []).join(" | "),
        JSON.stringify(data)
      ];

      rawSheet.appendRow(rowData);

      // 2. Mise à jour de l'onglet "Synthese_Competences" (met à jour la ligne si même élève + même activité)
      updateSummarySheet(ss, {
        timestamp,
        idEleve,
        classe: cleanClasse,
        nom: cleanNom,
        prenom: cleanPrenom,
        activite: cleanActivite,
        scoreTotal,
        scoreSur20,
        pct,
        scoreD4: Number(data.scoreD4 || 0),
        scoreD1: Number(data.scoreD1 || 0),
        scoreLangue: Number(data.scoreLangue || 0),
        niveauMaitrise
      });

      results.push({ idEleve, activite: cleanActivite, niveau: niveauMaitrise, scoreTotal });
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", count: results.length, results }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Permet à votre Tableau de bord enseignant de récupérer
 * toutes les copies et statistiques au format JSON via l'URL du Web App
 */
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(SHEET_RAW);

  if (!rawSheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "empty", records: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const values = rawSheet.getDataRange().getValues();
  if (values.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "empty", records: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = values[0];
  const records = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    records.push(obj);
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      status: "success",
      count: records.length,
      records: records
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateSummarySheet(ss, item) {
  let sumSheet = ss.getSheetByName(SHEET_SUMMARY);
  if (!sumSheet) {
    sumSheet = ss.insertSheet(SHEET_SUMMARY);
    const headers = [
      "Derniere_Soumission",
      "ID_Eleve",
      "Classe",
      "Nom",
      "Prenom",
      "Activite",
      "Score_Sur_10",
      "Note_Sur_20",
      "Pourcentage",
      "Pct_D4_Modelisation",
      "Pct_D1_Argumentation",
      "Pct_Maitrise_Langue",
      "Bilan_Competences"
    ];
    sumSheet.appendRow(headers);
    sumSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#0f172a")
      .setFontColor("#38bdf8");
    sumSheet.setFrozenRows(1);
  }

  const newRow = [
    item.timestamp,
    item.idEleve,
    item.classe,
    item.nom,
    item.prenom,
    item.activite,
    item.scoreTotal,
    item.scoreSur20,
    item.pct + "%",
    Math.round((item.scoreD4 / 4) * 100) + "%",
    Math.round((item.scoreD1 / 4) * 100) + "%",
    Math.round((item.scoreLangue / 2) * 100) + "%",
    item.niveauMaitrise
  ];

  // Si l'élève a déjà soumis cette même activité, on met à jour sa ligne de synthèse
  const data = sumSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === item.idEleve && data[i][5] === item.activite) {
      sumSheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
      return;
    }
  }

  sumSheet.appendRow(newRow);
}
