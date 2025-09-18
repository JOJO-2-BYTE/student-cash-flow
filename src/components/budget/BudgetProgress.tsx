import React from 'react';
import { Budget } from '@/types/finance';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateBudgetPercentage, getBudgetStatus, categoryIcons, formatCurrency } from '@/lib/finance-utils';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface BudgetProgressProps {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
}

export function BudgetProgress({ budget, onEdit }: BudgetProgressProps) {
  const percentage = calculateBudgetPercentage(budget);
  const status = getBudgetStatus(budget);
  const remaining = Math.max(0, budget.limit - budget.spent);
  
  const statusConfig = {
    safe: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'text-success',
      bgColor: 'bg-success/10',
      progressColor: 'bg-success',
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      progressColor: 'bg-warning',
    },
    danger: {
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      progressColor: 'bg-destructive',
    },
  };
  
  const config = statusConfig[status];
  
  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-all duration-base cursor-pointer",
        status === 'danger' && "border-destructive/50"
      )}
      onClick={() => onEdit?.(budget)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcons[budget.category]}</span>
            <CardTitle className="text-base capitalize">
              {budget.category}
            </CardTitle>
          </div>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
            config.bgColor,
            config.color
          )}>
            {config.icon}
            {status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className="font-medium">{formatCurrency(budget.spent)}</span>
          </div>
          <Progress 
            value={percentage} 
            className={cn(
              "h-2",
              status === 'danger' && "[&>*]:bg-destructive",
              status === 'warning' && "[&>*]:bg-warning",
              status === 'safe' && "[&>*]:bg-success"
            )}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percentage.toFixed(0)}% used</span>
            <span>Limit: {formatCurrency(budget.limit)}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Remaining</span>
            <span className={cn(
              "text-lg font-bold",
              remaining > 0 ? "text-success" : "text-destructive"
            )}>
              {formatCurrency(remaining)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {budget.period === 'monthly' ? 'This month' : 'This week'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}