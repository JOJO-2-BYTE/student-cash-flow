import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { BudgetProgress } from '@/components/budget/BudgetProgress';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { useFinance } from '@/contexts/FinanceContext';
import { calculateTotalByType, formatCurrency, calculateNetIncome } from '@/lib/finance-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const { 
    transactions, 
    budgets, 
    achievements,
    addTransaction,
  } = useFinance();

  const totalIncome = calculateTotalByType(transactions, 'income');
  const totalExpenses = calculateTotalByType(transactions, 'expense');
  const netIncome = calculateNetIncome(transactions);
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : '0';

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      {/* Quick Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          onClick={() => setTransactionFormOpen(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          change={12.5}
          trend="up"
          icon={<TrendingUp className="w-6 h-6 text-success" />}
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          change={8.2}
          trend="down"
          icon={<TrendingDown className="w-6 h-6 text-destructive" />}
        />
        <StatsCard
          title="Net Income"
          value={formatCurrency(netIncome)}
          change={parseFloat(savingsRate)}
          trend={netIncome >= 0 ? "up" : "down"}
          icon={<Wallet className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          change={5.4}
          trend="up"
          icon={<Target className="w-6 h-6 text-accent" />}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SpendingChart />
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    transaction.type === 'income' ? "bg-success" : "bg-destructive"
                  )} />
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "font-bold text-sm",
                  transaction.type === 'income' ? "text-success" : "text-destructive"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Budgets */}
      <div>
        <h2 className="text-xl font-bold mb-4">Budget Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {budgets.map((budget) => (
            <BudgetProgress key={budget.id} budget={budget} />
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-xl font-bold mb-4">Achievements</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievements.slice(0, 6).map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        open={transactionFormOpen}
        onOpenChange={setTransactionFormOpen}
        onSubmit={addTransaction}
      />
    </div>
  );
}