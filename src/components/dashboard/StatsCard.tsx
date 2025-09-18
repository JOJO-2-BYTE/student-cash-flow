import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatsCard({ title, value, change, icon, trend = 'neutral' }: StatsCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-base">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {trend === 'up' && (
                  <ArrowUpRight className="w-4 h-4 text-success" />
                )}
                {trend === 'down' && (
                  <ArrowDownRight className="w-4 h-4 text-destructive" />
                )}
                {trend === 'neutral' && (
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  trend === 'up' && "text-success",
                  trend === 'down' && "text-destructive",
                  trend === 'neutral' && "text-muted-foreground"
                )}>
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="w-12 h-12 rounded-full bg-gradient-primary opacity-10 group-hover:opacity-20 transition-opacity flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}