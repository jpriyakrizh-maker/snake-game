import { useEffect, useRef, useState } from "react";
import "./App.css";

const COLS = 24;
const ROWS = 20;
const CELL = 24;

const FRUITS = [
  "apple",
  "banana",
  "pear",
  "pineapple",
  "kiwi",
  "orange",
  "watermelon",
  "cherry",
  "grapes",
  "strawberry",
];

const START = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
  { x: 5, y: 10 },
];

/* =========================================================
   PLACE FRUIT
   RANDOM POSITION
   AWAY FROM BORDER
========================================================= */
function placeFruit(snake, type) {
  const freeCells = [];

  // Keep fruit well inside the board
  for (let y = 4; y < ROWS - 4; y++) {
    for (let x = 4; x < COLS - 4; x++) {
      const occupied = snake.some(
        (part) => part.x === x && part.y === y
      );

      if (!occupied) {
        freeCells.push({ x, y });
      }
    }
  }

  const randomCell =
    freeCells[Math.floor(Math.random() * freeCells.length)];

  return {
    x: randomCell.x,
    y: randomCell.y,
    type,
  };
}

/* =========================================================
   FRUIT SVGs
========================================================= */

function Fruit({ type }) {
  const common = {
    viewBox: "0 0 48 48",
    width: "34",
    height: "34",
    className: "fruit-svg",
  };

  switch (type) {
    case "apple":
      return (
        <svg {...common}>
          <defs>
            <linearGradient
              id="appleGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#ff6262" />
              <stop offset="100%" stopColor="#b71919" />
            </linearGradient>
          </defs>

          <path
            d="M24 14C18 9 8 13 8 24c0 11 7 17 16 17s16-6 16-17c0-11-10-15-16-10Z"
            fill="url(#appleGradient)"
          />

          <path
            d="M24 14c0-5 3-9 8-10"
            fill="none"
            stroke="#70451f"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M27 8c5-3 9-1 11 2-5 2-9 2-11-2Z"
            fill="#39a94b"
          />

          <ellipse
            cx="17"
            cy="21"
            rx="4"
            ry="7"
            fill="#fff"
            opacity=".3"
          />
        </svg>
      );

    case "banana":
      return (
        <svg {...common}>
          <path
            d="M10 14c3 16 12 24 25 22 5-1 8-4 9-8-8 3-14 1-19-4-4-4-6-8-7-13Z"
            fill="#ffd84d"
            stroke="#c99818"
            strokeWidth="2"
          />

          <path
            d="M13 14c2 13 9 19 18 20"
            fill="none"
            stroke="#fff2a8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M10 13l3-3M42 28l2 1"
            stroke="#765019"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    case "pear":
      return (
        <svg {...common}>
          <defs>
            <linearGradient
              id="pearGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#e5ff72" />
              <stop offset="100%" stopColor="#67a82e" />
            </linearGradient>
          </defs>

          <path
            d="M24 13c-2-6 0-10 4-12"
            fill="none"
            stroke="#6b451f"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M27 5c5-3 9-1 10 2-4 2-8 2-10-2Z"
            fill="#3fa34d"
          />

          <path
            d="M24 13c-5 0-8 4-8 8-7 3-9 9-7 15 2 8 8 11 15 11s13-3 15-11c2-6 0-12-7-15 0-4-3-8-8-8Z"
            fill="url(#pearGradient)"
          />

          <ellipse
            cx="18"
            cy="28"
            rx="4"
            ry="7"
            fill="#fff"
            opacity=".25"
          />
        </svg>
      );

    case "pineapple":
      return (
        <svg {...common}>
          <path
            d="M19 13C14 8 15 4 17 1c3 3 5 6 4 10"
            fill="#46a947"
          />

          <path
            d="M25 12C24 6 27 2 31 1c1 5-1 9-5 12"
            fill="#39963e"
          />

          <path
            d="M29 14c3-5 7-6 10-5-1 5-5 7-9 8"
            fill="#4fb24f"
          />

          <path
            d="M14 14h20l4 24c-4 5-10 7-14 7s-10-2-14-7l4-24Z"
            fill="#f5bd2f"
            stroke="#c68c16"
            strokeWidth="2"
          />

          <path
            d="M17 20l16 18M14 27l14 14M29 20L15 36M34 28L22 42"
            stroke="#9c6b12"
            strokeWidth="2"
          />
        </svg>
      );

    case "kiwi":
      return (
        <svg {...common}>
          <ellipse
            cx="24"
            cy="25"
            rx="15"
            ry="17"
            fill="#76502e"
          />

          <ellipse
            cx="24"
            cy="25"
            rx="11"
            ry="13"
            fill="#7ecb45"
          />

          <ellipse
            cx="24"
            cy="25"
            rx="3"
            ry="4"
            fill="#f5e6bd"
          />

          {[
            [24, 9],
            [30, 12],
            [35, 18],
            [36, 25],
            [33, 32],
            [27, 38],
            [20, 39],
            [14, 34],
            [11, 27],
            [12, 19],
            [17, 13],
          ].map(([cx, cy], index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r="1.2"
              fill="#17110b"
            />
          ))}
        </svg>
      );

    case "orange":
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="orangeGradient">
              <stop offset="0%" stopColor="#ffc04a" />
              <stop offset="100%" stopColor="#e66a08" />
            </radialGradient>
          </defs>

          <circle
            cx="24"
            cy="26"
            r="15"
            fill="url(#orangeGradient)"
          />

          <path
            d="M24 11c0-5 3-8 7-9"
            fill="none"
            stroke="#70451f"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M27 5c5-3 8-1 10 2-5 2-8 2-10-2Z"
            fill="#45a64c"
          />

          <ellipse
            cx="18"
            cy="20"
            rx="4"
            ry="6"
            fill="#fff"
            opacity=".28"
          />
        </svg>
      );

    case "watermelon":
      return (
        <svg {...common}>
          <path
            d="M7 16c2 17 11 25 17 25s15-8 17-25H7Z"
            fill="#ef4545"
            stroke="#188c4b"
            strokeWidth="4"
          />

          <path
            d="M9 16h30"
            stroke="#9bdd55"
            strokeWidth="3"
          />

          {[
            [15, 23],
            [24, 29],
            [33, 23],
            [20, 35],
            [29, 35],
          ].map(([cx, cy], index) => (
            <ellipse
              key={index}
              cx={cx}
              cy={cy}
              rx="1.5"
              ry="3"
              fill="#231512"
            />
          ))}
        </svg>
      );

    case "cherry":
      return (
        <svg {...common}>
          <path
            d="M24 14C20 7 15 5 11 4M24 14c5-7 10-9 14-10"
            fill="none"
            stroke="#3d6f2c"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <circle
            cx="15"
            cy="28"
            r="9"
            fill="#d82d3d"
          />

          <circle
            cx="33"
            cy="28"
            r="9"
            fill="#b91f32"
          />

          <circle
            cx="12"
            cy="25"
            r="2.5"
            fill="#fff"
            opacity=".4"
          />

          <circle
            cx="30"
            cy="25"
            r="2.5"
            fill="#fff"
            opacity=".3"
          />
        </svg>
      );

    case "grapes":
      return (
        <svg {...common}>
          <path
            d="M24 15c0-6 3-10 8-12"
            fill="none"
            stroke="#6a4522"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M27 6c5-4 9-2 11 1-4 3-8 3-11-1Z"
            fill="#3e9b47"
          />

          {[
            [18, 20],
            [26, 20],
            [34, 20],
            [14, 27],
            [22, 27],
            [30, 27],
            [38, 27],
            [18, 34],
            [26, 34],
            [34, 34],
            [26, 41],
          ].map(([cx, cy], index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r="5"
              fill={
                index % 2
                  ? "#7b3fc6"
                  : "#6630a8"
              }
            />
          ))}
        </svg>
      );

    case "strawberry":
      return (
        <svg {...common}>
          <path
            d="M10 16c4-6 24-6 28 0 0 12-7 24-14 28-7-4-14-16-14-28Z"
            fill="#ef3e4d"
          />

          <path
            d="M24 16c-6-8-12-7-15-4 3 5 7 7 12 6"
            fill="#42a84d"
          />

          <path
            d="M24 16c6-8 12-7 15-4-3 5-7 7-12 6"
            fill="#318e43"
          />

          {[
            [17, 22],
            [25, 21],
            [32, 23],
            [20, 29],
            [28, 29],
            [24, 36],
          ].map(([cx, cy], index) => (
            <ellipse
              key={index}
              cx={cx}
              cy={cy}
              rx="1.2"
              ry="2"
              fill="#ffe7a5"
            />
          ))}
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   SNAKE PATH
========================================================= */

function smoothSnakePath(points) {
  if (!points.length) return "";

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const current = points[i];

    path += ` L ${current.x} ${current.y}`;
  }

  return path;
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [snake, setSnake] = useState(START);

  // First fruit = Apple
  const [fruit, setFruit] = useState(() =>
    placeFruit(START, FRUITS[0])
  );

  // Score starts from 0
  const [score, setScore] = useState(0);

  const [status, setStatus] = useState("playing");

  const snakeRef = useRef(snake);
  const fruitRef = useRef(fruit);
  const scoreRef = useRef(score);

  // Snake initially moves RIGHT
  const directionRef = useRef({
    x: 1,
    y: 0,
  });

  snakeRef.current = snake;
  fruitRef.current = fruit;
  scoreRef.current = score;

  /* =========================================================
     CHANGE DIRECTION
========================================================= */

  function moveSnake(direction) {
    const current = directionRef.current;

    // Prevent directly turning backwards
    if (
      direction.x === -current.x &&
      direction.y === -current.y
    ) {
      return;
    }

    directionRef.current = direction;
  }

  /* =========================================================
     RESTART
========================================================= */

  function restart() {
    setSnake(START);

    // New random Apple position
    setFruit(placeFruit(START, FRUITS[0]));

    setScore(0);

    setStatus("playing");

    // Restart direction = RIGHT
    directionRef.current = {
      x: 1,
      y: 0,
    };
  }

  /* =========================================================
     KEYBOARD ARROWS
========================================================= */

  useEffect(() => {
    function handleKeyDown(event) {
      const directions = {
        ArrowUp: {
          x: 0,
          y: -1,
        },

        ArrowDown: {
          x: 0,
          y: 1,
        },

        ArrowLeft: {
          x: -1,
          y: 0,
        },

        ArrowRight: {
          x: 1,
          y: 0,
        },
      };

      const direction = directions[event.key];

      if (direction) {
        event.preventDefault();
        moveSnake(direction);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* =========================================================
     GAME LOOP
========================================================= */

  useEffect(() => {
    if (status !== "playing") {
      return undefined;
    }

    const timer = window.setInterval(() => {
      const currentSnake = snakeRef.current;
      const currentFruit = fruitRef.current;

      const direction = directionRef.current;

      const head = {
        x: currentSnake[0].x + direction.x,
        y: currentSnake[0].y + direction.y,
      };

      /* =====================================================
         BORDER HIT
      ===================================================== */

      if (
        head.x < 0 ||
        head.x >= COLS ||
        head.y < 0 ||
        head.y >= ROWS
      ) {
        setStatus("over");
        return;
      }

      /* =====================================================
         FRUIT CATCH
      ===================================================== */

      const eating =
        head.x === currentFruit.x &&
        head.y === currentFruit.y;

      /* =====================================================
         BODY COLLISION
      ===================================================== */

      const collisionBody = eating
        ? currentSnake
        : currentSnake.slice(0, -1);

      const hitBody = collisionBody.some(
        (part) =>
          part.x === head.x &&
          part.y === head.y
      );

      if (hitBody) {
        setStatus("over");
        return;
      }

      /* =====================================================
         MOVE SNAKE
      ===================================================== */

      const nextSnake = [
        head,
        ...currentSnake,
      ];

      if (!eating) {
        nextSnake.pop();
      }

      setSnake(nextSnake);

      /* =====================================================
         EAT FRUIT
      ===================================================== */

      if (eating) {
        const nextScore =
          scoreRef.current + 1;

        // 10 fruits = WIN
        if (nextScore === 10) {
          setScore(10);
          setStatus("won");
          return;
        }

        setScore(nextScore);

        // NEXT FRUIT = NEW RANDOM POSITION
        setFruit(
          placeFruit(
            nextSnake,
            FRUITS[nextScore]
          )
        );

        // Direction remains same
      }
    }, 125);

    return () => {
      window.clearInterval(timer);
    };
  }, [status]);

  /* =========================================================
     SNAKE POINTS
========================================================= */

  const points = snake.map((part) => ({
    x: part.x * CELL + 12,
    y: part.y * CELL + 12,
  }));

  const path = smoothSnakePath(points);

  const head = points[0];

  const neck = points[1] || {
    x: head.x - 1,
    y: head.y,
  };

  const dx = Math.sign(
    head.x - neck.x
  );

  const dy = Math.sign(
    head.y - neck.y
  );

  const headAngle =
    (Math.atan2(dy, dx) * 180) / Math.PI;

  /* =========================================================
     UI
========================================================= */

  return (
    <main className="game-page">
      <section className="game-card">

        {/* HEADING */}

        <div className="game-heading">
          <svg
            className="logo-snake"
            viewBox="0 0 48 40"
            aria-hidden="true"
          >
            <path
              d="M5 28C5 17 13 11 23 13c9 2 12 9 8 14-4 5-12 4-14-1-2-5 4-9 9-6"
              fill="none"
              stroke="#20db43"
              strokeWidth="7"
              strokeLinecap="round"
            />

            <circle
              cx="34"
              cy="16"
              r="7"
              fill="#20db43"
            />

            <circle
              cx="36"
              cy="14"
              r="1.5"
              fill="#090a09"
            />
          </svg>

          <h1>SNAKE GAME</h1>
        </div>

        {/* BOARD */}

        <div className="board-frame">
          <svg
            className="board"
            viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>

              {/* Snake gradient */}

              <linearGradient
                id="snakeLine"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#23ef4a"
                />

                <stop
                  offset="50%"
                  stopColor="#0fbd3a"
                />

                <stop
                  offset="100%"
                  stopColor="#087b2d"
                />
              </linearGradient>

              {/* Snake glow */}

              <filter id="gameGlow">
                <feGaussianBlur
                  stdDeviation="2.5"
                  result="blur"
                />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

            </defs>

            {/* BOARD BACKGROUND */}

            <rect
              width={COLS * CELL}
              height={ROWS * CELL}
              fill="#101411"
            />

            {/* GRID */}

            {Array.from({
              length: COLS + 1,
            }).map((_, index) => (
              <line
                key={`v-${index}`}
                x1={index * CELL}
                y1="0"
                x2={index * CELL}
                y2={ROWS * CELL}
                stroke="#1c231e"
                strokeWidth="1"
              />
            ))}

            {Array.from({
              length: ROWS + 1,
            }).map((_, index) => (
              <line
                key={`h-${index}`}
                x1="0"
                y1={index * CELL}
                x2={COLS * CELL}
                y2={index * CELL}
                stroke="#1c231e"
                strokeWidth="1"
              />
            ))}

            {/* =================================================
                RANDOM FRUIT
            ================================================= */}

            <g
               transform={`translate(
    ${fruit.x * CELL + CELL / 2}
    ${fruit.y * CELL + CELL / 2}
  )`}
>
  <g transform="translate(-17 -17)">
    <Fruit type={fruit.type} />
  </g>
            </g>

            {/* =================================================
                SNAKE
            ================================================= */}

            <g filter="url(#gameGlow)">

              {/* Outer body */}

              <path
                d={path}
                fill="none"
                stroke="#06240d"
                strokeWidth="19"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Main body */}

              <path
                d={path}
                fill="none"
                stroke="#20db43"
                strokeWidth="15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Highlight */}

              <path
                d={path}
                fill="none"
                stroke="#7cff91"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
              />

              {/* HEAD */}

              {head && (
                <g
                  transform={`
                    translate(${head.x} ${head.y})
                    rotate(${headAngle})
                  `}
                >
                  <ellipse
                    cx="4"
                    cy="0"
                    rx="10"
                    ry="9"
                    fill="#18d844"
                  />

                  <ellipse
                    cx="7"
                    cy="-4"
                    rx="2.2"
                    ry="2.2"
                    fill="#ffffff"
                  />

                  <circle
                    cx="7.5"
                    cy="-4"
                    r="1"
                    fill="#071007"
                  />

                  <path
                    d="M12 2h5"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>
              )}

            </g>
          </svg>

          {/* GAME RESULT */}

          {status !== "playing" && (
            <div className="game-overlay">
              <div>
                <h2>
                  {status === "won"
                    ? "YOU WIN!"
                    : "YOU OUT!"}
                </h2>

                <p>
                  {status === "won"
                    ? "Score reached 10"
                    : "Snake hit the border"}
                </p>

                <button
                  type="button"
                  onClick={restart}
                >
                  Restart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CONTROLS */}

        <div className="game-controls">

          <strong>
            Score: <span>{score}</span>
          </strong>

          <div className="arrow-controls">

            <button
              type="button"
              onClick={() =>
                moveSnake({
                  x: 0,
                  y: -1,
                })
              }
              aria-label="Move up"
            >
              ↑
            </button>

            <div>

              <button
                type="button"
                onClick={() =>
                  moveSnake({
                    x: -1,
                    y: 0,
                  })
                }
                aria-label="Move left"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() =>
                  moveSnake({
                    x: 0,
                    y: 1,
                  })
                }
                aria-label="Move down"
              >
                ↓
              </button>

              <button
                type="button"
                onClick={() =>
                  moveSnake({
                    x: 1,
                    y: 0,
                  })
                }
                aria-label="Move right"
              >
                →
              </button>

            </div>
          </div>

          <button
            type="button"
            onClick={restart}
          >
            Restart
          </button>

        </div>
      </section>
    </main>
  );
}