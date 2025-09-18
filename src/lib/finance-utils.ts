import { Transaction, Category, Budget } from '@/types/finance';
import { format } from 'date-fns';

export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${Math.abs(amount).toFixed(2)}`;
}

export function calculateTotalByType(
  transactions: Transaction[],
  type: 'income' | 'expense'
): number {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateNetIncome(transactions: Transaction[]): number {
  const income = calculateTotalByType(transactions, 'income');
  const expenses = calculateTotalByType(transactions, 'expense');
  return income - expenses;
}

export function getTransactionsByCategory(
  transactions: Transaction[],
  category: Category
): Transaction[] {
  return transactions.filter(t => t.category === category);
}

export function calculateBudgetPercentage(budget: Budget): number {
  if (budget.limit === 0) return 0;
  return Math.min((budget.spent / budget.limit) * 100, 100);
}

export function getBudgetStatus(budget: Budget): 'safe' | 'warning' | 'danger' {
  const percentage = calculateBudgetPercentage(budget);
  if (percentage >= 100) return 'danger';
  if (percentage >= 80) return 'warning';
  return 'safe';
}

export function exportToCSV(transactions: Transaction[]): string {
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
  const rows = transactions.map(t => [
    format(t.date, 'yyyy-MM-dd'),
    t.type,
    t.category,
    t.description,
    t.amount.toString()
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

export function exportToJSON(transactions: Transaction[]): string {
  return JSON.stringify(transactions, null, 2);
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const categoryIcons: Record<Category, string> = {
  food: '🍔',
  transport: '🚗',
  entertainment: '🎮',
  education: '📚',
  housing: '🏠',
  utilities: '💡',
  health: '🏥',
  shopping: '🛍️',
  salary: '💰',
  freelance: '💻',
  scholarship: '🎓',
  other: '📌'
};

export const categoryColors: Record<Category, string> = {
  food: 'hsl(var(--chart-1))',
  transport: 'hsl(var(--chart-2))',
  entertainment: 'hsl(var(--chart-3))',
  education: 'hsl(var(--chart-4))',
  housing: 'hsl(var(--chart-5))',
  utilities: 'hsl(var(--warning))',
  health: 'hsl(var(--success))',
  shopping: 'hsl(var(--accent))',
  salary: 'hsl(var(--success))',
  freelance: 'hsl(var(--primary))',
  scholarship: 'hsl(var(--chart-4))',
  other: 'hsl(var(--muted-foreground))'
};