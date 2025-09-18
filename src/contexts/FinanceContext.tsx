import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Budget, SavingsGoal, Achievement } from '@/types/finance';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  achievements: Achievement[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (budget: Budget) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Generate sample data
const generateSampleTransactions = (): Transaction[] => {
  const now = new Date();
  return [
    { id: '1', type: 'expense', amount: 45.99, category: 'food', description: 'Groceries at Walmart', date: subDays(now, 1), tags: ['groceries'] },
    { id: '2', type: 'expense', amount: 12.50, category: 'transport', description: 'Uber to campus', date: subDays(now, 2) },
    { id: '3', type: 'income', amount: 500.00, category: 'freelance', description: 'Website project', date: subDays(now, 3) },
    { id: '4', type: 'expense', amount: 89.99, category: 'education', description: 'Textbooks', date: subDays(now, 4) },
    { id: '5', type: 'expense', amount: 15.99, category: 'entertainment', description: 'Netflix subscription', date: subDays(now, 5), isRecurring: true },
    { id: '6', type: 'income', amount: 1200.00, category: 'scholarship', description: 'Monthly scholarship', date: subDays(now, 6), isRecurring: true },
    { id: '7', type: 'expense', amount: 650.00, category: 'housing', description: 'Rent payment', date: subDays(now, 7), isRecurring: true },
    { id: '8', type: 'expense', amount: 35.00, category: 'utilities', description: 'Internet bill', date: subDays(now, 8), isRecurring: true },
  ];
};

const initialBudgets: Budget[] = [
  { id: '1', category: 'food', limit: 300, spent: 145.99, period: 'monthly' },
  { id: '2', category: 'transport', limit: 100, spent: 45.50, period: 'monthly' },
  { id: '3', category: 'entertainment', limit: 50, spent: 35.99, period: 'monthly' },
  { id: '4', category: 'education', limit: 200, spent: 89.99, period: 'monthly' },
];

const initialSavingsGoals: SavingsGoal[] = [
  { id: '1', name: 'Spring Break Trip', target: 1500, current: 650, deadline: addDays(new Date(), 60), icon: '✈️' },
  { id: '2', name: 'New Laptop', target: 1200, current: 300, deadline: addDays(new Date(), 90), icon: '💻' },
  { id: '3', name: 'Emergency Fund', target: 2000, current: 1200, deadline: addDays(new Date(), 180), icon: '🏦' },
];

const initialAchievements: Achievement[] = [
  { id: '1', name: 'First Transaction', description: 'Add your first transaction', icon: '🎯', progress: 1, maxProgress: 1, unlocked: true, unlockedAt: new Date() },
  { id: '2', name: 'Budget Master', description: 'Stay under budget for 3 categories', icon: '📊', progress: 2, maxProgress: 3, unlocked: false },
  { id: '3', name: 'Savings Streak', description: 'Save money for 7 days in a row', icon: '🔥', progress: 3, maxProgress: 7, unlocked: false },
  { id: '4', name: 'Goal Crusher', description: 'Complete a savings goal', icon: '🏆', progress: 0, maxProgress: 1, unlocked: false },
  { id: '5', name: 'Expense Tracker', description: 'Log 50 transactions', icon: '📝', progress: 8, maxProgress: 50, unlocked: false },
];

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : generateSampleTransactions();
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : initialBudgets;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('savingsGoals');
    return saved ? JSON.parse(saved) : initialSavingsGoals;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    setTransactions([newTransaction, ...transactions]);

    // Update budget spent
    const budget = budgets.find(b => b.category === transaction.category);
    if (budget && transaction.type === 'expense') {
      setBudgets(budgets.map(b => 
        b.id === budget.id 
          ? { ...b, spent: b.spent + transaction.amount }
          : b
      ));
    }

    // Check achievements
    const expenseCount = transactions.filter(t => t.type === 'expense').length + 1;
    if (expenseCount === 50) {
      setAchievements(achievements.map(a => 
        a.id === '5' 
          ? { ...a, progress: 50, unlocked: true, unlockedAt: new Date() }
          : a
      ));
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateBudget = (budget: Budget) => {
    setBudgets(budgets.map(b => b.id === budget.id ? budget : b));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = { ...goal, id: uuidv4() };
    setSavingsGoals([...savingsGoals, newGoal]);
  };

  const updateSavingsGoal = (goal: SavingsGoal) => {
    setSavingsGoals(savingsGoals.map(g => g.id === goal.id ? goal : g));
    
    // Check if goal is completed
    if (goal.current >= goal.target) {
      setAchievements(achievements.map(a => 
        a.id === '4' 
          ? { ...a, progress: 1, unlocked: true, unlockedAt: new Date() }
          : a
      ));
    }
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter(g => g.id !== id));
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      savingsGoals,
      achievements,
      addTransaction,
      deleteTransaction,
      updateBudget,
      addSavingsGoal,
      updateSavingsGoal,
      deleteSavingsGoal,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}