export type DashboardPeriod = 'TODAY' | 'WEEK' | 'MONTH';

export interface AppointmentDayStat {
  date: string;
  completed: number;
  confirmed: number;
  scheduled: number;
  cancelled: number;
}

export interface CashFlowDayStat {
  date: string;
  income: number;
  expense: number;
}

export interface TodayAppointment {
  id: string;
  clientName: string;
  serviceName: string;
  scheduledTime: string;
  status: string;
}

export interface DashboardData {
  activeClients: number;
  clientsGrowth: number;
  totalAppointments: number;
  completedAppointments: number;
  confirmedAppointments: number;
  scheduledAppointments: number;
  cancellations: number;
  revenue: number;
  receivable: number;
  payable: number;
  appointmentsSeries: AppointmentDayStat[];
  cashFlowSeries: CashFlowDayStat[];
  todayAppointments: TodayAppointment[];
  daysWithAppointments: string[];
}
