

let titreBouton='',
	entreeEnCours=false,
	position=1, // position entree d'un nombre
  dern='', // dernier caractere entré
  avDern='' // avant dernier caractere entré
  numerique='1234567890', // les caracteres numeriques
  espace=String.fromCharCode(160),
  fleche=String.fromCharCode(8594),
  pile0=0, // valeurs numerique pile et mem
  pile1=0,
  pile2=0,
  mem=0,
  fixsci='SCI', // pour affichage des nombres
  decimales=2 ,
  degrad='DEG',
  info=degrad+' , '+fixsci+' , '+decimales,
  results='INIT'.padEnd(15,espace)+fleche+'0.0'.padStart(19,espace);
  

aInput = document.getElementById('ainput'); 
aInfo = document.getElementById('ainfo'); 
aResults=document.getElementById('aresults');
aPile0 = document.getElementById('apile0'); 
aPile1 = document.getElementById('apile1'); 
aPile2 = document.getElementById('apile2'); 
aMem = document.getElementById('amem'); 

document.querySelectorAll('.bblanc').forEach(item => {
  item.addEventListener('click', event => {    
    const {target} = event;
	titreBouton=target.textContent;
	boutonBlanc(titreBouton);
  })
});

document.querySelectorAll('.bgris').forEach(item => {
  item.addEventListener('click', event => {    
    const {target} = event;
	titreBouton=target.textContent;
	boutonGris(titreBouton);
  })
});

function affichage(){
  if (fixsci==='FIX'){
    aPile0.textContent=pile0.toFixed(decimales);
    aPile1.textContent=pile1.toFixed(decimales);
    aPile2.textContent=pile2.toFixed(decimales);
    aMem.textContent=mem.toFixed(decimales);
  }
  else{
    aPile0.textContent=pile0.toExponential(decimales);
    aPile1.textContent=pile1.toExponential(decimales);
    aPile2.textContent=pile2.toExponential(decimales);
    aMem.textContent=mem.toExponential(decimales);
  }
  aInfo.textContent=info;
  aResults.textContent=results;
}

function afInput(z){
  // affichage de input, calcul de position, dern et avDern
  // position = 1 partie entiere, 2 partie decimale, 3 partie exposant, 4 exposant complet  
  dern=z.substr(-1,1); // dernier caractere
  avDern=z.substr(-2,1); // avant dernier caractere
  if (z.includes('E')===true){position=3}
  else if (z.includes('.')===true) {position=2}
  else {position=1}
  if ((position===3)&& (numerique.includes(dern)===true) && (numerique.includes(avDern)===true)) {position=4} // 2 digits apres E
   
  if (z.length===0){aInput.textContent='?';entreeEnCours=false}
  else {aInput.textContent=z}
}

function boutonBlanc(x) {
  // analyse les touches blanches , entree d'un nombre
  y=aInput.textContent; // y comme raccourci
  z=''; // nouvelle valeur pour entree 
  if (entreeEnCours===true) {
	  if (x==='AC') {z=''}
	  else if (x==='C') {z=y.substr(0,y.length-1)}
	  else if (y.length>11) {return}// nombre de caracteres max
    else if (position===4) {return}// deja 2 digits apres E
    else if (x==='.') {if (position===1){z=y+x} else {return}}
    else if (x==='-'){if ((position===3)&&(dern==='E')){z=y+x} else {return}}
    else if (x==='E'){if (position<3){z=y+x} else {return}}
	  else {z=y+x}
	afInput(z);// affichage de input
  } 
  else { // nouvelle entree  
	  if (x==='C'){return}
	  else if (x==='AC') {return }
	  else if (x==='.'){z='0.'}
	  else if (x==='E'){z='1.0E'}
	  else {z=x}
  entreeEnCours=true;
	afInput(z);
  } // fin de nouvelle entree
 } // fin de boutonBlanc
 
function boutonGris(x){
  if (x==='ENTER'){
    if (entreeEnCours===true){
      pile0=parseFloat(aInput.textContent);
      afInput('');
      entreeEnCours=false;
    }
    else {return}
  }
affichage();
}// fin de boutonGris
 
 
 affichage()
  
