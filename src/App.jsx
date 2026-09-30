import { useEffect, useRef, useState } from 'react';
import './App.css';

const COLS = 24;
const ROWS = 20;
const CELL = 24;
const FRUITS = ['apple', 'banana', 'pear', 'pineapple', 'kiwi', 'orange', 'watermelon', 'cherry', 'grapes', 'strawberry'];
const START = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }, { x: 5, y: 10 }];

function placeFruit(snake, type = 'apple') {
  const open = [];
  for (let y = 1; y < ROWS - 1; y += 1) {
    for (let x = 1; x < COLS - 1; x += 1) {
      if (!snake.some((part) => part.x === x && part.y === y)) open.push({ x, y });
    }
  }
  return { ...open[Math.floor(Math.random() * open.length)], type };
}

function findNextStep(snake, target) {
  const head = snake[0];
  const body = new Set(snake.slice(0, -1).map(({ x, y }) => `${x},${y}`));
  const directions = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
  const queue = [{ x: head.x, y: head.y, first: null }];
  const seen = new Set([`${head.x},${head.y}`]);

  for (let i = 0; i < queue.length; i += 1) {
    const current = queue[i];
    if (current.x === target.x && current.y === target.y) return current.first;
    for (const direction of directions) {
      const x = current.x + direction.x;
      const y = current.y + direction.y;
      const key = `${x},${y}`;
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS || seen.has(key) || (body.has(key) && !(x === target.x && y === target.y))) continue;
      seen.add(key);
      queue.push({ x, y, first: current.first || direction });
    }
  }

  return directions
    .map((direction) => ({ direction, x: head.x + direction.x, y: head.y + direction.y }))
    .filter(({ x, y }) => x >= 0 && x < COLS && y >= 0 && y < ROWS && !body.has(`${x},${y}`))
    .sort((a, b) => (Math.abs(a.x - target.x) + Math.abs(a.y - target.y)) - (Math.abs(b.x - target.x) + Math.abs(b.y - target.y)))[0]?.direction || { x: 0, y: 1 };
}

