// STEP 1: Game state — variables that track what's happening
let board = ["", "", "", "", "", "", "", "", ""]
let currentPlayer = "X"
let gameOver = false

// STEP 2: All 8 ways to win
const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
]

// STEP 3: Grab elements from the page
const cells = document.querySelectorAll(".cell")
const statusText = document.getElementById("status")
const resetBtn = document.getElementById("resetBtn")

// STEP 4: Listen for clicks on EVERY cell
cells.forEach(cell => {
  cell.addEventListener("click", handleClick)
})

// STEP 5: What happens when a cell is clicked
function handleClick(e) {
  const index = e.target.dataset.index   // which box? (0-8)

  // Ignore click if game over OR box already filled
  if (gameOver || board[index] !== "") {
    return
  }

  // Fill the box
  board[index] = currentPlayer
  e.target.textContent = currentPlayer

  // Check if this move won the game
  if (checkWinner()) {
    statusText.textContent = `Player ${currentPlayer} wins! 🎉`
    gameOver = true
    return
  }

  // Check for a draw (board full, no winner)
  if (!board.includes("")) {
    statusText.textContent = "It's a draw! 🤝"
    gameOver = true
    return
  }

  // Switch turns
  currentPlayer = currentPlayer === "X" ? "O" : "X"
  statusText.textContent = `Player ${currentPlayer}'s turn`
}

// STEP 6: Check all 8 win patterns
function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern
    if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
      return true
    }
  }
  return false
}

// STEP 7: Reset the game
resetBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""]
  currentPlayer = "X"
  gameOver = false
  statusText.textContent = "Player X's turn"
  cells.forEach(cell => cell.textContent = "")
})