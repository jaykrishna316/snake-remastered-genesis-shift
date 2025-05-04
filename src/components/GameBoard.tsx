
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import GameControls from "./GameControls";
import GameScore from "./GameScore";

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Position = { x: number; y: number };
export type Snake = Position[];

interface GameBoardProps {
  boardSize: number;
  speed: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ boardSize, speed }) => {
  const { toast } = useToast();
  const cellSize = Math.min(
    Math.floor((window.innerWidth - 40) / boardSize),
    Math.floor((window.innerHeight - 200) / boardSize)
  );

  const [snake, setSnake] = useState<Snake>([
    { x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) },
  ]);
  const [food, setFood] = useState<Position>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const directionRef = useRef<Direction>(direction);
  const gameLoopRef = useRef<number | null>(null);

  // Initialize high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("snakeHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Generate random position for food
  const generateFood = (): Position => {
    const newFood: Position = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };

    // Make sure food doesn't spawn on snake
    if (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    
    return newFood;
  };

  // Initialize game
  useEffect(() => {
    setFood(generateFood());
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  // Generate random teleport location
  const generateTeleportLocation = (): Position => {
    const newPosition: Position = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
    
    return newPosition;
  };

  // Check for collisions
  const checkCollisions = (newHead: Position): boolean => {
    // Check if snake hits the wall
    if (
      newHead.x < 0 ||
      newHead.x >= boardSize ||
      newHead.y < 0 ||
      newHead.y >= boardSize
    ) {
      return true;
    }

    // Check if snake hits itself (skip head)
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
        return true;
      }
    }

    return false;
  };

  // Handle game over
  const handleGameOver = () => {
    setIsGameOver(true);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("snakeHighScore", score.toString());
      
      toast({
        title: "New High Score!",
        description: `You achieved a new high score of ${score}!`,
      });
    } else {
      toast({
        title: "Game Over",
        description: `Your score: ${score}. High score: ${highScore}`,
      });
    }
    
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  };

  // Reset game
  const resetGame = () => {
    setSnake([{ x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) }]);
    setFood(generateFood());
    directionRef.current = "RIGHT";
    setDirection("RIGHT");
    setIsGameOver(false);
    setScore(0);
    if (isPaused) setIsPaused(false);
    startGameLoop();
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Game loop
  const updateGame = () => {
    if (isGameOver || isPaused) return;

    const currentDirection = directionRef.current;
    const currentSnake = [...snake];
    const head = { ...currentSnake[0] };
    
    // Move head based on direction
    switch (currentDirection) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }
    
    // Check for collision
    if (checkCollisions(head)) {
      handleGameOver();
      return;
    }
    
    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      
      // Grow at both ends
      const tail = { ...currentSnake[currentSnake.length - 1] };
      
      // Add new food
      setFood(generateFood());
      
      // Add to front and back
      currentSnake.unshift(head);
      currentSnake.push(tail);
      
      // Teleport snake to random location
      const teleportLocation = generateTeleportLocation();
      const teleportedSnake = currentSnake.map((segment) => ({
        x: teleportLocation.x,
        y: teleportLocation.y,
      }));
      
      setSnake(teleportedSnake);
    } else {
      // Regular movement - remove tail and add new head
      currentSnake.pop();
      currentSnake.unshift(head);
      setSnake(currentSnake);
    }
  };

  const startGameLoop = () => {
    let lastTime = 0;
    const gameSpeed = 1000 / speed; // ms

    const loop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      
      if (deltaTime >= gameSpeed) {
        lastTime = timestamp;
        updateGame();
      }
      
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    
    gameLoopRef.current = requestAnimationFrame(loop);
  };

  // Start game loop
  useEffect(() => {
    if (!isGameOver && !isPaused) {
      startGameLoop();
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isGameOver, isPaused, speed]);

  // Change direction
  const changeDirection = (newDirection: Direction) => {
    // Prevent 180 degree turns
    if (
      (directionRef.current === "UP" && newDirection === "DOWN") ||
      (directionRef.current === "DOWN" && newDirection === "UP") ||
      (directionRef.current === "LEFT" && newDirection === "RIGHT") ||
      (directionRef.current === "RIGHT" && newDirection === "LEFT")
    ) {
      return;
    }
    
    directionRef.current = newDirection;
    setDirection(newDirection);
  };

  // Create the game board grid
  const renderBoard = () => {
    const grid = [];
    
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        // Check if this cell is part of the snake
        const isSnakeCell = snake.some(segment => segment.x === x && segment.y === y);
        // Check if this cell is the head
        const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
        // Check if this cell is the food
        const isFoodCell = food.x === x && food.y === y;
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={cn(
              "absolute snake-cell",
              isSnakeHead ? "bg-secondary z-10" : "",
              isSnakeCell && !isSnakeHead ? "bg-primary" : "",
              isFoodCell ? "bg-accent food-cell" : ""
            )}
            style={{
              width: cellSize,
              height: cellSize,
              left: x * cellSize,
              top: y * cellSize,
            }}
          />
        );
      }
    }
    
    return grid;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-6">
      <GameScore score={score} highScore={highScore} />
      
      <div
        className="relative bg-card rounded-lg border border-muted overflow-hidden"
        style={{
          width: boardSize * cellSize,
          height: boardSize * cellSize,
        }}
      >
        {renderBoard()}
        
        {isGameOver && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center flex-col gap-4 z-20">
            <h2 className="text-3xl font-bold text-foreground">Game Over</h2>
            <p className="text-muted-foreground">
              Score: {score} | High Score: {highScore}
            </p>
            <button
              onClick={resetGame}
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-md"
            >
              Play Again
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center flex-col gap-4 z-20">
            <h2 className="text-3xl font-bold text-foreground">Paused</h2>
            <button
              onClick={togglePause}
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-md"
            >
              Resume
            </button>
          </div>
        )}
      </div>
      
      <GameControls
        onDirectionChange={changeDirection}
        onPause={togglePause}
        onReset={resetGame}
        isPaused={isPaused}
      />
    </div>
  );
};

export default GameBoard;
