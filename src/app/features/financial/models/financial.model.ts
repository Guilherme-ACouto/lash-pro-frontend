export type FinancialEntryType = 'INCOME' | 'EXPENSE';
export type FinancialExpenseType = 'FIXED' | 'VARIABLE' | 'PEOPLE' | 'TAX' | 'TRANSFER';
export type FinancialStatus = 'PENDING' | 'PAID' | 'OVERDUE';
export type FinancialPeriod =
  | 'THIS_MONTH'
  | 'NEXT_MONTH'
  | 'THIS_WEEK'
  | 'TODAY'
  | 'LAST_30'
  | 'LAST_90'
  | 'THIS_YEAR'
  | 'CUSTOM';
export type FinancialTab = 'INCOME' | 'FIXED' | 'VARIABLE' | 'PEOPLE' | 'TAX' | 'TRANSFER';

export interface MonthlyStatItem {
  year: number;
  month: number;
  income: number;
  expense: number;
}

export interface FinancialSummary {
  predictedMonthResult: number;
  currentBalance: number;
  incomeReceived: number;
  incomePredicted: number;
  expensePaid: number;
  expensePredicted: number;
  monthlySeries: MonthlyStatItem[];
}

export interface FinancialEntry {
  id: string;
  type: FinancialEntryType;
  expenseType: FinancialExpenseType | null;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate: string | null;
  status: FinancialStatus;
  category: string | null;
  paymentMethod: string | null;
  counterpart: string | null;
  notes: string | null;
  linkedToAppointment: boolean;
  appointmentId: string | null;
}

export interface CreateFinancialEntryRequest {
  type: FinancialEntryType;
  expenseType?: FinancialExpenseType;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string | null;
  category?: string | null;
  paymentMethod?: string | null;
  receivedFrom?: string | null;
  notes?: string | null;
}

export interface UpdateFinancialEntryRequest {
  description?: string;
  amount?: number;
  dueDate?: string;
  paymentDate?: string | null;
  category?: string | null;
  expenseType?: FinancialExpenseType | null;
  paymentMethod?: string | null;
  receivedFrom?: string | null;
  notes?: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
