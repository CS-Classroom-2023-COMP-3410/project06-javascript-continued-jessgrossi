const categories = {
    fruits: ["🍎", "🍎", "🍌", "🍌", "🍇", "🍇", "🍒", "🍒", "🍉", "🍉", "🍓", "🍓", "🥝", "🥝", "🍍", "🍍"],
    animals: ["🐶", "🐶", "🐱", "🐱", "🐭", "🐭", "🐰", "🐰", "🦊", "🦊", "🐻", "🐻", "🐯", "🐯", "🐸", "🐸"],
    numbers: ["1️⃣", "1️⃣", "2️⃣", "2️⃣", "3️⃣", "3️⃣", "4️⃣", "4️⃣", "5️⃣", "5️⃣", "6️⃣", "6️⃣", "7️⃣", "7️⃣", "8️⃣", "8️⃣"]
  };
  
  let moves = 0;
  let timer = 0;
  let timerInterval;
  let firstCard = null;
  let secondCard = null;
  let matchedPairs = 0;
  let selectedCategory = "";
  let isPaused = false;
  
  const movesElement = document.getElementById("moves");
  const timeElement = document.getElementById("time");
  const gameBoard = document.getElementById("game-board");
  const startButton = document.getElementById("start-btn");
  const pauseButton = document.getElementById("pause-btn");
  const resumeButton = document.getElementById("resume-btn");
  const shareButton = document.getElementById("share-btn");
  const playAgainButton = document.getElementById("play-again-btn");
  const clearLeaderboardButton = document.getElementById("clear-leaderboard");
  const leaderboardBody = document.getElementById("leaderboard-body");
  const categorySelector = document.getElementById("category");
  
  startButton.addEventListener("click", startGame);
  pauseButton.addEventListener("click", pauseGame);
  resumeButton.addEventListener("click", resumeGame);
  shareButton.addEventListener("click", shareResults);
  playAgainButton.addEventListener("click", playAgain);
  clearLeaderboardButton.addEventListener("click", clearLeaderboard);
  
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  function startGame() {
    selectedCategory = categorySelector.value;
  
    if (!selectedCategory) {
      alert("Please select a category before starting the game!");
      return;
    }
  
    resetGame();
  }
  
  function resetGame() {
    moves = 0;
    timer = 0;
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    isPaused = false;
  
    movesElement.textContent = moves;
    timeElement.textContent = timer;
  
    clearInterval(timerInterval);
    shareButton.classList.add("hidden");
    playAgainButton.classList.add("hidden");
  
    timerInterval = setInterval(() => {
      if (!isPaused) {
        timer++;
        timeElement.textContent = timer;
      }
    }, 1000);
  
    gameBoard.classList.remove("hidden");
    pauseButton.classList.remove("hidden");
    resumeButton.classList.add("hidden");
    gameBoard.innerHTML = "";
    const shuffledCards = shuffle([...categories[selectedCategory]]);
  
    shuffledCards.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.item = item;
      card.addEventListener("click", handleCardClick);
      gameBoard.appendChild(card);
    });
  }
  
  function handleCardClick(event) {
    if (isPaused) return;
  
    const clickedCard = event.target;
  
    if (clickedCard.classList.contains("flipped") || clickedCard.classList.contains("matched")) return;
  
    if (!firstCard) {
      firstCard = clickedCard;
      revealCard(clickedCard);
    } else if (!secondCard) {
      secondCard = clickedCard;
      revealCard(clickedCard);
      checkMatch();
    }
  }
  
  function revealCard(card) {
    card.textContent = card.dataset.item;
    card.classList.add("flipped");
  }
  
  function checkMatch() {
    moves++;
    movesElement.textContent = moves;
  
    if (firstCard.dataset.item === secondCard.dataset.item) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      firstCard = null;
      secondCard = null;
      matchedPairs++;
  
      if (matchedPairs === categories[selectedCategory].length / 2) {
        clearInterval(timerInterval);
        saveScore(moves, timer);
        setTimeout(() => {
          alert(`You won! Moves: ${moves}, Time: ${timer} seconds`);
          shareButton.classList.remove("hidden");
          playAgainButton.classList.remove("hidden");
        }, 300);
      }
    } else {
      setTimeout(() => {
        hideCard(firstCard);
        hideCard(secondCard);
        firstCard = null;
        secondCard = null;
      }, 1000);
    }
  }
  
  function hideCard(card) {
    card.textContent = "";
    card.classList.remove("flipped");
  }
  
  function pauseGame() {
    isPaused = true;
    clearInterval(timerInterval);
    pauseButton.classList.add("hidden");
    resumeButton.classList.remove("hidden");
  }
  
  function resumeGame() {
    isPaused = false;
    pauseButton.classList.remove("hidden");
    resumeButton.classList.add("hidden");
  
    timerInterval = setInterval(() => {
      if (!isPaused) {
        timer++;
        timeElement.textContent = timer;
      }
    }, 1000);
  }
  
  function playAgain() {
    resetGame();
  }
  
  function saveScore(moves, time) {
    const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push({ moves, time });
  
    scores.sort((a, b) => a.moves - b.moves || a.time - b.time);
    localStorage.setItem("leaderboard", JSON.stringify(scores.slice(0, 5)));
  
    updateLeaderboard();
  }
  
  function updateLeaderboard() {
    const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardBody.innerHTML = scores
      .map((score, index) => `<tr><td>${index + 1}</td><td>${score.moves}</td><td>${score.time}</td></tr>`)
      .join("");
  }
  
  function clearLeaderboard() {
    localStorage.removeItem("leaderboard");
    updateLeaderboard();
  }
  
  // Initialize leaderboard on page load
  updateLeaderboard();
  