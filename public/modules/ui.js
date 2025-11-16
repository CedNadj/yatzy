import { startGame, roll, score, getState } from "./client.js";

const diceRow = document.getElementById("diceRow");
const rollBtn = document.getElementById("rollBtn");
const status = document.getElementById("status");
const categoriesEl = document.getElementById("categories");

const CATS = ["ones","twos","threes","fours","fives","sixes",
  "onePair","twoPairs","threeKind","fourKind",
  "smallStraight","largeStraight","fullHouse","chance","yatzy"];

async function init() {
  await startGame();
  renderCategories(await getState());
}

rollBtn.addEventListener("click", async () => {
  const state = await roll();
  renderDice(state.dice);
  status.textContent = `Rolls: ${state.rollCount}/${state.maxRolls}`;
  renderCategories(state);
});

categoriesEl.addEventListener("click", async (e)=>{
  if(!e.target.dataset.cat)return;
  const cat = e.target.dataset.cat;
  const state = await score(cat);
  renderDice(state.dice);
  renderCategories(state);
  status.textContent = `Scored ${cat} for ${state.lastScore.value}`;
});

function renderDice(values){
  diceRow.innerHTML="";
  values.forEach(v=>{
    const d=document.createElement("div");
    d.className="die";
    d.innerHTML=getPipHTML(v);
    diceRow.appendChild(d);
  });
}

function renderCategories(state){
  categoriesEl.innerHTML="";
  CATS.forEach(cat=>{
    const li=document.createElement("li");
    li.dataset.cat=cat;
    const scored=state.scores?.[cat];
    li.textContent=`${cat}: ${scored ?? "-"}`;
    li.style.opacity=scored?0.5:1;
    categoriesEl.appendChild(li);
  });
}

function getPipHTML(v){
  const layout={
    1:['center'],
    2:['top-left','bottom-right'],
    3:['top-left','center','bottom-right'],
    4:['top-left','top-right','bottom-left','bottom-right'],
    5:['top-left','top-right','center','bottom-left','bottom-right'],
    6:['top-left','top-right','middle-left','middle-right','bottom-left','bottom-right']
  };
  return layout[v].map(p=>`<span class="pip ${p}"></span>`).join("");
}

init();
