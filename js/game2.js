// Define showActorInfo
function showActorInfo(actor) {
    const actorName = document.getElementById("actor-name");
    const actorImage = document.getElementById("actor-image");
    actorName.textContent = actor.name;
    actorImage.src = actor.image;
  }
  
  // Update score
  function updateScore() {
    const scoreValue = document.getElementById("score-value");
    scoreValue.textContent = score;
  }
  
  // Update time
  function updateRemainingTime(time) {
    const timeValue = document.getElementById("time-value");
    timeValue.textContent = time;
  }
  
  // Add guesses to asked list
  function addGuessToList(guess, status) {
    const guessList = document.getElementById("guess-list");
    const listItem = document.createElement("li");
    listItem.textContent = guess;
    if (status) {
      listItem.className = status;
    }
    guessList.appendChild(listItem);
  }
  
  let timer = null;
  let formSubmitHandler = null;
  let score = 0;
  let guessList = [];

  // Clear the guess list HTML
  function resetGuessList() {
    guessList = [];
    const guessListElement = document.getElementById("guess-list");
    guessListElement.innerHTML = ""; 
  }
  
  const DIFFICULTY = {
    EASY: 120,
    MEDIUM: 60,
    HARD: 30,
  };
  let difficulty = DIFFICULTY.EASY;
  
  function setDifficulty(level) {
    difficulty = level;
    easyButton.classList.toggle("selected", level === DIFFICULTY.EASY);
    mediumButton.classList.toggle("selected", level === DIFFICULTY.MEDIUM);
    hardButton.classList.toggle("selected", level === DIFFICULTY.HARD);
  }
  
  let highScore = localStorage.getItem("highscore") || 0;
  let highScoreName = localStorage.getItem("highScoreName") || "";
  let highScoreActorName = localStorage.getItem("highScoreActorName") || "";
  
  function updateHighScore() {
    if (score > highScore) {
      highScore = score;
      highScoreName = playerName;
      highScoreActorName = actor.name;
      localStorage.setItem("highScore", highScore);
      localStorage.setItem("highScoreName", highScoreName);
      localStorage.setItem("highScoreActorName", highScoreActorName);
    }
  }
  
  // Start game function
  function startGame() {
    const nameInput = document.getElementById("name-input");
    const playerName = nameInput.value.trim();
  
    // Validate name input
    if (playerName === "") {
      alert("Please enter your name.");
      nameInput.focus();
      return;
    }
  
    // Hide initial screen and show game screen
    const initialScreen = document.getElementById("initial-screen");
    const gameScreen = document.getElementById("game-screen");
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
  
    const guessForm = document.getElementById("guess-form");
    const guessInput = document.getElementById("guess-input");
  
    // Clear previous game if any
    if (timer !== null) {
      clearInterval(timer);
    }
    if (formSubmitHandler !== null) {
      guessForm.removeEventListener("submit", formSubmitHandler);
    }

    resetGuessList();
    // Randomize Actors from array, fetch first index and display
    const filteredActors = actorList.filter(
      (actor) => actor.category === selectedCategory || selectedCategory === "All"
    );
    shuffle(filteredActors);
    const actor = filteredActors[0];
    showActorInfo(actor);
  
    // Game state
    const movies = actor.movies;
    let remainingTime = difficulty;
    score = 0; // Reset score when a new game starts
  
    // Game timer
    timer = setInterval(function () {
      remainingTime--;
      updateRemainingTime(remainingTime);
      if (remainingTime === 0) {
        endGame();
        clearInterval(timer);
      }
    }, 1000);
  
    // Guess form
    formSubmitHandler = function (event) {
      event.preventDefault();
      let guess = guessInput.value.trim().toLowerCase().replace(/[^\w\s]/gi, "");
      let correct = false;
      let close = false;
      for (let i = 0; i < movies.length; i++) {
        if (guess === movies[i].toLowerCase().replace(/[^\w\s]/gi, "")) {
          correct = true;
          break;
        } else if (movies[i].toLowerCase().indexOf(guess) !== -1) {
          close = true;
        }
      }
      if (correct) {
        score++;
        updateScore();
        addGuessToList(guess, "correct");
      } else if (close) {
        addGuessToList(guess, "close");
      } else {
        addGuessToList(guess);
      }
      guessInput.value = "";
      if (score === movies.length) {
        endGame();
        clearInterval(timer);
      }
    };
    guessForm.addEventListener("submit", formSubmitHandler);
  
    // End game when all movies are guessed or time runs out
    if (score === movies.length || remainingTime === 0) {
      endGame();
      updateHighScore();
      clearInterval(timer);
    }
  }
  
  const endButton = document.getElementById("end-button");
  endButton.addEventListener("click", function () {
    endGame();
    clearInterval(timer);
  });
  
  // Endgame function
  function endGame() {
    // Show game over alert
    alert(
      "Game Over! Your score is " +
        score +
        ". High Score: " +
        highScore +
        ". The top scorer was " +
        highScoreName +
        " who guessed all the movies of " +
        highScoreActorName +
        "."
    );
  
    // Hide game screen and show initial screen
    const initialScreen = document.getElementById("initial-screen");
    const gameScreen = document.getElementById("game-screen");
    initialScreen.style.display = "block";
    gameScreen.style.display = "none";
  }
  
  // Shuffle function
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  
  // Difficulty Button
  const easyButton = document.getElementById("easy-button");
  easyButton.addEventListener("click", () => setDifficulty(DIFFICULTY.EASY));

  const mediumButton = document.getElementById("medium-button");
  mediumButton.addEventListener("click", () => setDifficulty(DIFFICULTY.MEDIUM));
  
  const hardButton = document.getElementById("hard-button");
  hardButton.addEventListener("click", () => setDifficulty(DIFFICULTY.HARD));
  
  // Start button
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", startGame);
  
  // Category Filter
  const categoryButtons = document.querySelectorAll(".category-button");
  let selectedCategory = "All";
  
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      categoryButtons.forEach((btn) => btn.classList.remove("selected"));
      this.classList.add("selected");
      selectedCategory = this.dataset.category;
    });
  });
  