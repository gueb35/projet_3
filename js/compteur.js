/**********************constructeur du timer************************/
var Compteur = {
timer: function (ms, firstStart){
    startTimer=true;
    setTimeout(function() {
        if(startTimer === true){
            let min = Math.floor(ms/60000);
            let sec = (ms%60000)/1000;
            if((sec === 0)&&(min === 0)){                
                formulaires.style.display = "none";
                map1.style.width = "1200px";
                sessionStorage.clear();
                setTimeout(() => startTimer = false);//permet de stopper le compteur
                footer.innerHTML = "";
            }else if(sec < 10){
                sec = "0"+sec;
                footer.innerHTML = '<p>Vous venez de réserver un vélo pour une durée de ' + min + ":" + sec + ' min à l\'adresse suivante : ' + sessionStorage.getItem('address') + '.Si une réservation est en cours, le clic sur le bouton "reserver" stoppera le compteur pour permettre une nouvelle réservation !Une fois le décompte terminé, votre réservation ne sera plus valide.Vélo\'V vous souhaite un bon trajet! '
                if(ms>0 && startTimer)  Compteur.timer(ms-1000)
            }else{
                sec = sec;
                footer.innerHTML = '<p>Vous venez de réserver un vélo pour une durée de ' + min + ":" + sec + ' min à l\'adresse suivante : ' + sessionStorage.getItem('address') + '.Si une réservation est en cours, le clic sur le bouton "reserver" stoppera le compteur pour permettre une nouvelle réservation !Une fois le décompte terminé, votre réservation ne sera plus valide.Vélo\'V vous souhaite un bon trajet! '
                if(ms>0 && startTimer)  Compteur.timer(ms-1000)               
            }
        }
    },(firstStart ? 0 : 1000));//si firstart vaut true alors les millisecondes sont égales à 0, si false = 1000(ternaire)
},
}
var monCompteur = Object.create(Compteur)