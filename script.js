// Tableau pour simuler une base de données
const dataApp = {
    userStatus: "",
    rdv: [
        { id: 1, titre: "Consultation sage-femme", img: "sage_femme.png" },
        { id: 2, titre: "Consultation gynécologue", img: "gyneco.png" }
    ]
};

// Fonction de navigation (BOM)
function goTo(page) {
    window.location.href = page;
}
    
//rdv

// Récupérer / sauvegarder
function getRdv() {
    return JSON.parse(localStorage.getItem("rdvs")) || [];
}

function saveRdv(rdvs) {
    localStorage.setItem("rdvs", JSON.stringify(rdvs));
}

// Ajouter un RDV
function ajouterRdv(type) {
    const date = prompt("Entrer la date du rendez-vous (YYYY-MM-DD)");

    if (!date) return;

    const rdvs = getRdv();
    rdvs.push({ type, date });

    saveRdv(rdvs);

    afficherDernierRdv();
    afficherListe();
}

// Modifier le dernier RDV
function modifierRdv(type) {
    let rdvs = getRdv();

    let index = rdvs.map(r => r.type).lastIndexOf(type);

    if (index === -1) {
        alert("Aucun rendez-vous à modifier");
        return;
    }

    const nouvelleDate = prompt("Nouvelle date (YYYY-MM-DD)");

    if (!nouvelleDate) return;

    rdvs[index].date = nouvelleDate;

    saveRdv(rdvs);

    afficherDernierRdv();
    afficherListe();
}

// Supprimer dernier RDV
function supprimerDernierRdv(type) {
    let rdvs = getRdv();

    let index = rdvs.map(r => r.type).lastIndexOf(type);

    if (index === -1) {
        alert("Aucun rendez-vous à supprimer");
        return;
    }

    if (!confirm("Supprimer ce rendez-vous ?")) return;

    rdvs.splice(index, 1);

    saveRdv(rdvs);

    afficherDernierRdv();
    afficherListe();
}

// Afficher les cartes (haut)
function afficherDernierRdv() {
    const rdvs = getRdv();

    const sage = rdvs.filter(r => r.type === "sage-femme").pop();
    const gyneco = rdvs.filter(r => r.type === "gynecologue").pop();

    const elSage = document.getElementById("rdv-sage");
    const elGyneco = document.getElementById("rdv-gyneco");

    if (elSage) {
        elSage.textContent = sage
            ? `📅 ${sage.date}`
            : "(Aucun rendez-vous)";
    }

    if (elGyneco) {
        elGyneco.textContent = gyneco
            ? `📅 ${gyneco.date}`
            : "(Aucun rendez-vous)";
    }
}

// Liste complète (bas)
function afficherListe() {
    const container = document.getElementById("liste-rdv-dynamique");

    if (!container) return;

    container.innerHTML = "";

    const rdvs = getRdv();

    if (rdvs.length === 0) {
        container.innerHTML = "";
        return;
    }

    rdvs.forEach((rdv, index) => {
        const div = document.createElement("div");
        div.className = "rdv-item";

        div.innerHTML = `
            <p><strong>${rdv.type}</strong> : ${rdv.date}</p>
            <button onclick="supprimerRdv(${index})">Supprimer</button>
        `;

        container.appendChild(div);
    });
}

// Supprimer depuis la liste
function supprimerRdv(index) {
    let rdvs = getRdv();

    if (!confirm("Supprimer ce rendez-vous ?")) return;

    rdvs.splice(index, 1);

    saveRdv(rdvs);

    afficherDernierRdv();
    afficherListe();
}

// Rappel veille
function verifierRappel() {
    const rdvs = getRdv();
    const aujourdHui = new Date();

    rdvs.forEach(rdv => {
        const dateRdv = new Date(rdv.date);

        const demain = new Date();
        demain.setDate(aujourdHui.getDate() + 1);

        if (dateRdv.toDateString() === demain.toDateString()) {
            alert("⚠️ Rappel : Vous avez un rendez-vous demain !");
        }
    });
}

