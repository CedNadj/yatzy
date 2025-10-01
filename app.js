const DICE_COUNT = 5;
const MAX_ROLLS = 3;

let state = {dice: [], rollCount: 0, score:{}};

const diceRow = document.getElementById('diceRow');
const rollBtn = document.getElementById('rollBtn');
const resetTurnBtn = document.getElementById('resetTurn');
const rollCountEl = document.getElementById('rollCount');
const rollLeftEl = document.getElementById('rollLeft');
const lastRollText = document.getElementById('lastRollText');
const totalScoreEl = document.getElementById('totalScore');

function init(){
    state.dice = Array.from({length:DICE_COUNT}, ()=>({face:1, held:false}));
    state.rollCount = 0; state.score = {};
    renderDice(); attachScoreHandlers(); updateUI();
}

function rollDice() {
  if(state.rollCount>=MAX_ROLLS) return;
  state.rollCount++;
  state.dice.forEach(d=>{ if(!d.held) d.face=Math.floor(Math.random()*6)+1; });
  updateUI();
}

function counts(){const c=[0,0,0,0,0,0,0];state.dice.forEach(d=>c[d.face]++);return c;}
function sumDice(){return state.dice.reduce((a,b)=>a+b.face,0);}
function scoreN(n){return state.dice.filter(d=>d.face===n).length*n;}
function onePair(){const c=counts();for(let v=6;v>=1;v--) if(c[v]>=2)return v*2;return 0;}
function twoPairs(){const c=counts();const p=[];for(let v=6;v>=1;v--)if(c[v]>=2)p.push(v);return p.length>=2?p[0]*2+p[1]*2:0;}
function nKind(n){const c=counts();for(let v=6;v>=1;v--)if(c[v]>=n)return v*n;return 0;}
function smallStraight(){return [1,2,3,4,5].every(x=>counts()[x])?15:0;}
function largeStraight(){return [2,3,4,5,6].every(x=>counts()[x])?20:0;}
function fullHouse(){const c=counts();let h3=false,h2=false;for(let v=1;v<=6;v++){if(c[v]===3)h3=true;if(c[v]===2)h2=true;}return h3&&h2?sumDice():0;}
function chance(){return sumDice();}
function yatzy(){return counts().some(v=>v===5)?50:0;}

const scoring={
  ones:()=>scoreN(1), twos:()=>scoreN(2), threes:()=>scoreN(3), 
  fours:()=>scoreN(4), fives:()=>scoreN(5), sixes:()=>scoreN(6),
  onePair, twoPairs, threeKind:()=>nKind(3), fourKind:()=>nKind(4),
  smallStraight, largeStraight, fullHouse, chance, yatzy
};

function attachScoreHandlers(){
  document.querySelectorAll('.score-cell').forEach(cell=>{
    cell.onclick=()=>{
      if(cell.classList.contains('filled'))return;
      const key=cell.dataset.key, val=scoring[key]();
      cell.textContent=val; cell.classList.add('filled'); state.score[key]=val;
      updateTotal(); newTurn();
    };
  });
}

function updateTotal(){totalScoreEl.textContent=Object.values(state.score).reduce((a,b)=>a+(b||0),0);}
function newTurn(){state.dice.forEach(d=>d.held=false);state.rollCount=0;renderDice();updateUI();}
function updateUI(){
  renderDice(); rollCountEl.textContent=state.rollCount; rollLeftEl.textContent=MAX_ROLLS-state.rollCount;
  lastRollText.textContent=state.dice.map(d=>d.face).join(', ');
  document.querySelectorAll('.score-cell:not(.filled)').forEach(cell=>{
    const val=scoring[cell.dataset.key](); cell.textContent=val; cell.style.opacity=.55;
  });
}

rollBtn.onclick=rollDice;
resetTurnBtn.onclick=newTurn;
init();