# 🎮 Game Hub

A collection of 6 classic browser games, built completely from scratch using **plain HTML, CSS, and JavaScript** — no frameworks, no libraries, no game engines.

### 🔗 Live Demo
**[game-hub-firstver.vercel.app](https://game-hub-firstver.vercel.app)**

---

## 🕹️ Games Included

| Game | Concepts Used |
|---|---|
| ❌⭕ Tic Tac Toe | Arrays, conditionals, win-pattern detection |
| 🃏 Memory Match | DOM manipulation, `setTimeout`, array shuffling |
| 🔴🟢 Simon Says | Sequence generation, timed animations |
| 🔢 2048 | 2D arrays, matrix transposition, keyboard events |
| 🐍 Snake | Game loop (`setInterval`), collision detection |
| 🧱 Tetris | 2D grid logic, piece rotation, line-clear detection |

---

## 🛠️ Built With

- **HTML5** — semantic structure across all 6 games
- **CSS3** — Flexbox, CSS Grid, custom properties, transitions/animations
- **Vanilla JavaScript (ES6)** — no frameworks or external libraries used

---

## 📂 Project Structure

```
game-hub/
│
├── index.html          # Game hub homepage
├── style.css           # Shared homepage styling
│
├── tictactoe.html / .js
├── memory.html / .js
├── simon.html / .js
├── game2048.html / .js
├── snake.html / .js
└── tetris.html / .js
```

Each game is self-contained with its own HTML and JavaScript file, sharing a common pastel design system defined in `style.css`.

---

## 💡 What I Learned

This project was built progressively, with each game introducing a new core JavaScript concept:

- **Tic Tac Toe** → DOM events, array-based state, conditional logic
- **Memory Match** → dynamically generating DOM elements, async timing with `setTimeout`
- **Simon Says** → sequence-based game logic, chained timeouts
- **2048** → 2D array manipulation, matrix transposition for reusable movement logic
- **Snake** → the game loop pattern (`setInterval`), real-time collision detection
- **Tetris** → combining 2D grids, rotation algorithms, and line-clearing logic

---

## 🚀 Running Locally

No build tools or installations required:

```bash
git clone https://github.com/mtadveen/game-hub.git
cd game-hub
```

Then just open `index.html` in your browser.

---

## 👩‍💻 Author

**Munazza Tadveen**
[LinkedIn](https://linkedin.com/in/munazza-tadveen) · [Portfolio](https://munazzaportfolio.vercel.app)
