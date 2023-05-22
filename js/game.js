// Define the showActorInfo function
function showActorInfo(actor) {
  var actorName = document.getElementById("actor-name");
  var actorImage = document.getElementById("actor-image");
  actorName.textContent = actor.name;
  actorImage.src = actor.image;
}

// Define the startGame function
function startGame() {
  var guessForm = document.getElementById("guess-form");
  var guessInput = document.getElementById("guess-input");
  var guessList = document.getElementById("guess-list");
  var scoreValue = document.getElementById("score-value");
  var timeValue = document.getElementById("time-value");
  
  // Shuffle the actor list
  shuffle(actorList);

  // Choose a random actor from the shuffled list
  var actor = actorList[0];
  
  // Show the actor's name and image
  showActorInfo(actor);
  
  // Set up the game state
  var movies = actor.movies;
  var remainingTime = 90;
  var score = 0;
  
  // Set up the timer
  var timer = setInterval(function() {
    remainingTime--;
    timeValue.textContent = remainingTime;
    if (remainingTime === 0) {
      endGame(score);
      clearInterval(timer);
    }
  }, 1000);
  
  // Set up the guess form
guessForm.addEventListener("submit", function(event) {
  event.preventDefault();
  var guess = guessInput.value.trim().toLowerCase().replace(/[^\w\s]/gi, ''); // convert guess to lowercase and remove non-alphanumeric characters
  var correct = false; // add a flag to keep track of correct guess
  var close = false; // add a flag to keep track of close guess
  for (var i = 0; i < movies.length; i++) {
    if (guess === movies[i].toLowerCase().replace(/[^\w\s]/gi, '')) { // convert movie name to lowercase and remove non-alphanumeric characters
      correct = true;
      break;
    } else if (movies[i].toLowerCase().indexOf(guess) !== -1) { // if guess is a substring of the movie name
      close = true;
    }
  }
  if (correct) {
    score++;
    scoreValue.textContent = score;
    guessList.innerHTML += "<li class='correct'>" + guess + "</li>"; // add the 'correct' class to the <li> element for correct guesses
  } else if (close) {
    guessList.innerHTML += "<li class='close'>" + guess + "</li>"; // add the 'close' class to the <li> element for close guesses
  } else {
    guessList.innerHTML += "<li>" + guess + "</li>";
  }
  guessInput.value = "";
  if (score === 5) {
    endGame(score);
    clearInterval(timer);
  }
});
}

// Define the endGame function
function endGame(score) {
  alert("Game over! Your score is " + score + ".");
}

// Shuffle function
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
  
// Set up the start button event listener
var startButton = document.getElementById("start-button");
startButton.addEventListener("click", startGame);
