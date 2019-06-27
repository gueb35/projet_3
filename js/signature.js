/*************constructeur du champ canvas**************/
var Signature = {
    started: false,
    verifSignature : "a",

    x:0,
    y:0,
    
    canvas : document.getElementById('canvas'),
    context : canvas.getContext('2d'),

init: function () {
    Signature.canvas.addEventListener('mousemove', Signature.mousemovement, false)
    Signature.canvas.addEventListener('mousedown', Signature.mouseclick, false)
    Signature.canvas.addEventListener('mouseup', Signature.mouseunclick, false)

    Signature.canvas.addEventListener('touchmove', Signature.mousemovement, false)
    Signature.canvas.addEventListener('touchstart', Signature.mouseclick, true)
    // Signature.canvas.addEventListener('touchend', Signature.mouseunclick, false)
    document.body.addEventListener("touchcancel", Signature.mouseunclick, false)

},
mouseclick: function () {
    // Lorsque le clic est détecté, passe la variable started à true et déplace la position initiale de la souris
    Signature.context.lineWidth = 2
    Signature.context.beginPath()
    Signature.context.moveTo(Signature.x, Signature.y)
    Signature.started = true
    if ((Signature.x !== 0)&&(Signature.y !== 0)){
    Signature.verifSignature = "b"
    }
},
// Récupération de l'emplacement de la souris.
// Permet de récupèrer la position de l'élément canvas pour pouvoir récupérer la position de la souris à l'intérieur du canvas.
getOffset: function (elt) {
    var cx = 0
    var cy = 0
 
    while(elt && !isNaN(elt.offsetLeft) && !isNaN(elt.offsetTop)) {
        cx += elt.offsetLeft - elt.scrollLeft
        cy += elt.offsetTop - elt.scrollTop
        elt = elt.offsetParent
    }
    return { top: cy, left: cx }
},
mousemovement: function(e) {

    if(e.offsetX || e.offsetY) { // Chrome
        Signature.x = e.pageX - Signature.getOffset(document.getElementById('canvas')).left //permet de modifier x
        Signature.y = e.pageY - Signature.getOffset(document.getElementById('canvas')).top //permet de modifier y
    }
    // Firefox
    if(navigator.userAgent.indexOf("Firefox") != -1) {
        Signature.x = e.layerX - Signature.canvas.offsetLeft
        Signature.y = e.layerY - Signature.canvas.offsetTop
    }
    // Si la variable started vaut true, alors tracer une ligne
    if(Signature.started) {
        Signature.context.lineTo(Signature.x, Signature.y)
        Signature.context.stroke()
    }
},
mouseunclick: function () {
    // Passe la variable started à false lorsque le bouton est relaché
    if(Signature.started) {
        Signature.started = false
    }
},
}
var maSignature = Object.create(Signature)
maSignature.init() //appel de la méthode qui permet de lancer l'initialisation