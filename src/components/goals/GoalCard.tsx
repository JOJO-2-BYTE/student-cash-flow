import React from 'react';
import { SavingsGoal } from '@/types/finance';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/finance-utils';
import { differenceInDays } from 'date-fns';
import { Calendar, TrendingUp, Plus, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: SavingsGoal;
  onUpdate: (goal: SavingsGoal) => void;
  onDelete?: (id: string) => void;
}

export function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const percentage = (goal.current / goal.target) * 100;
  const remaining = goal.target - goal.current;
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
  const isCompleted = percentage >= 100;
  const isUrgent = daysLeft <= 7 && !isCompleted;
  
  const handleAddFunds = () => {
    const amount = prompt('How much would you like to add?');
    if (amount && !isNaN(Number(amount))) {
      onUpdate({
        ...goal,
        current: goal.current + Number(amount),
      });
    }
  };
  
  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-base",
      isCompleted && "border-success/50 bg-success/5",
      isUrgent && "border-warning/50 bg-warning/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{goal.icon}</span>
            <CardTitle className="text-base">{goal.name}</CardTitle>
          </div>
          {isCompleted && (
            <Trophy className="w-5 h-5 text-warning animate-pulse" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
            </span>
          </div>
          <Progress 
            value={Math.min(percentage, 100)} 
            className={cn(
              "h-3",
              isCompleted && "[&>*]:bg-success",
              isUrgent && !isCompleted && "[&>*]:bg-warning"
            )}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percentage.toFixed(0)}% complete</span>
            <span>{formatCurrency(remaining)} to go</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span className={cn(
              daysLeft <= 7 && !isCompleted && "text-warning font-medium"
            )}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-success text-xs font-medium">
              ${(remaining / Math.max(daysLeft, 1)).toFixed(0)}/day
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={handleAddFunds}
            disabled={isCompleted}
            variant={isCompleted ? "outline" : "default"}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Funds
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(goal.id)}
              className="text-destructive hover:text-destructive"
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}