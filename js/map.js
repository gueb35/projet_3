/********************map et formulaires*******************/

//récupère les emplacements via les id
var mapCanvas = document.getElementById("mapCanvas")
var map1 = document.getElementById("map")
var formulaires = document.getElementById("formulaires")
var formReservation = document.getElementById("formReservation")
var titre = document.getElementById("titre")
var divCanvas = document.getElementById("divCanvas")
var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")//permet d'accéder au contexte de canvas
var footer = document.getElementById("footer")
var titre2 = document.getElementById("titre2")
titre2.textContent = "Signature :"

//création des boutons
var boutonValider = document.getElementById("boutonValider")
boutonValider.setAttribute("type", "submit")
boutonValider.value = "Valider"
var boutonEffacer = document.getElementById("boutonEffacer")
boutonEffacer.setAttribute("type", "submit")
boutonEffacer.value = "Effacer"
var boutonAnnuler = document.getElementById("boutonAnnuler")
boutonAnnuler.setAttribute("type", "submit")
boutonAnnuler.value = "Annuler votre réservation"

// Pour Firefox, définit la position des boutons
if(navigator.userAgent.indexOf("Firefox") != -1) {
    boutonValider.style.marginLeft = "45px"
    boutonValider.style.transform = "translateY(-350%)"
    boutonEffacer.style.transform = "translateY(-350%)"
    boutonAnnuler.style.marginLeft = "22.5px"
    boutonAnnuler.style.transform = "translateY(-150%)"
}

function formDisplay(){
                //modification lors du clic
                map1.style.width = "950px"//réduit la largueur de la map
                formulaires.style.display = "block"//permet au formulaires de devenir une balise de type bloc
                formReservation.innerHTML = ""//permet de remplacer les infos des stations quand on clique sur un nouveau marqueur
                formReservation.style.height = ""//permet de conserver la hauteur à 493px
                divCanvas.style.display = "none"//permet de ne pas afficher la div
                titre2.style.display = "none"
                boutonValider.style.display = "none"
                boutonAnnuler.style.display = "none"
}
function noBike(){
    var noBike = document.createElement("p")
    noBike.textContent = "Il n'y a plus de vélo disponible, sélectionnez une autre station !"
    noBike.style.fontWeight = "bold"
    noBike.style.fontSize = "2em"
    noBike.style.backgroundColor = "darkgrey"
    noBike.style.textAlign = "center"
    formReservation.appendChild(noBike)

    setTimeout(function () {
        noBike.style.display = "none"
    },2000)
}

/******************constructeur de class pour la Map******************************/
var MaMap = {
    initMap: function () {
        var lyon = {
            lat: 45.765500,
            lng: 4.850000
        }
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12.5,
            center: lyon
        })   
        this.requeteMarker()    
    },
/*************************************************************************************/
    requeteMarker: function(){
        //requete pour les données jcdecaux
        var req = new XMLHttpRequest();
        req.open("GET", "https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=b5aa181c2937ee65c18b054fbd3c3d6f71e5fa63")
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                var station = JSON.parse(req.responseText) //transforme en objet la reponse de la requete
    
                // Le groupe suivant utilise le tableau d'emplacement pour créer un tableau de marqueurs à l'initialisation.
                for (var i = 0; i < station.length; i++) {
                    // Crée un marqueur par emplacement
                    var marker = new google.maps.Marker({
                        number : station[i].number,
                        name: station[i].name,
                        address : station[i].address,
                        position : station[i].position,
                        map: map,
                        banking : station[i].banking,
                        bonus : station[i].bonus,
                        status : station[i].status,
                        contract_name : station[i].contract_name,
                        bike_stands : station[i].bike_stands,
                        available_bike_stands : station[i].available_bike_stands,
                        available_bikes : station[i].available_bikes,
                        last_update : station[i].last_update,
                        // title: "possibilté de mettre une infobulle"
                    }) 
                    marker.addListener('click', function(){
                        var that = this
                        MaMap.evenements(that)
                    })                
                }//fermeture de la boucle for
            } else {
                // Affichage des informations sur l'échec du traitement de la requête
                console.error(req.status + " " + req.statusText)
            }
        })
        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            console.error("Erreur réseau");
        })
        req.send(null)
        },
