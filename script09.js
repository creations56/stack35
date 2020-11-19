let titreBouton='',
  entreeEnCours=false,
	position=1, // position entree d'un nombre
  dern='', // dernier caractere entré
  avDern='' // avant dernier caractere entré
  numerique='1234567890', // les caracteres numeriques
  bigNumber=1E10, // gestion imprecision calcul Math.tan
  maxNumber=9.99999999E99 // chiffre max affiché
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
  listWarning=['large number, SCI mode set','operation is undefined','calculation not possible'];
  
  

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

document.querySelectorAll('.bbleu').forEach(item => {
  item.addEventListener('click', event => {    
    const {target} = event;
	titreBouton=target.textContent;
	boutonBleu(titreBouton);
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
      affichageResults('ENTER');
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
  // gestion des touches blanches , entree d'un nombre
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
  // gestion des boutons gris, gestion pile et autres
  let flagR=true; // affichageResults
  let r=0;
  if (x==='ENTER'){fEnter();flagR=false};// fEnter affiche deja results
  if (x==='PI'){affichageInput('');fUp();pile0=Math.PI}
  if (x==='DROP'){fDown()}
  if (x==='DUP'){fEnter();fUp();pile0=pile1}
  if (x==='STO'){fEnter();mem=pile0}
  if (x==='RCL'){affichageInput('');fUp();pile0=mem}
  if (x==='SWAP'){fEnter();r=pile0;pile0=pile1;pile1=r}
  if (x==='CSTK'){pile0=0;pile1=0;pile2=0;mem=0} 
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

function boutonBleu(x){
  // gestion des touches bleus, calculs
  let flagR=true; // affichageResults
  let r=0; // valeur intermediaire
  if (x==='DIV'){
    fEnter();
    r=pile1/pile0;
    if (isNaN(r)) {warning=listWarning[1];flagR=false}
    else if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false}
    else {pile1=r;fDown()}
    }
  if (x==='MUL'){fEnter();pile1=pile1*pile0;fDown()}
  if (x==='MINU'){fEnter();pile1=pile1-pile0;fDown()}
  if (x==='PLUS'){fEnter();pile1=pile1+pile0;fDown()}
  if (x==='CHS'){fEnter();pile0=-pile0}
  if (x==='INV'){
    fEnter();
    r=1/pile0;
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false}
    else {pile1=r;fDown()}
  }
  if (x==='ASIN'){
    fEnter();
    r=Math.asin(pile0); // en radians
    if (isNaN(r)) {warning=listWarning[2];flagR=false} // val sup a 1 ou inf a -1
    else {if (degrad==='DEG'){r=r/Math.PI*180}; pile0=r}
    }
  if (x==='ACOS'){
    fEnter();
    r=Math.acos(pile0); // en radians
    if (isNaN(r)) {warning=listWarning[1];flagR=false} // val sup a 1 ou inf a -1
    else {if (degrad==='DEG'){r=r/Math.PI*180}; pile0=r}
  }
  if (x==='ATAN'){
    fEnter();
    r=Math.atan(pile0); // en radians
    if (degrad==='DEG'){r=r/Math.PI*180};
    pile0=r;
  }
  if (x==='SIN'){
    fEnter();
    if (degrad==='DEG'){r=pile0/180*Math.PI}
    else {r=pile0}
    pile0=Math.sin(r); //  r en radians
  }
  if (x==='COS'){
    fEnter();
    if (degrad==='DEG'){r=pile0/180*Math.PI}
    else {r=pile0}
    pile0=Math.cos(r); //  r en radians
  }
  if (x==='TAN'){
    fEnter();
    if (degrad==='DEG'){r=pile0/180*Math.PI}
    else {r=pile0} 
    r=Math.tan(r);
    if ((Math.abs(r)>maxNumber)||(Math.abs(r)>bigNumber)) {warning=listWarning[2];flagR=false} // gestion imprecision Math.tan
    else {pile0=r}
  }
  if (x==='PWR'){
    fEnter();
    r=Math.pow(pile0,pile1);
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false}
    else {pile1=r;fDown()}
  }
  if (x==='EXP'){
    fEnter();
    r=Math.exp(pile0);
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false}
    else {pile0=r}
  }
  if (x==='X2'){
    fEnter();
    r=pile0*pile0;
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false}
    else {pile0=r}
  }
  if (x==='LOG'){
    fEnter();
    r=Math.log10(pile0);
    if (isNaN(r)) {warning=listWarning[1];flagR=false} // val negative
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false} // val 0
    else {pile0=r}
  }
  if (x==='LN'){
    fEnter();
    r=Math.log(pile0);
    if (isNaN(r)) {warning=listWarning[1];flagR=false} // val negative
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false} // val 0
    else {pile0=r}
  }
  if (x==='SQRT'){
    fEnter();
    r=Math.sqrt(pile0);
    if (isNaN(r)) {warning=listWarning[1];flagR=false} // val negative
    else {pile0=r}
  }
  
  affichagePile(); // attention affichage doit etre avant fResults cause fixsci
  if (flagR===true){affichageResults(x);}
}// fin de boutonGris


affichagePile();
affichageResults('INIT');
  
