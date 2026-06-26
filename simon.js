// STEP 1: Game state
let gameSequence = []
let playerSequence = []
let round = 0
let isPlayingSequence = false   // true while computer is "showing" the pattern
let gameActive = false

const colors = ["red", "blue", "green", "yellow"]
const buttons = document.querySelectorAll(".simon-btn")
const statusText = document.getElementById("status")
const roundText = document.getElementById("round")
const startBtn = document.getElementById("startBtn")

// STEP 2: Light up a button briefly
function flashButton(color) {
  const btn = document.getElementById(color)
  btn.classList.add("active")
  setTimeout(() => {
    btn.classList.remove("active")
  }, 400)
}

// STEP 3: Play the FULL sequence so far, one at a time
function playSequence() {
  isPlayingSequence = true
  statusText.textContent = "Watch closely..."

  let delay = 0
  gameSequence.forEach((color) => {
    setTimeout(() => {
      flashButton(color)
    }, delay)
    delay += 600   // each flash starts 600ms after the previous one
  })

  // After the whole sequence finishes playing, let the player click
  setTimeout(() => {
    isPlayingSequence = false
    statusText.textContent = "Your turn!"
  }, delay)
}

// STEP 4: Start a new round
function nextRound() {
  playerSequence = []
  round++
  roundText.textContent = `Round: ${round}`

  // Add ONE random color to the sequence
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  gameSequence.push(randomColor)

  playSequence()
}

// STEP 5: Handle player clicking a button
function handleButtonClick(e) {
  if (isPlayingSequence || !gameActive) return   // ignore clicks during playback

  const clickedColor = e.target.dataset.color
  flashButton(clickedColor)
  playerSequence.push(clickedColor)

  const currentStep = playerSequence.length - 1

  // Check if this click matches the computer's sequence at this position
  if (playerSequence[currentStep] !== gameSequence[currentStep]) {
    gameOver()
    return
  }

  // Did they complete the full sequence correctly?
  if (playerSequence.length === gameSequence.length) {
    statusText.textContent = "Correct! Next round..."
    setTimeout(nextRound, 1000)
  }
}

// STEP 6: Game over
function gameOver() {
  gameActive = false
  statusText.textContent = `Game Over! You reached round ${round} 😢`
}

// STEP 7: Attach click listeners
buttons.forEach(btn => {
  btn.addEventListener("click", handleButtonClick)
})

// STEP 8: Start button
startBtn.addEventListener("click", () => {
  gameSequence = []
  playerSequence = []
  round = 0
  gameActive = true
  nextRound()
})