/*************************************************************************************/
evenements: function(that){
        if(that.status==="CLOSED"){//si la station est fermée
            formDisplay()
            
            //création des éléments et identification
            var closed = document.createElement("p")
            closed.setAttribute("id", "closed")
            closed.textContent = "La station située "+ that.address + " est actuellement fermée, choisissez une autre station !"

            formReservation.appendChild(titre)
            formReservation.appendChild(closed)
        } else if(that.available_bikes !==0){//si il reste un vélo disponible
            formDisplay()
            footer.innerHTML = ""
            
            //création des éléments et identification
            var addressElt = document.createElement("p")
            addressElt.setAttribute("id", "paraAddress")

            var placeTotaleElt=  document.createElement("p")
            placeTotaleElt.setAttribute("id", "paraNbreVelo")

            var veloDispoElt = document.createElement("p")
            veloDispoElt.setAttribute("id", "paraVeloDispo")

            var boutonReserve = document.createElement("input")
            boutonReserve.setAttribute("id","boutonReserver")
            boutonReserve.setAttribute("type", "submit")
            boutonReserve.value=  "Réserver"

            //texte des éléments crées
            addressElt.textContent =  "Adresse : " +that.address
            placeTotaleElt.textContent = that.bike_stands + " places"
            veloDispoElt.textContent =  that.available_bikes + " vélo(s) disponible(s)"

            //stockage des données de la station sélectionnée
            var veloDispo = that.available_bikes
            var address = that.address

            //affichage des éléments crées avec lien de parentalité
            formReservation.appendChild(titre)
            formReservation.appendChild(addressElt)
            addressElt.appendChild(placeTotaleElt)
            placeTotaleElt.appendChild(veloDispoElt)
            veloDispoElt.appendChild(boutonReserve)

/*******événement sur le bouton "réserver" du formulaire de réservation******/
        boutonReserve.addEventListener("click", function(){
            boutonReserve.style.display="none"//supprime le bouton réserver
            formReservation.style.height=  "241px"//modifie la hauteur du formulaire de réservation
            divCanvas.style.display = ""//fait réapparaître la div
            canvas.style.display = ""//fait réapparaître le canvas
            titre2.style.display = ""//permet de supprimer le titre pour qu'il n'apparaisse pas 2 fois
            boutonValider.style.display = ""//permet de supprimer le boutonValider pour qu'il n'apparaisse pas 2 fois
            context.clearRect(0, 0, 250, 248)
            Signature.verifSignature = "a"//repasse la valeur à "a"

            //événement sur le bouton effacer
            boutonEffacer.addEventListener("click", function(){
                context.clearRect(0, 0, 250, 248)//les coordonnées x et y à 0 et les dimmensions correspondant à la taille définit ds l'html permettent d'effacer le canvas
                Signature.verifSignature = "a"//repasse la valeur à "a" 
            })

            setTimeout(() => startTimer = false);//permet de stopper le compteur
            
/***********événement sur le bouton valider************************/
            boutonValider.addEventListener("click", function(){
            if(Signature.verifSignature === "a"){//vérifie si il y a une signature présente
                    footer.innerHTML = '<p>Veuillez signer le formulaire</p>'
                    footer.style.border = ""
                    footer.style.backgroundColor = ""
            }else{//si une signature est présente
                var currentDate = new Date()//récupère la date au clic du bouton valider
                sessionStorage.setItem("date", currentDate)//stocke la date
                var minutes = currentDate.getMinutes()//récupère les minutes
                var secondes = currentDate.getSeconds()//récupère les secondes
                var fullInSeconds = (minutes * 60)*1000 + secondes * 1000//convertit l'ensemble en millisecondes
                sessionStorage.setItem("fullInSeconds",fullInSeconds)
                
                sessionStorage.setItem("address", that.address)
                sessionStorage.setItem("available_bikes", that.available_bikes-1)//stocke ds le browser le nombre de vélo disponible de la station
                sessionStorage.setItem("bike_stands",that.bike_stands)//stocke ds le browser le nombre de places en tout
                
                divCanvas.style.display = "none"//empèche l'affichage de la divCanvas
                canvas.style.display = "none"//empèche l'affichage de canvas
                titre2.style.display = "none"//empèche l'affichage du titre2
                boutonValider.style.display = "none"//empèche l'affichage du bouton valider
                formReservation.style.height = "493px"//redéfinit le hauteur du formulaire de réservation
                veloDispoElt.textContent =  veloDispo -1  + " vélo(s) disponible(s)"//modifie le nombre de vélo dispo
                footer.innerHTML = ""//permet de remplacer l'élément du footer si un est déjà présent

                boutonAnnuler.style.display = ""
                formulaires.appendChild(boutonAnnuler)

                setTimeout(() => startTimer = true);//redéfinit le booléen à true
                monCompteur.timer(20*60*1000, true);//permet de lancer le timer(1 200 000 millisecondes)

/***************événement sur le bouton annuler*********************/
                boutonAnnuler.addEventListener("click", function(){
                    formulaires.style.display = "none"
                    map1.style.width = "1200px"
                    sessionStorage.clear()
                    setTimeout(() => startTimer = false);//permet de stopper le compteur
                    footer.innerHTML = ""
                })
                }
            })//fermeture de l'event boutonValider
        })//fermeture de l'event boutonReserve
        }else{//si il ne reste plus de vélo disponible
            formDisplay()
            
            //création des éléments et identification
            var addressElt = document.createElement("p")
            addressElt.setAttribute("id", "paraAddress")

            var placeTotaleElt=  document.createElement("p")
            placeTotaleElt.setAttribute("id", "paraNbreVelo")

            var veloDispoElt = document.createElement("p")
            veloDispoElt.setAttribute("id", "paraVeloDispo")

            //texte des éléments crées
            addressElt.textContent =  "Adresse : " +that.address
            placeTotaleElt.textContent = that.bike_stands + " places"
            veloDispoElt.textContent =  that.available_bikes + " vélo(s) disponible(s)"

            //stockage des données de la station sélectionnée
            var veloDispo = that.available_bikes
            var address = that.address

            //affichage des éléments crées avec lien de parentalité
            formReservation.appendChild(titre)
            formReservation.appendChild(addressElt)
            addressElt.appendChild(placeTotaleElt)
            placeTotaleElt.appendChild(veloDispoElt)

            noBike()
        }//si il ne reste plus de vélo disponible
    },//fermeture de la méthode événements

    eventWindow: function(){
/*******événement de chargement de page pour récupérer les infos stockées********/
        window.addEventListener("load", function(){
            if (sessionStorage.getItem("address")!==null && sessionStorage.getItem("available_bikes")!==null && sessionStorage.getItem("bike_stands")){
                var dateNow = new Date()//récupère la date au rafraichissement de la page
                sessionStorage.setItem("dateNow", dateNow)//stocke la date
                var minutesNow = dateNow.getMinutes()//récupère les minutes
                var secondesNow = dateNow.getSeconds()//récupère les secondes
                var fullInSecondsNow = (minutesNow*60) * 1000 + secondesNow*1000//convertit l'ensemble en secondes
                
                var fullInSeconds = sessionStorage.getItem("fullInSeconds")
                var newConvertSeconds =fullInSecondsNow - fullInSeconds//fait la différence entre les sec au moment du clic sur le bouton valider et les sec au rafraichissement de la page
                var newTime = 1200000-newConvertSeconds//détermine le tps qu'il reste

                var addressR = sessionStorage.getItem("address")
                var addressAElt = document.createElement("p")
                addressAElt.setAttribute("id", "paraAddress")
                addressAElt.textContent =  "Adresse : " + addressR

                var placeTotaleR = sessionStorage.getItem("bike_stands")
                var placeTotaleAElt=  document.createElement("p")
                placeTotaleAElt.setAttribute("id", "paraNbreVelo")
                placeTotaleAElt.textContent = placeTotaleR + " places"

                var veloDispoR = sessionStorage.getItem("available_bikes")
                var veloDispoAElt = document.createElement("p")
                veloDispoAElt.setAttribute("id", "paraVeloDispo")
                veloDispoAElt.textContent =  veloDispoR + " vélo(s) disponible(s)"
                
                formDisplay()
                formReservation.appendChild(addressAElt)
                addressAElt.appendChild(placeTotaleAElt)
                placeTotaleAElt.appendChild(veloDispoAElt)

                boutonAnnuler.style.display = ""
                formulaires.appendChild(boutonAnnuler)

                monCompteur.timer(newTime, true);//permet de lancer le timer
                
                boutonAnnuler.addEventListener("click", function(){
                    formulaires.style.display = "none"
                    map1.style.width = "1200px"
                    footer.innerHTML = ""
                    setTimeout(() => startTimer = false);//permet de stopper le compteur
                    sessionStorage.clear()
                })
                }
        })
    }
}//fermeture de l'objet MaMap
MaMap.eventWindow()