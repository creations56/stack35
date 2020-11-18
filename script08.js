let titreBouton='',
  entreeEnCours=false,
	position=1, // position entree d'un nombre
  dern='', // dernier caractere entré
  avDern='' // avant dernier caractere entré
  numerique='1234567890', // les caracteres numeriques
  espace=String.fromCharCode(160), //&nsp
  fleche=String.fromCharCode(8594),
  retLigne=String.fromCharCode(10),
  pile0=0, // valeurs numerique pile et mem
  pile1=0,
  pile2=0,
  mem=0,
  fixsci='FIX', // pour affichage des nombres
  decimales=2 ,
  degrad='DEG',
  warning='',
  results='\n',
  listOpe=[],
  ope=[],
  listWarning=['large number, SCI mode set'];
  

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


function fUp(){
  // decale pile vers le haut
  pile2=pile1;
  pile1=pile0;
  pile0=0;
}

function fDown(){
  //decale pile vers le bas
  pile0=pile1;
  pile1=pile2;
  pile2=0;
}

function fEnter(){
  if (entreeEnCours===true){
      fUp();
      pile0=parseFloat(aInput.textContent);
      affichageInput('');
      entreeEnCours=false;
    }
    else {return}
}


function affichageInfo(){
  // mise a jour affichage info
  if (warning===''){aInfo.textContent=degrad+' , '+fixsci+' , '+decimales;}
  else {aInfo.textContent=warning;warning=''}
}

function affichageResults(x){
  if (fixsci==='FIX'){valPile=pile0.toFixed(decimales)}
  else {valPile=pile0.toExponential(decimales)}
  ope=[x,valPile];
  long=listOpe.length;
  if (long>14){listOpe.pop()} // reduire liste
  listOpe.unshift(ope); 
  long=listOpe.length;
  aResults.textContent='';
  for (let i = 0; i < long; i++) {
    results=listOpe[i][0].padEnd(10,espace)+fleche+listOpe[i][1].padStart(18,espace);
    aResults.textContent=aResults.textContent+'\u000A'+results;
  }
}

function affichagePile(){
  l0=pile0.toFixed(decimales).length;// eval longueur max affichage
  l1=pile1.toFixed(decimales).length;// si sup 16 caracteres
  l2=pile2.toFixed(decimales).length;// passage
  lmem=mem.toFixed(decimales).length;// en SCI
  lmax=Math.max(l0,l1,l2,lmem);
  if ((fixsci==='FIX')&&(lmax>16)) {fixsci='SCI';warning=listWarning[0]}
  
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
  affichageInfo();
}

function affichageInput(z){
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
  affichageInfo(); // mise a jour des messages si touche appuyee
  if (entreeEnCours===true) {
	  if (x==='AC') {z=''}
	  else if (x==='C') {z=y.substr(0,y.length-1)}
	  else if (y.length>11) {return}// nombre de caracteres max
    else if (position===4) {return}// deja 2 digits apres E
    else if (x==='.') {if (position===1){z=y+x} else {return}}
    else if (x==='-'){if ((position===3)&&(dern==='E')){z=y+x} else {return}}
    else if (x==='E'){if (position<3){z=y+x} else {return}}
	  else {z=y+x}
	affichageInput(z);// affichage de input
  } 
  else { // nouvelle entree  
	  if (x==='C'){return}
	  else if (x==='AC') {return }
	  else if (x==='.'){z='0.'}
	  else if (x==='E'){z='1.0E'}
	  else {z=x}
  entreeEnCours=true;
	affichageInput(z);
  } // fin de nouvelle entree
 } // fin de boutonBlanc
 
function boutonGris(x){
  //aResults.textContent=x;
  let flagR=true; // affichageResults
  if (x==='ENTER'){fEnter()}
  if (x==='PI'){affichageInput('');fUp();pile0=Math.PI}
  if (x==='DROP'){fDown()}
  if (x==='DUP'){fEnter();fUp();pile0=pile1}
  if (x==='STO'){fEnter();mem=pile0}
  if (x==='RCL'){affichageInput('');fUp();pile0=mem}
  if (x==='CMEM'){mem=0}
  if (x==='CSTK'){pile0=0;pile1=0;pile2=0} 
  if (x==='DEG'){degrad='DEG'} 
  if (x==='RAD'){degrad='RAD'} 
  if (x==='FIX'){fixsci='FIX';flagR=false} 
  if (x==='SCI'){fixsci='SCI';flagR=false} 
  if (x==='D+'){if (decimales<8){decimales +=1};flagR=false} 
  if (x==='D-'){if (decimales>0){decimales -=1};flagR=false} 
  if (x==='CRST'){listOpe=[]} 
  affichagePile(); // attention affichage doit etre avant fResults cause fixsci
  if (flagR===true){affichageResults(x);}
}// fin de boutonGris

affichagePile();
affichageResults('INIT');
  
