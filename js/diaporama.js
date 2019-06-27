/********************création d'un nouveau tableau**********************/
var imgDiaporama = new Array()

imgDiaporama[0] = new Image()
imgDiaporama[0].src = '../images/photodiaporama1.jpg'
imgDiaporama[0].textContent = "Pour réserver votre premier vélo, suivez les 3 étapes de ce diaporama grâce aux flèches droite et gauche du diaporama ou de votre clavier.Bonne réservation!"

imgDiaporama[1] = new Image()
imgDiaporama[1].src = '../images/photodiaporama2.jpg'
imgDiaporama[1].textContent = "ETAPE 1 : Sur la carte ci-dessous, cliquez sur la station ou vous voulez réserver votre vélo pour ouvrir un formulaire de réservation"

imgDiaporama[2] = new Image()
imgDiaporama[2].src = '../images/photodiaporama3.jpg'
imgDiaporama[2].textContent = 'ETAPE 2 : Si il reste un vélo disponible, cliquez sur "réserver"!'

imgDiaporama[3] = new Image()
imgDiaporama[3].src = '../images/photodiaporama4.jpg'
imgDiaporama[3].textContent = 'ETAPE 3 : Un formulaire demandant votre signature s\'ouvre.Signez puis cliquez sur "valider".Et voilà, vous avez réservé votre premier vélo!'

imgDiaporama[4] = new Image()
imgDiaporama[4].src = '../images/photodiaporama5.jpg'
imgDiaporama[4].textContent = "Une nouvelle réservation validée remplacera la précédente!Attention!Vélo'V rend accro!"

/********************récupération des emplacements via les id**********************/
var boutonGauche = document.getElementById("boutonGauche")
var boutonDroite = document.getElementById("boutonDroite")
var image = document.getElementById("image")
var texte_diaporama = document.getElementById("texte_diaporama")

texte_diaporama.style.backgroundColor = "transparent"
texte_diaporama.style.borderTop = "transparent"

/*************************fonctions d'animations************************************/
setTimeout(function () {
            texte_diaporama.style.backgroundColor = "#e32118"
            texte_diaporama.textContent = "Pour réserver votre premier vélo, suivez les 3 étapes de ce diaporama grâce aux flèches droite et gauche du diaporama ou de votre clavier.Bonne réservation!"
            texte_diaporama.style.borderTop = ""
}, 500)
setTimeout(function () {
            texte_diaporama.style.backgroundColor = ""
            texte_diaporama.textContent = "Pour réserver votre premier vélo, suivez les 3 étapes de ce diaporama grâce aux flèches droite et gauche du diaporama ou de votre clavier.Bonne réservation!"
            texte_diaporama.style.borderTop = ""
}, 900)
setTimeout(function () {
            boutonDroite.style.backgroundColor = "#e32118"
}, 900)
setTimeout(function () {
            boutonDroite.style.backgroundColor = "darkgrey"
}, 1400)
setTimeout(function () {
            boutonGauche.style.backgroundColor = "#e32118"
}, 1400)
setTimeout(function () {
            boutonGauche.style.backgroundColor = "darkgrey"
}, 1900)

/********************création de l'objet avec des propriétés correspondant à des méthodes**********************/
var i = 0;
var Diaporama = {
    init: function () {
        image.src = imgDiaporama[0].src
    },
    imageSuivante: function () {
        image.src = imgDiaporama[i + 1].src
        texte_diaporama.textContent = imgDiaporama[i + 1].textContent
    },
    imagePrecedente: function () {
        image.src = imgDiaporama[i - 1].src
        texte_diaporama.textContent = imgDiaporama[i - 1].textContent
    },
    evenements: function () {
        document.addEventListener("keydown", function (e) {
            if (e.keyCode === 39) {
                monDiaporama.imageSuivante()
                i++
            } else if (e.keyCode === 37) {
                monDiaporama.imagePrecedente()
                i--
            }
        })
        boutonDroite.addEventListener("click", function () {
            monDiaporama.imageSuivante()
            i++

        })
        boutonGauche.addEventListener("click", function () {
            monDiaporama.imagePrecedente()
            i--

        })
    }
}
/*****************appel des méthodes pour l'affichage***********************/
var monDiaporama = Object.create(Diaporama)
monDiaporama.init() //appel de la méthode qui permet de lancer l'initialisation
monDiaporama.evenements() //appel de la méthode qui permet de lancer les événements