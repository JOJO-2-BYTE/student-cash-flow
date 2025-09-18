import React from 'react';
import { Achievement } from '@/types/finance';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Trophy, Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const percentage = (achievement.progress / achievement.maxProgress) * 100;
  
  return (
    <div className={cn(
      "relative group cursor-pointer transition-all duration-base",
      "p-4 rounded-lg border",
      achievement.unlocked
        ? "bg-gradient-card border-primary/20 shadow-md hover:shadow-glow"
        : "bg-card border-border hover:border-primary/30"
    )}>
      {achievement.unlocked && (
        <div className="absolute -top-2 -right-2 animate-bounce">
          <Trophy className="w-5 h-5 text-warning" />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
          achievement.unlocked
            ? "bg-gradient-primary"
            : "bg-muted"
        )}>
          {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5 text-muted-foreground" />}
        </div>
        
        <div className="flex-1 space-y-2">
          <h4 className={cn(
            "font-semibold text-sm",
            !achievement.unlocked && "text-muted-foreground"
          )}>
            {achievement.name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {achievement.description}
          </p>
          
          <div className="space-y-1">
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {achievement.progress} / {achievement.maxProgress}
            </p>
          </div>
          
          {achievement.unlockedAt && (
            <p className="text-xs text-success">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}