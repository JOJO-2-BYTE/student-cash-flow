import React, { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoalCard } from '@/components/goals/GoalCard';
import { useFinance } from '@/contexts/FinanceContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SavingsGoal } from '@/types/finance';

export default function Goals() {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useFinance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<SavingsGoal>>({
    name: '',
    target: 0,
    current: 0,
    icon: '🎯',
  });

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.target > 0) {
      addSavingsGoal({
        name: newGoal.name,
        target: newGoal.target,
        current: newGoal.current || 0,
        deadline: newGoal.deadline || new Date(new Date().setMonth(new Date().getMonth() + 3)),
        icon: newGoal.icon || '🎯',
      });
      setNewGoal({ name: '', target: 0, current: 0, icon: '🎯' });
      setIsAddDialogOpen(false);
    }
  };

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <p className="text-muted-foreground mt-1">Track and achieve your financial goals</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Total Saved</h3>
          </div>
          <p className="text-2xl font-bold">${totalSaved.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Total Target</h3>
          </div>
          <p className="text-2xl font-bold">${totalTarget.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-success" />
            <h3 className="font-semibold">Overall Progress</h3>
          </div>
          <p className="text-2xl font-bold">{overallProgress.toFixed(1)}%</p>
        </div>
      </div>

      {/* Goals Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Goals</h2>
        {savingsGoals.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No savings goals yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first savings goal</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savingsGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdate={updateSavingsGoal}
                onDelete={deleteSavingsGoal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Savings Goal</DialogTitle>
            <DialogDescription>
              Set a financial target and track your progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                placeholder="e.g., Spring Break Trip"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Amount ($)</Label>
              <Input
                id="target"
                type="number"
                min="0"
                step="0.01"
                placeholder="1000.00"
                value={newGoal.target || ''}
                onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current">Current Amount ($)</Label>
              <Input
                id="current"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newGoal.current || ''}
                onChange={(e) => setNewGoal({ ...newGoal, current: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline ? new Date(newGoal.deadline).toISOString().split('T')[0] : ''}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: new Date(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                placeholder="🎯"
                value={newGoal.icon}
                onChange={(e) => setNewGoal({ ...newGoal, icon: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGoal}>
                Create Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}