// Lancement automatique
document.addEventListener("DOMContentLoaded", () => {
    afficherDernierRdv();
    afficherListe();
    verifierRappel();
});

//grossesse

function mettreAJourSemaine() {
  let semaine = document.getElementById("semaineInput").value;

  if (semaine === "") {
    alert("Veuillez entrer une semaine");
    return;
  }

  semaine = parseInt(semaine);

  let estimation = estimerBebe(semaine);

  document.getElementById("semaine").textContent = semaine + " SA";
  document.getElementById("poidsAffiche").textContent = estimation.poids + " g";
  document.getElementById("tailleAffiche").textContent = estimation.taille + " cm";

  sauvegarderDonnees(semaine, estimation.poids, estimation.taille);
}

function estimerBebe(semaine) {

  let poids, taille;

  if (semaine <= 20) {
    poids = 300; taille = 25;
  } else if (semaine <= 28) {
    poids = 1000; taille = 35;
  } else if (semaine <= 36) {
    poids = 2500; taille = 47;
  } else {
    poids = 3200; taille = 50;
  }

  return { poids, taille };
}

function analyserBebe() {
  let poids = document.getElementById("poids").value;
  let taille = document.getElementById("taille").value;
  let semaine = parseInt(document.getElementById("semaineInput").value);

  let resultat = document.getElementById("resultat");

  if (poids === "" || taille === "") {
    resultat.innerText = "Veuillez remplir les champs.";
    resultat.style.color = "red";
    return;
  }

  let estimation = estimerBebe(semaine);

  poids = parseInt(poids);
  taille = parseInt(taille);

  let message = "";

  if (poids < estimation.poids - 200) {
    message += "⚠️ Poids inférieur à la moyenne. ";
    resultat.style.color = "orange";
  } else if (poids > estimation.poids + 200) {
    message += "⚠️ Poids supérieur à la moyenne. ";
    resultat.style.color = "orange";
  } else {
    message += "💚 Poids normal. ";
    resultat.style.color = "green";
  }

  if (taille < estimation.taille - 3) {
    message += "Taille légèrement faible.";
  } else if (taille > estimation.taille + 3) {
    message += "Taille au-dessus de la moyenne.";
  }

  resultat.innerText = message;
}

function sauvegarderDonnees(semaine, poids, taille) {
  const data = { semaine, poids, taille };
  localStorage.setItem("suiviBebe", JSON.stringify(data));
}

function chargerDonnees() {
  const data = JSON.parse(localStorage.getItem("suiviBebe"));

  if (!data) return;

  document.getElementById("semaine").textContent = data.semaine + " SA";
  document.getElementById("poidsAffiche").textContent = data.poids + " g";
  document.getElementById("tailleAffiche").textContent = data.taille + " cm";
}

window.onload = chargerDonnees;

//AP_accouchement//

// Charger les données au démarrage
window.onload = function () {
    let poids = localStorage.getItem("poids");
    let sommeil = localStorage.getItem("sommeil");

    if (poids) {
        document.getElementById("poids").textContent = poids + " kg";
    }

    if (sommeil) {
        document.getElementById("sommeil").textContent = sommeil + " heures";
    }
};

// Ajouter poids
function ajouterPoids() {
    let poids = prompt("Entrez le poids du bébé (kg) :");

    if (poids) {
        localStorage.setItem("poids", poids); // stockage
        document.getElementById("poids").textContent = poids + " kg";
    }
}

// Ajouter sommeil
function ajouterSommeil() {
    let sommeil = prompt("Nombre d'heures de sommeil :");

    if (sommeil) {
        localStorage.setItem("sommeil", sommeil); // stockage
        document.getElementById("sommeil").textContent = sommeil + " heures";
    }
}

function effacerDonnees() {
    localStorage.clear();

    document.getElementById("poids").textContent = "-- kg";
    document.getElementById("sommeil").textContent = "-- heures";
}