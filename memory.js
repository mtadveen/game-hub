// STEP 1: The pairs (8 pairs = 16 cards)
const symbols = ["🍕","🍕","🚀","🚀","🐱","🐱","🎈","🎈","🌟","🌟","🍩","🍩","🎸","🎸","🌈","🌈"]

// STEP 2: Shuffle them randomly
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5)
}

let cardSymbols = shuffle(symbols)

// STEP 3: Game state
let firstCard = null
let secondCard = null
let lockBoard = false   // prevents clicking during the "checking" pause
let matchedCount = 0

const board = document.getElementById("board")
const statusText = document.getElementById("status")
const resetBtn = document.getElementById("resetBtn")

// STEP 4: Build the 16 cards using JavaScript
function createBoard() {
  board.innerHTML = ""
  cardSymbols.forEach((symbol, index) => {
    const card = document.createElement("div")
    card.classList.add("memory-card")
    card.dataset.symbol = symbol
    card.dataset.index = index
    card.addEventListener("click", handleCardClick)
    board.appendChild(card)
  })
}

createBoard()

// STEP 5: What happens on click
function handleCardClick(e) {
  const card = e.target

  // Ignore clicks while checking a pair, or on already flipped/matched cards
  if (lockBoard) return
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return

  // Reveal the symbol
  card.textContent = card.dataset.symbol
  card.classList.add("flipped")

  if (!firstCard) {
    // This is the FIRST card clicked
    firstCard = card
  } else {
    // This is the SECOND card clicked
    secondCard = card
    lockBoard = true   // pause clicking while we check

    checkForMatch()
  }
}

// STEP 6: Compare the two flipped cards
function checkForMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol

  if (isMatch) {
    firstCard.classList.add("matched")
    secondCard.classList.add("matched")
    matchedCount++

    resetTurn()

    if (matchedCount === symbols.length / 2) {
      statusText.textContent = "You found them all! 🎉"
    }
  } else {
    // Wait a moment so the player can SEE both cards before flipping back
    setTimeout(() => {
      firstCard.textContent = ""
      secondCard.textContent = ""
      firstCard.classList.remove("flipped")
      secondCard.classList.remove("flipped")
      resetTurn()
    }, 800)
  }
}

// STEP 7: Reset for the next turn
function resetTurn() {
  firstCard = null
  secondCard = null
  lockBoard = false
}

// STEP 8: Play Again button
resetBtn.addEventListener("click", () => {
  cardSymbols = shuffle(symbols)
  matchedCount = 0
  statusText.textContent = "Find all the pairs!"
  createBoard()
})