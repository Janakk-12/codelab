"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Brick {
  x: number;
  y: number;
  status: number;
}

export default function SandeshHeadquarters() {
  // --- ALL HOOKS MUST BE INSIDE HERE ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOverText, setGameOverText] = useState("NEON BREAKOUT");

  // Game Logic Refs
  const paddle = useRef({ w: 90, h: 12, x: 155, y: 470, color: "#4254fd" });
  const ball = useRef({ x: 200, y: 440, radius: 8, dx: 4, dy: -4, color: "#00f2fe" });
  const bricks = useRef<Brick[][]>([]);

  // Constants
  const brickRowCount = 5;
  const brickColumnCount = 5;
  const brickWidth = 65;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 50;
  const brickOffsetLeft = 15;

  const initBricks = () => {
    const newBricks: Brick[][] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      newBricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        newBricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    bricks.current = newBricks;
  };

  const startGame = () => {
    initBricks();
    setScore(0);
    ball.current = { x: 200, y: 440, dx: 4, dy: -4, radius: 8, color: "#00f2fe" };
    setGameRunning(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 500;

    const movePaddle = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let relativeX;
      if ('touches' in e) {
        relativeX = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
      } else {
        relativeX = (e.clientX - rect.left) * (canvas.width / rect.width);
      }
      if (relativeX > 0 && relativeX < canvas.width) {
        paddle.current.x = relativeX - paddle.current.w / 2;
      }
    };

    window.addEventListener("mousemove", movePaddle);
    window.addEventListener("touchmove", movePaddle, { passive: false });

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Bricks
      bricks.current.forEach((column, c) => {
        column.forEach((b, r) => {
          if (b.status === 1) {
            const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            b.x = brickX;
            b.y = brickY;
            ctx.fillStyle = "#ff4d4d";
            ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
          }
        });
      });

      // Draw Paddle
      ctx.fillStyle = paddle.current.color;
      ctx.fillRect(paddle.current.x, paddle.current.y, paddle.current.w, paddle.current.h);

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.current.color;
      ctx.fill();
      ctx.closePath();

      if (gameRunning) {
        bricks.current.forEach((column) => {
          column.forEach((b) => {
            if (b.status === 1 && ball.current.x > b.x && ball.current.x < b.x + brickWidth && ball.current.y > b.y && ball.current.y < b.y + brickHeight) {
              ball.current.dy = -ball.current.dy;
              b.status = 0;
              setScore(prev => {
                const newScore = prev + 1;
                if (newScore === brickRowCount * brickColumnCount) {
                  setGameRunning(false);
                  setGameOverText("CLEARED!");
                }
                return newScore;
              });
            }
          });
        });

        if (ball.current.x + ball.current.dx > canvas.width - ball.current.radius || ball.current.x + ball.current.dx < ball.current.radius) {
          ball.current.dx = -ball.current.dx;
        }
        if (ball.current.y + ball.current.dy < ball.current.radius) {
          ball.current.dy = -ball.current.dy;
        } else if (ball.current.y + ball.current.dy > paddle.current.y - ball.current.radius) {
          if (ball.current.x > paddle.current.x && ball.current.x < paddle.current.x + paddle.current.w) {
            ball.current.dy = -Math.abs(ball.current.dy);
            let hitPos = (ball.current.x - (paddle.current.x + paddle.current.w / 2)) / (paddle.current.w / 2);
            ball.current.dx = hitPos * 5;
          } else if (ball.current.y + ball.current.dy > canvas.height - ball.current.radius) {
            setGameRunning(false);
            setGameOverText("GAME OVER");
          }
        }
        ball.current.x += ball.current.dx;
        ball.current.y += ball.current.dy;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    initBricks();

    return () => {
      window.removeEventListener("mousemove", movePaddle);
      window.removeEventListener("touchmove", movePaddle);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameRunning]);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans">
      <div 
        className="fixed inset-0 opacity-15 z-[-1] blur-[5px] pointer-events-none bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: 'url("/construct.png")' }}
      ></div>

      <main className="flex flex-col lg:flex-row items-center justify-center min-h-screen p-10 lg:p-0 gap-10 lg:gap-20">
        <section className="text-center max-w-[500px] bg-white/5 p-9 rounded-[24px] border border-white/10 backdrop-blur-xl shadow-2xl">
          <h1 className="text-5xl font-bold text-[#00ff9d] tracking-tighter">J A N A K</h1>
          <p className="text-[#4254fd] font-bold uppercase tracking-[2px] text-[0.85rem] my-3">Version 1.0: In Progress</p>
          <div className="text-[#bbb] leading-relaxed my-5">
            <p className="mb-4">Building my digital headquarters, bit by bit.</p>
            <ul className="flex justify-center gap-4 text-[0.8rem] text-[#00ff9d] font-semibold list-none">
              <li>✦ SOON THERE</li>
            </ul>
          </div>
          <a href="https://github.com/janakk-12" target="_blank" className="inline-block py-3.5 px-7 border border-[#4254fd] rounded-full transition-all bg-[#4254fd1a] hover:bg-[#4254fd] hover:shadow-[0_0_25px_rgba(66,84,253,0.5)]">
            Visit GitHub @janakk-12
          </a>
        </section>

        <section className="w-full max-w-[400px] text-center">
          <div className="relative aspect-[4/5] bg-black rounded-[20px] border-2 border-[#4254fd] overflow-hidden shadow-[0_0_30px_rgba(66,84,253,0.2)]">
            <div className="absolute top-4 left-4 text-[#00ff9d] font-mono font-bold z-[5]">Score: {score}</div>
            <canvas ref={canvasRef} className="w-full h-full" />
            {!gameRunning && (
              <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center z-10 p-5">
                <div className="bg-white/10 p-8 rounded-2xl border border-white/10">
                  <h2 className="text-[#00ff9d] text-3xl mb-2 font-bold">{gameOverText}</h2>
                  <p className="text-gray-400 mb-6 text-sm">Use the paddle to destroy all bricks.</p>
                  <button onClick={startGame} className="bg-[#4254fd] hover:bg-[#00ff9d] hover:text-black text-white font-bold py-4 px-9 rounded-xl transition-all">
                    START GAME
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="text-[0.8rem] text-gray-500 mt-4 uppercase tracking-widest">Move mouse/touch to play</p>
        </section>
      </main>
    </div>
  );
}