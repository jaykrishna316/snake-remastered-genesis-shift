
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Direction } from "./GameBoard";
import { useIsMobile } from "@/hooks/use-mobile";

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onPause: () => void;
  onReset: () => void;
  isPaused: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onDirectionChange,
  onPause,
  onReset,
  isPaused,
}) => {
  const isMobile = useIsMobile();

  // Keyboard controls
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          onDirectionChange("UP");
          break;
        case "ArrowDown":
          e.preventDefault();
          onDirectionChange("DOWN");
          break;
        case "ArrowLeft":
          e.preventDefault();
          onDirectionChange("LEFT");
          break;
        case "ArrowRight":
          e.preventDefault();
          onDirectionChange("RIGHT");
          break;
        case " ": // Space bar
          e.preventDefault();
          onPause();
          break;
        case "r":
          e.preventDefault();
          onReset();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onDirectionChange, onPause, onReset]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPause}
          className="bg-muted text-foreground hover:bg-muted/80"
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="bg-muted text-foreground hover:bg-muted/80"
        >
          Restart
        </Button>
      </div>

      {isMobile && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="w-14 h-14 rounded-full bg-muted text-foreground hover:bg-muted/80"
            onClick={() => onDirectionChange("UP")}
          >
            <ArrowUp className="h-8 w-8" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full bg-muted text-foreground hover:bg-muted/80"
              onClick={() => onDirectionChange("LEFT")}
            >
              <ArrowLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full bg-muted text-foreground hover:bg-muted/80"
              onClick={() => onDirectionChange("DOWN")}
            >
              <ArrowDown className="h-8 w-8" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full bg-muted text-foreground hover:bg-muted/80"
              onClick={() => onDirectionChange("RIGHT")}
            >
              <ArrowRight className="h-8 w-8" />
            </Button>
          </div>
        </div>
      )}

      {!isMobile && (
        <div className="mt-2 text-muted-foreground text-sm">
          Use arrow keys to control, space to pause, R to restart
        </div>
      )}
    </div>
  );
};

export default GameControls;
