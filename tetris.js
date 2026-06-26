const COLS = 10
const ROWS = 20

const SHAPES = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  L: [[1,0],[1,0],[1,1]],
  J: [[0,1],[0,1],[1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]]
}

const SHAPE_NAMES = Object.keys(SHAPES)   // ["I","O","T","L","J","S","Z"]

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
let currentPiece = null
let score = 0
let gameLoop = null
let gameActive = false

const boardElement = document.getElementById("board")
const statusText = document.getElementById("status")
const startBtn = document.getElementById("startBtn")

// ───────────────────────────────────────
// PART 1: BOARD SETUP & RENDERING
// ───────────────────────────────────────

// Build the empty grid of cells (once)
function createBoard() {
  boardElement.innerHTML = ""
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = document.createElement("div")
      cell.classList.add("cell")
      cell.dataset.x = x
      cell.dataset.y = y
      boardElement.appendChild(cell)
    }
  }
}

// Create a new random piece at the top
function spawnPiece() {
  const randomName = SHAPE_NAMES[Math.floor(Math.random() * SHAPE_NAMES.length)]
  currentPiece = {
    shape: SHAPES[randomName],
    name: randomName,
    x: Math.floor(COLS / 2) - 1,   // roughly centered
    y: 0
  }
}

// Draw everything — locked board PLUS the falling piece
function render() {
  // Clear all cells back to empty first
  document.querySelectorAll(".cell").forEach(cell => {
    cell.className = "cell"   // resets ALL classes back to just "cell"
  })

  // Draw the locked board
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x] !== 0) {
        const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
        if (cell) cell.classList.add(`filled-${board[y][x]}`)
      }
    }
  }

  // Draw the current falling piece on top
  if (currentPiece) {
    currentPiece.shape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 1) {
          const boardX = currentPiece.x + colIndex
          const boardY = currentPiece.y + rowIndex
          const cell = document.querySelector(`[data-x="${boardX}"][data-y="${boardY}"]`)
          if (cell) cell.classList.add(`filled-${currentPiece.name}`)
        }
      })
    })
  }
}

// ───────────────────────────────────────
// PART 2: MOVEMENT, ROTATION, LOCKING
// ───────────────────────────────────────

// Check if a piece (at a given offset) would be in a legal position
function isValidPosition(piece, offsetX, offsetY) {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] === 1) {
        const newX = piece.x + col + offsetX
        const newY = piece.y + row + offsetY

        // Off the left/right edge?
        if (newX < 0 || newX >= COLS) return false

        // Off the bottom?
        if (newY >= ROWS) return false

        // Colliding with an already-locked block? (ignore above the board, newY < 0)
        if (newY >= 0 && board[newY][newX] !== 0) return false
      }
    }
  }
  return true
}

function movePiece(offsetX, offsetY) {
  if (isValidPosition(currentPiece, offsetX, offsetY)) {
    currentPiece.x += offsetX
    currentPiece.y += offsetY
    return true
  }
  return false
}

function rotatePiece() {
  const oldShape = currentPiece.shape

  // Transpose then reverse each row = rotate 90° clockwise
  const rotated = oldShape[0].map((_, colIndex) =>
    oldShape.map(row => row[colIndex]).reverse()
  )

  const rotatedPiece = { ...currentPiece, shape: rotated }

  if (isValidPosition(rotatedPiece, 0, 0)) {
    currentPiece.shape = rotated
  }
  // If rotating would be invalid (hits wall/block), simply do nothing
}

function lockPiece() {
  currentPiece.shape.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value === 1) {
        const boardX = currentPiece.x + colIndex
        const boardY = currentPiece.y + rowIndex
        board[boardY][boardX] = currentPiece.name   // permanently store it
      }
    })
  })

  clearFullLines()
  spawnPiece()

  // If the new piece immediately overlaps something, game over
  if (!isValidPosition(currentPiece, 0, 0)) {
    gameOver()
  }
}

function clearFullLines() {
  let linesCleared = 0

  for (let y = ROWS - 1; y >= 0; y--) {
    const isFull = board[y].every(cell => cell !== 0)

    if (isFull) {
      board.splice(y, 1)                   // remove this full row
      board.unshift(Array(COLS).fill(0))   // add an empty row at the TOP
      linesCleared++
      y++   // re-check this same row index, since everything shifted down
    }
  }

  if (linesCleared > 0) {
    score += linesCleared * 100
    statusText.textContent = `Score: ${score}`
  }
}

// ───────────────────────────────────────
// GAME LOOP + CONTROLS
// ───────────────────────────────────────

function gameTick() {
  const moved = movePiece(0, 1)   // try moving down by 1

  if (!moved) {
    lockPiece()
  }

  render()
}

function gameOver() {
  clearInterval(gameLoop)
  gameActive = false
  statusText.textContent = `Game Over! Score: ${score}`
}

document.addEventListener("keydown", (e) => {
  if (!gameActive) return

  if (e.key === "ArrowLeft") movePiece(-1, 0)
  else if (e.key === "ArrowRight") movePiece(1, 0)
  else if (e.key === "ArrowDown") movePiece(0, 1)
  else if (e.key === "ArrowUp") rotatePiece()
  else return

  e.preventDefault()
  render()
})

startBtn.addEventListener("click", () => {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  score = 0
  statusText.textContent = "Score: 0"
  spawnPiece()
  render()

  gameActive = true
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(gameTick, 500)
})

// ───────────────────────────────────────
// INITIAL DISPLAY (before Start is clicked)
// ───────────────────────────────────────

createBoard()
spawnPiece()
render()