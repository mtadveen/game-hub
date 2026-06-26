const GRID_SIZE = 20

let snake = [{ x: 10, y: 10 }]
let direction = { x: 1, y: 0 }
let food = { x: 5, y: 5 }
let score = 0
let gameLoop = null
let gameActive = false

const boardElement = document.getElementById("board")
const statusText = document.getElementById("status")
const startBtn = document.getElementById("startBtn")

// STEP 1: Build the empty 20x20 grid of cells (once)
function createBoard() {
  boardElement.innerHTML = ""
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const cell = document.createElement("div")
      cell.classList.add("cell")
      cell.dataset.x = x
      cell.dataset.y = y
      boardElement.appendChild(cell)
    }
  }
}

// STEP 2: Redraw which cells are "snake" or "food" every frame
function render() {
  // Clear all previous snake/food markings
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("snake")
    cell.classList.remove("food")
  })

  // Mark current snake positions
  snake.forEach(segment => {
    const cell = document.querySelector(`[data-x="${segment.x}"][data-y="${segment.y}"]`)
    if (cell) cell.classList.add("snake")
  })

  // Mark food position
  const foodCell = document.querySelector(`[data-x="${food.x}"][data-y="${food.y}"]`)
  if (foodCell) foodCell.classList.add("food")
}

createBoard()
render()

function moveSnake() {
  // Calculate new head position based on current direction
  const head = snake[0]
  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y
  }

  // Add new head to the FRONT of the snake array
  snake.unshift(newHead)

  // Check if snake ate the food
  if (newHead.x === food.x && newHead.y === food.y) {
    score += 10
    statusText.textContent = `Score: ${score}`
    placeFood()   // food eaten, place a new one
    // NOTE: we do NOT remove the tail — this makes snake grow by 1
  } else {
    snake.pop()   // remove the LAST segment (tail) — keeps length the same
  }
}

function placeFood() {
  let newFood
  let isOnSnake

  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
  } while (isOnSnake)

  food = newFood
}

function checkCollision() {
  const head = snake[0]

  // Hit a wall?
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true
  }

  // Hit itself? (check head against every OTHER segment, skip index 0)
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true
    }
  }

  return false
}

function gameTick() {
  moveSnake()

  if (checkCollision()) {
    clearInterval(gameLoop)
    gameActive = false
    statusText.textContent = `Game Over! Score: ${score}`
    return
  }

  render()
}

document.addEventListener("keydown", (e) => {
  if (!gameActive) return

  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 }
  else if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 }
  else if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 }
  else if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 }
})

startBtn.addEventListener("click", () => {
  snake = [{ x: 10, y: 10 }]
  direction = { x: 1, y: 0 }
  score = 0
  statusText.textContent = "Score: 0"
  placeFood()
  render()

  gameActive = true
  if (gameLoop) clearInterval(gameLoop)   // stop any previous loop first
  gameLoop = setInterval(gameTick, 1000)
})

function gameTick() {
  moveSnake()

  if (checkCollision()) {
    clearInterval(gameLoop)
    gameActive = false
    statusText.textContent = `Game Over! Score: ${score}`
    return
  }

  render()
}

document.addEventListener("keydown", (e) => {
  if (!gameActive) return

  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 }
  else if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 }
  else if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 }
  else if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 }
})

startBtn.addEventListener("click", () => {
  snake = [{ x: 10, y: 10 }]
  direction = { x: 1, y: 0 }
  score = 0
  statusText.textContent = "Score: 0"
  placeFood()
  render()

  gameActive = true
  if (gameLoop) clearInterval(gameLoop)   // stop any previous loop first
  gameLoop = setInterval(gameTick, 150)
})