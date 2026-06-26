// STEP 1: The board — 4x4 grid of numbers (0 = empty)
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]

const boardElement = document.getElementById("board")
const statusText = document.getElementById("status")
const resetBtn = document.getElementById("resetBtn")

// STEP 2: Draw the board on screen based on the array
function renderBoard() {
  boardElement.innerHTML = ""

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const tile = document.createElement("div")
      tile.classList.add("tile")
      const value = board[row][col]

      if (value !== 0) {
        tile.textContent = value
        tile.dataset.value = value
      }

      boardElement.appendChild(tile)
    }
  }
}

// STEP 3: Add a random tile (2 or 4) into a random EMPTY spot
function addRandomTile() {
  const emptySpots = []

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        emptySpots.push({ row, col })
      }
    }
  }

  if (emptySpots.length === 0) return   // board is full

  const randomSpot = emptySpots[Math.floor(Math.random() * emptySpots.length)]
  board[randomSpot.row][randomSpot.col] = Math.random() < 0.9 ? 2 : 4

  renderBoard()
}

// STEP 4: Start a new game
function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
  addRandomTile()
  addRandomTile()
  statusText.textContent = "Use arrow keys to play"
}

// ───────────────────────────────────────
// PART 2: MOVEMENT LOGIC
// ───────────────────────────────────────

// Slide ONE row left: remove zeros, merge matches, pad with zeros
function slideRowLeft(row) {
  // STEP 1: Remove all zeros
  let newRow = row.filter(value => value !== 0)

  // STEP 2: Merge matching neighbors
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] = newRow[i] * 2     // double it
      newRow[i + 1] = 0             // mark the merged one as empty
    }
  }

  // STEP 3: Remove the new zeros created by merging
  newRow = newRow.filter(value => value !== 0)

  // STEP 4: Pad back to length 4 with zeros at the end
  while (newRow.length < 4) {
    newRow.push(0)
  }

  return newRow
}

// Reverse each row = sliding RIGHT becomes sliding LEFT
function reverseRow(row) {
  return row.slice().reverse()
}

// Flip rows/columns = sliding UP/DOWN becomes sliding LEFT/RIGHT
function transpose(matrix) {
  let newMatrix = []
  for (let col = 0; col < 4; col++) {
    let newRow = []
    for (let row = 0; row < 4; row++) {
      newRow.push(matrix[row][col])
    }
    newMatrix.push(newRow)
  }
  return newMatrix
}

function moveLeft() {
  board = board.map(row => slideRowLeft(row))
}

function moveRight() {
  board = board.map(row => reverseRow(slideRowLeft(reverseRow(row))))
}

function moveUp() {
  board = transpose(board)
  board = board.map(row => slideRowLeft(row))
  board = transpose(board)
}

function moveDown() {
  board = transpose(board)
  board = board.map(row => reverseRow(slideRowLeft(reverseRow(row))))
  board = transpose(board)
}

function checkWin() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 2048) {
        return true
      }
    }
  }
  return false
}

function checkGameOver() {
  // If there's any empty cell, game is definitely NOT over
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        return false
      }
    }
  }

  // Board is full — but maybe a move would still merge something
  // Test all 4 directions on a COPY of the board, see if anything changes
  const original = JSON.stringify(board)

  const testBoard = JSON.parse(JSON.stringify(board))   // deep copy
  const savedBoard = board   // temporarily save real board

  board = JSON.parse(JSON.stringify(testBoard))
  moveLeft()
  const afterLeft = JSON.stringify(board)

  board = JSON.parse(JSON.stringify(testBoard))
  moveRight()
  const afterRight = JSON.stringify(board)

  board = JSON.parse(JSON.stringify(testBoard))
  moveUp()
  const afterUp = JSON.stringify(board)

  board = JSON.parse(JSON.stringify(testBoard))
  moveDown()
  const afterDown = JSON.stringify(board)

  board = savedBoard   // restore the real board, untouched

  // If ANY direction would change the board, game is NOT over
  if (original !== afterLeft || original !== afterRight || original !== afterUp || original !== afterDown) {
    return false
  }

  return true   // board full AND no move changes anything = game over
}

// ───────────────────────────────────────
// KEYBOARD CONTROLS
// ───────────────────────────────────────

document.addEventListener("keydown", handleKeyPress)

function handleKeyPress(e) {
  const boardBefore = JSON.stringify(board)

  if (e.key === "ArrowLeft") moveLeft()
  else if (e.key === "ArrowRight") moveRight()
  else if (e.key === "ArrowUp") moveUp()
  else if (e.key === "ArrowDown") moveDown()
  else return

  e.preventDefault()

  const boardAfter = JSON.stringify(board)

  if (boardBefore !== boardAfter) {
    addRandomTile()

    if (checkWin()) {
      statusText.textContent = "You reached 2048! 🎉"
      document.removeEventListener("keydown", handleKeyPress)
    } else if (checkGameOver()) {
      statusText.textContent = "Game Over! No more moves 😢"
      document.removeEventListener("keydown", handleKeyPress)
    }
  } else {
    renderBoard()
  }
}

// ───────────────────────────────────────
// START THE GAME
// ───────────────────────────────────────

startGame()
resetBtn.addEventListener("click", startGame)