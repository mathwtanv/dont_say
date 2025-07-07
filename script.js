let current = 0;
let playerTurn = 1;
let gameOver = false;

let mode = "dont-say";
let target = 13;
let maxIncrement = 3;
let selectedMode = ""; // game mode: pvp, easy, hard

function startGame() {
  mode = document.getElementById("mode").value;
  target = parseInt(document.getElementById("target-number").value);
  maxIncrement = parseInt(document.getElementById("increment").value);

  if (target < 1 || target > 100 || maxIncrement < 1 || maxIncrement > 10) {
    alert("Please enter valid values.");
    return;
  }

  const numberArea = document.getElementById("number-area");
  const rowSize = 5;
  numberArea.style.gridTemplateColumns = `repeat(${rowSize}, 50px)`;

  document.getElementById("setup-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  document.getElementById("back-button").classList.remove("hidden");
  document.getElementById("mode-select").style.display = "block";

  // Hide turn text and second dropdown initially
  document.getElementById("turn").classList.add("hidden");
  document.getElementById("first-move-row").classList.add("hidden");

  const capitalizedMode = mode === "say" ? "Say" : "Don't Say";
  document.getElementById("main-title").textContent = `${capitalizedMode} ${target}`;

  setupButtons();
}

function getPlayerLabel() {
  if (selectedMode === "easy" || selectedMode === "hard") {
    return playerTurn === 1 ? "You" : "AI";
  } else {
    return playerTurn === 1 ? "Player A" : "Player B";
  }
}

function chooseGameMode() {
  const gameMode = document.getElementById("game-mode").value;
  selectedMode = gameMode;

  const firstMoveRow = document.getElementById("first-move-row");
  const firstPlayerSelect = document.getElementById("first-player");

  firstPlayerSelect.value = "";
  firstMoveRow.classList.add("hidden");

  if (selectedMode === "easy" || selectedMode === "hard") {
    firstMoveRow.classList.remove("hidden");
  } else if (selectedMode === "pvp") {
    document.getElementById("mode-select").style.display = "none";
    document.getElementById("turn").classList.remove("hidden");
    document.getElementById("turn").textContent = "Player A's Turn";
    document.getElementById("reset-button").classList.remove("hidden");
    setupButtons();
  }
}


function confirmFirstPlayer() {
  const first = document.getElementById("first-player").value;
  if (!first) return;

  document.getElementById("mode-select").style.display = "none";
  document.getElementById("turn").classList.remove("hidden");
  document.getElementById("reset-button").classList.remove("hidden");

  playerTurn = first === "you" ? 1 : 2;
  document.getElementById("turn").textContent = playerTurn === 1 ? "Your Turn" : "AI's Turn";

  setupButtons();

  if (playerTurn === 2) aiMove();
}


function setupButtons() {
  const buttonArea = document.getElementById("say-buttons");
  buttonArea.innerHTML = "";

  const isDisabled = !selectedMode; // true if no mode chosen

  for (let i = 1; i <= maxIncrement; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Say ${i}`;
    btn.disabled = isDisabled;

    btn.onclick = () => {
      if (btn.disabled) return;

      if (selectedMode === "easy" || selectedMode === "hard") {
        if (playerTurn === 1) playerMove(i);
      } else {
        playerMove(i);
      }
    };

    buttonArea.appendChild(btn);
  }
}


function playerMove(count) {
  document.getElementById("reset-button").classList.remove("hidden");
  if (gameOver) return;

  const numberArea = document.getElementById("number-area");

  // Clamp the count so we don't go past the target
  const maxCount = Math.min(count, target - current);

  for (let i = 1; i <= maxCount; i++) {
    current++;

    const box = document.createElement("div");
    box.classList.add("number-box", `player${playerTurn}`);
    box.textContent = current;

    const isMatch = current === target;

    if (isMatch) {
      box.classList.add(mode === "say" ? "winner" : "loser");
      const playerName = getPlayerLabel();
      document.getElementById("result").textContent =
        mode === "say"
          ? `${playerName} said ${target} and WON!`
          : `${playerName} said ${target} and LOST!`;

      gameOver = true;
    }

    numberArea.appendChild(box);
  }

  numberArea.scrollTop = numberArea.scrollHeight;

  if (!gameOver) {
    playerTurn = playerTurn === 1 ? 2 : 1;

    if (selectedMode === "pvp") {
      document.getElementById("turn").textContent =
        `${getPlayerLabel()}'s Turn`;
    } else {
      document.getElementById("turn").textContent =
        playerTurn === 1 ? "Your Turn" : "AI's Turn";
      if (playerTurn === 2) aiMove();
    }
  }
}


function aiMove() {
  if (gameOver) return;

  const delay = selectedMode === "easy" ? 400 : 700;

  setTimeout(() => {
    const bestCount =
      selectedMode === "easy" ? getRandomMove() : getSmartMove();
    playerMove(bestCount);
  }, delay);
}

function getRandomMove() {
  return Math.floor(Math.random() * maxIncrement) + 1;
}

function getSmartMove() {
  const remainder = (target - current - 1) % (maxIncrement + 1);
  return remainder === 0 ? 1 : remainder;
}

function resetGame() {
  current = 0;
  playerTurn = 1;
  gameOver = false;
  
  document.getElementById("number-area").innerHTML = "";
  document.getElementById("result").textContent = "";

  document.getElementById("setup-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  document.getElementById("back-button").classList.remove("hidden");

  document.getElementById("reset-button").classList.remove("hidden");

  selectedMode = "";

  document.getElementById("game-mode").value = "";
  document.getElementById("first-player").value = "";

  document.getElementById("mode-select").style.display = "block";

  document.getElementById("first-move-row").classList.add("hidden");
  const turnEl = document.getElementById("turn");
  turnEl.classList.add("hidden");
  turnEl.textContent = "";

  setupButtons();
}



function goToInitial() {
  current = 0;
  playerTurn = 1;
  gameOver = false;
  selectedMode = "";

  document.getElementById("number-area").innerHTML = "";
  document.getElementById("turn").textContent = "";
  document.getElementById("result").textContent = "";
  document.getElementById("reset-button").classList.add("hidden");
  document.getElementById("back-button").classList.add("hidden");
  document.getElementById("say-buttons").innerHTML = "";
  document.getElementById("turn").classList.add("hidden");

  document.getElementById("main-title").textContent = "To Say or Not to Say a Number";
  document.getElementById("setup-screen").style.display = "flex";
  document.getElementById("game-container").style.display = "none";

  document.getElementById("mode").value = "dont-say";
  document.getElementById("target-number").value = 13;
  document.getElementById("increment").value = 2;
  document.getElementById("game-mode").value = "";
  document.getElementById("first-player").value = "";
  document.getElementById("first-move-row").classList.add("hidden");
}
