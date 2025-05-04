
import React from "react";

interface GameScoreProps {
  score: number;
  highScore: number;
}

const GameScore: React.FC<GameScoreProps> = ({ score, highScore }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="bg-card p-3 rounded-lg border border-muted">
        <p className="text-sm text-muted-foreground">Score</p>
        <p className="text-2xl font-bold">{score}</p>
      </div>
      
      <div className="text-center">
        <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Twisted Snake
        </h1>
        <p className="text-sm text-muted-foreground">Grow & Teleport</p>
      </div>
      
      <div className="bg-card p-3 rounded-lg border border-muted">
        <p className="text-sm text-muted-foreground">High Score</p>
        <p className="text-2xl font-bold">{highScore}</p>
      </div>
    </div>
  );
};

export default GameScore;