function Fruit({ type }) {
  if (type === 'orange') return <g aria-label="Orange">
    <path d="M15 9c1-4 5-5 8-3-1 4-4 5-8 3Z" fill="#48dc70" />
    <circle cx="15" cy="19" r="11" fill="#ff962f" stroke="#ffd078" strokeWidth="1.4" />
    <path d="M9 14c2-3 5-4 7-4" fill="none" stroke="#fff2ca" strokeWidth="1.5" strokeLinecap="round" opacity=".8" />
    <circle cx="15" cy="8" r="1.5" fill="#bd6921" />
  </g>;

  if (type === 'banana') return <g aria-label="Banana">
    <path d="M5 12c3 9 11 14 21 9-4 8-14 10-21 4-3-3-4-8-3-12Z" fill="#ffd84a" stroke="#fff0a0" strokeWidth="1.2" />
    <path d="M7 16c4 5 10 7 16 4" fill="none" stroke="#fff4b6" strokeWidth="2" strokeLinecap="round" />
    <path d="m3 11 3-1 1 3-2 2M25 19l3 1-1 3-3-1" fill="#80512e" />
  </g>;

  if (type === 'cherry') return <g aria-label="Cherries">
    <path d="M12 17c0-7 0-11 3-14M17 16c4-8 7-10 10-10" fill="none" stroke="#53d979" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 4c2-3 6-3 8-1-2 3-5 4-8 1Z" fill="#45d46a" />
    <circle cx="10" cy="21" r="7" fill="#e72e55" stroke="#ff8b9b" strokeWidth="1.2" />
    <circle cx="23" cy="21" r="7" fill="#d91f48" stroke="#ff8395" strokeWidth="1.2" />
    <ellipse cx="8" cy="18" rx="2" ry="2.8" fill="#fff" opacity=".32" />
    <ellipse cx="21" cy="18" rx="2" ry="2.8" fill="#fff" opacity=".32" />
  </g>;

  if (type === 'watermelon') return <g aria-label="Watermelon slice">
    <path d="M3 11a13 13 0 0 0 24 0Z" fill="#ff5265" stroke="#a6e66b" strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M5 13a11 11 0 0 0 20 0" fill="none" stroke="#f4ffad" strokeWidth="1.4" />
    <g fill="#452b38"><ellipse cx="10" cy="15" rx=".9" ry="1.5"/><ellipse cx="16" cy="17" rx=".9" ry="1.5"/><ellipse cx="21" cy="14" rx=".9" ry="1.5"/></g>
  </g>;

  if (type === 'pineapple') return <g aria-label="Pineapple">
    <path d="M14 12 8 4l7 4 2-7 3 7 7-4-6 9Z" fill="#4cda72" />
    <path d="M11 11c-7 5-6 18 4 21 11-1 13-16 5-21Z" fill="#ffc94d" stroke="#ffdf7f" strokeWidth="1.2" />
    <path d="m12 15 10 11M21 14l-9 13M12 20l10-5M13 26l8-5" fill="none" stroke="#d99432" strokeWidth=".9" opacity=".8" />
  </g>;

  if (type === 'pear') return <g aria-label="Pear">
    <path d="M15 10c0-4 1-6 3-8" fill="none" stroke="#80552f" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 7c2-4 6-4 9-2-2 3-5 4-9 2Z" fill="#48d96b" />
    <path d="M15 11c-2 5-9 8-8 15 1 7 15 9 19 2 3-6-4-11-6-17-1-3-4-3-5 0Z" fill="#a5df54" stroke="#d3f889" strokeWidth="1.1" />
    <ellipse cx="11" cy="21" rx="2" ry="3.5" fill="#f2ffbb" opacity=".5" />
  </g>;

  if (type === 'kiwi') return <g aria-label="Kiwi slice">
    <circle cx="15" cy="18" r="13" fill="#9b603a" />
    <circle cx="15" cy="18" r="10.5" fill="#8cdb58" />
    <circle cx="15" cy="18" r="3.2" fill="#f8f2cc" />
    <g fill="#3d382e"><ellipse cx="15" cy="11" rx=".8" ry="1.5"/><ellipse cx="20" cy="13" rx=".8" ry="1.5" transform="rotate(45 20 13)"/><ellipse cx="22" cy="18" rx=".8" ry="1.5" transform="rotate(90 22 18)"/><ellipse cx="20" cy="23" rx=".8" ry="1.5" transform="rotate(-45 20 23)"/><ellipse cx="15" cy="25" rx=".8" ry="1.5"/><ellipse cx="10" cy="23" rx=".8" ry="1.5" transform="rotate(45 10 23)"/><ellipse cx="8" cy="18" rx=".8" ry="1.5" transform="rotate(90 8 18)"/><ellipse cx="10" cy="13" rx=".8" ry="1.5" transform="rotate(-45 10 13)"/></g>
  </g>;

  if (type === 'grapes') return <g aria-label="Grapes">
    <path d="M12 7c2-4 6-4 8-2" fill="none" stroke="#986439" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 7c4-3 7-1 8 1-3 2-6 2-8-1Z" fill="#43cb70" />
    <g fill="#a451ee"><circle cx="11" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><circle cx="7.5" cy="18" r="4"/><circle cx="15" cy="19" r="4"/><circle cx="22" cy="18" r="4"/><circle cx="11.5" cy="25" r="4"/><circle cx="19" cy="25" r="4"/></g>
    <circle cx="10" cy="11" r="1.2" fill="#f4dcff" />
  </g>;
  if (type === 'strawberry') return <g aria-label="Strawberry">
    <path d="M15 10c-2-5-7-4-7-1 3 0 4 2 7 4 3-2 4-4 7-4 0-3-5-4-7 1Z" fill="#54e57d" />
    <path d="M15 12c-3-4-10-3-10 3 0 7 8 14 10 15 2-1 10-8 10-15 0-6-7-7-10-3Z" fill="#ff4861" />
    <g fill="#ffe28c"><circle cx="10" cy="16" r=".8"/><circle cx="16" cy="15" r=".8"/><circle cx="21" cy="17" r=".8"/><circle cx="12" cy="22" r=".8"/><circle cx="18" cy="22" r=".8"/><circle cx="15" cy="27" r=".8"/></g>
  </g>;
  return <g aria-label="Apple">
    <path d="M15 10c-1-5 2-7 5-7" fill="none" stroke="#986439" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 7c1-4 5-4 8-2-2 3-5 4-8 2Z" fill="#49db72" />
    <path d="M15 12c-7-7-14 0-11 9 2 7 7 11 11 8 4 3 9-1 11-8 3-9-4-16-11-9Z" fill="url(#appleGradient)" />
    <ellipse cx="9" cy="17" rx="2.4" ry="4" fill="#fff" opacity=".2" />
  </g>;
}

