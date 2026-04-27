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

// Gestion des événements (DOM)
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Gestion du changement de statut (IMG_0871)
    const selectStatut = document.getElementById('selectStatut');
    if(selectStatut) {
        selectStatut.addEventListener('change', (e) => {
            dataApp.userStatus = e.target.value;
            console.log("Statut choisi : " + dataApp.userStatus);
        });
    }

    // 2. Remplissage automatique des RDV (IMG_0873)
    const containerRdv = document.getElementById('rdv-list');
    if(containerRdv) {
        dataApp.rdv.forEach(item => {
            const card = document.createElement('div');
            card.className = "blue-section";
            card.style.display = "flex";
            card.innerHTML = `
                <img src="${item.img}" width="80">
                <div style="margin-left:20px; text-align:left;">
                    <h3>${item.titre}</h3>
                    <p>(Ajouter un rendez-vous)</p>
                    <button class="btn-submit" onclick="alert('Ajouté !')">+ Ajouter</button>
                </div>
            `;
            containerRdv.appendChild(card);
        });
    }
});

// Fonction pour débloquer la session post-partum (Logique JS)
function checkPostPartum() {
    if(dataApp.userStatus === "maman") {
        // Logique pour enlever le cadenas sur suivi.html
    }
}

function analyserBebe() {

  let poids = document.getElementById("poids").value;
  let taille = document.getElementById("taille").value;
  let resultat = document.getElementById("resultat");

  // Vérification
  if (poids === "" || taille === "") {
    resultat.innerText = "Veuillez remplir les deux champs.";
    resultat.style.color = "red";
    return;
  }

  poids = parseInt(poids);
  taille = parseInt(taille);

  // Analyse du poids
  if (poids < 2000) {
    resultat.innerText = "⚠️ Bébé un peu petit. Un suivi est conseillé.";
    resultat.style.color = "orange";
  } 
  else if (poids >= 2000 && poids <= 4000) {
    resultat.innerText = "💚 Croissance normale. Tout va bien.";
    resultat.style.color = "green";
  } 
  else {
    resultat.innerText = "⚠️ Bébé plus grand que la moyenne. À surveiller.";
    resultat.style.color = "orange";
  }

  // Ajout info taille
  if (taille < 40) {
    resultat.innerText += " Taille légèrement faible.";
  } 
  else if (taille > 55) {
    resultat.innerText += " Taille au-dessus de la moyenne.";
  }

}