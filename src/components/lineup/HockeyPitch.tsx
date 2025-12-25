import { cn } from "@/lib/utils";

interface HockeyPitchProps {
  children: React.ReactNode;
  className?: string;
}

export const HockeyPitch = ({ children, className }: HockeyPitchProps) => {
  return (
    <div
      className={cn(
        "relative w-full aspect-[3/4] max-w-md mx-auto rounded-xl overflow-hidden",
        className
      )}
    >
      {/* Pitch background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 via-emerald-500 to-emerald-600">
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40" />
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/40 rounded-full" />
        
        {/* Shooting circle - top (opponent's) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <div className="w-40 h-20 border-b-2 border-white/40 rounded-b-full" />
        </div>
        
        {/* Shooting circle - bottom (our goal) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <div className="w-40 h-20 border-t-2 border-white/40 rounded-t-full" />
        </div>
        
        {/* Goal - top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-white/60 rounded-b-sm" />
        
        {/* Goal - bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-white/60 rounded-t-sm" />
        
        {/* Sidelines */}
        <div className="absolute inset-2 border-2 border-white/50 rounded-lg" />
        
        {/* Zone markers */}
        <div className="absolute top-[25%] left-4 right-4 border-t border-dashed border-white/20" />
        <div className="absolute top-[75%] left-4 right-4 border-t border-dashed border-white/20" />
      </div>
      
      {/* Players overlay */}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};