function fruitLabel(type) {
  const labels = {
    apple: 'Apple',
    grapes: 'Grapes',
    strawberry: 'Strawberry',
    orange: 'Orange',
    banana: 'Banana',
    cherry: 'Cherries',
    watermelon: 'Watermelon',
    pineapple: 'Pineapple',
    pear: 'Pear',
    kiwi: 'Kiwi',
  };
  return labels[type] || 'Apple';
}

function smoothSnakePath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const point = points[i];
    const next = points[i + 1];
    if (!next) d += ` Q ${point.x} ${point.y} ${point.x} ${point.y}`;
    else d += ` Q ${point.x} ${point.y} ${(point.x + next.x) / 2} ${(point.y + next.y) / 2}`;
  }
  return d;
}

export default function App() {
  const [snake, setSnake] = useState(START);
  const [fruit, setFruit] = useState(() => placeFruit(START));
  const [score, setScore] = useState(1);
  const [status, setStatus] = useState('playing');
  const snakeRef = useRef(snake);
  const fruitRef = useRef(fruit);
  const scoreRef = useRef(score);
  snakeRef.current = snake;
  fruitRef.current = fruit;
  scoreRef.current = score;

  function restart() {
    setSnake(START);
    setFruit(placeFruit(START, 'apple'));
    setScore(1);
    setStatus('playing');
  }

  useEffect(() => {
    if (status !== 'playing') return undefined;
    const timer = window.setInterval(() => {
      const currentSnake = snakeRef.current;
      const currentFruit = fruitRef.current;
      const step = findNextStep(currentSnake, currentFruit);
      const head = { x: currentSnake[0].x + step.x, y: currentSnake[0].y + step.y };
      const eating = head.x === currentFruit.x && head.y === currentFruit.y;
      const collisionBody = eating ? currentSnake : currentSnake.slice(0, -1);

      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || collisionBody.some((part) => part.x === head.x && part.y === head.y)) {
        setStatus('over');
        return;
      }

      const nextSnake = [head, ...currentSnake];
      if (!eating) nextSnake.pop();
      setSnake(nextSnake);

      if (eating) {
        if (scoreRef.current >= 10) {
          setStatus('won');
          return;
        }
        const nextScore = scoreRef.current + 1;
        setScore(nextScore);
        setFruit(placeFruit(nextSnake, FRUITS[nextScore - 1]));
      }
    }, 125);
    return () => window.clearInterval(timer);
  }, [status, score]);

  const points = snake.map((part) => ({ x: part.x * CELL + 12, y: part.y * CELL + 12 }));
  const path = smoothSnakePath(points);
  const head = points[0];
  const neck = points[1] || { x: head.x - 1, y: head.y };
  const dx = Math.sign(head.x - neck.x);
  const dy = Math.sign(head.y - neck.y);
  const headAngle = Math.atan2(dy, dx) * 180 / Math.PI;

  return <main className="game-page">
    <section className="game-card" aria-label="Automatic snake game">
      <header className="game-heading">
        <svg className="logo-snake" viewBox="0 0 48 40" aria-hidden="true"><defs><linearGradient id="logoGradient" x2="0" y2="1"><stop stopColor="#a8ffb9"/><stop offset="1" stopColor="#16bd39"/></linearGradient></defs><path d="M7 9c0-5 7-5 7 0v13c0 7 8 9 12 4 3-4 1-11 6-11s9 8 9 14" fill="none" stroke="url(#logoGradient)" strokeWidth="5" strokeLinecap="round"/><circle cx="10.5" cy="8" r="1.2" fill="#071008"/></svg>
        <h1>SNAKE GAME</h1>
      </header>
      <div className="board-frame">
        <svg className="board" viewBox="0 0 576 480" role="img" aria-label={`Snake chasing ${fruitLabel(fruit.type)}`}>
          <defs>
            <linearGradient id="boardGradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#101c16"/><stop offset="1" stopColor="#09110c"/></linearGradient>
            <pattern id="boardGrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#a5e4b3" strokeOpacity=".07" strokeWidth=".7"/></pattern>
            <linearGradient id="snakeGradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#c7ffd6"/><stop offset=".28" stopColor="#42ec85"/><stop offset="1" stopColor="#078b4e"/></linearGradient>
            <linearGradient id="snakeLine" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#aaffc4"/><stop offset=".45" stopColor="#35d875"/><stop offset="1" stopColor="#087647"/></linearGradient>
            <radialGradient id="appleGradient" cx="35%" cy="25%"><stop stopColor="#fff1d7"/><stop offset=".22" stopColor="#ff9270"/><stop offset="1" stopColor="#e62940"/></radialGradient>
            <filter id="gameGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect width="576" height="480" rx="12" fill="url(#boardGradient)" />
          <rect width="576" height="480" rx="12" fill="url(#boardGrid)" />
          <g filter="url(#gameGlow)" transform={`translate(${fruit.x * CELL} ${fruit.y * CELL}) scale(.8)`}><g className="fruit-float"><Fruit type={fruit.type} /></g></g>
          <g filter="url(#gameGlow)" transform={`translate(${fruit.x * CELL + 12} ${fruit.y * CELL + 12}) scale(1.1) translate(-15 -18)`}><g className="fruit-float"><Fruit type={fruit.type} /></g></g>
          <g filter="url(#gameGlow)">
            <path d={path} fill="none" stroke="#06152b" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity=".65" />
            <path d={path} fill="none" stroke="url(#snakeLine)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <path d={path} fill="none" stroke="#d7f2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity=".48" />
            {points.slice(1, -1).map((point, index) => {
              const before = points[index];
              const after = points[index + 2];
              const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
              return <g key={`scale-${point.x}-${point.y}-${index}`} transform={`translate(${point.x} ${point.y}) rotate(${angle})`}>
            <path d="M-3.5-4Q0-1 3.5-4" fill="none" stroke="#d8ffe3" strokeWidth="1.15" strokeLinecap="round" opacity=".68" />
            <path d="M-3.5 4Q0 1 3.5 4" fill="none" stroke="#087647" strokeWidth="1.25" strokeLinecap="round" opacity=".8" />
              </g>;
            })}
            <g transform={`translate(${head.x} ${head.y}) rotate(${headAngle})`}>
              <path d="M-8-7C-3-11 5-10 9-6L14 0 9 6C5 10-3 11-8 7Q-11 0-8-7Z" fill="url(#snakeGradient)" stroke="#c8eaff" strokeWidth="1.25" />
              <ellipse cx="3.5" cy="-3.7" rx="1.55" ry="1.85" fill="#06172c" />
              <ellipse cx="3.5" cy="3.7" rx="1.55" ry="1.85" fill="#06172c" />
              <circle cx="3.9" cy="-3.8" r=".5" fill="white" />
              <circle cx="3.9" cy="2.8" r=".5" fill="white" />
              <path d="M12 0H21M21 0l5-4M21 0l5 4" fill="none" stroke="#ff5069" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </svg>
      </div>
      <div className="game-controls"><strong>Score: <span>{score}</span></strong><button onClick={restart}>Restart</button></div>
      {status !== 'playing' && <div className="game-over-banner">{status === 'won' ? 'YOU WIN!' : 'GAME OVER!'}</div>}
    </section>
  </main>;
}