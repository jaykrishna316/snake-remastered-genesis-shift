
import React, { useEffect, useState } from "react";
import GameBoard from "@/components/GameBoard";
import { useToast } from "@/components/ui/use-toast";

const BOARD_SIZE = 20; // Grid size
const GAME_SPEED = 8; // Cells per second

const Index = () => {
  const { toast } = useToast();
  const [isGameReady, setIsGameReady] = useState(false);
  
  useEffect(() => {
    // Show instructions on game load
    toast({
      title: "Welcome to Twisted Snake!",
      description: "Collect food to grow, but beware - your snake will teleport randomly!",
    });
    
    // Short delay to ensure all components are loaded
    const timer = setTimeout(() => {
      setIsGameReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg mx-auto">
        {isGameReady && <GameBoard boardSize={BOARD_SIZE} speed={GAME_SPEED} />}
      </div>
    </div>
  );
};

export default Index;
