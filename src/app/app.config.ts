import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { authReducer } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { clientReducer } from './features/clients/store/client.reducer';
import { ClientEffects } from './features/clients/store/client.effects';
import { serviceReducer } from './features/services/store/service.reducer';
import { ServiceEffects } from './features/services/store/service.effects';
import { appointmentReducer } from './features/appointments/store/appointment.reducer';
import { AppointmentEffects } from './features/appointments/store/appointment.effects';
import { dashboardReducer } from './features/dashboard/store/dashboard.reducer';
import { DashboardEffects } from './features/dashboard/store/dashboard.effects';
import { financialReducer } from './features/financial/store/financial.reducer';
import { FinancialEffects } from './features/financial/store/financial.effects';
import { inventoryReducer } from './features/inventory/store/inventory.reducer';
import { InventoryEffects } from './features/inventory/store/inventory.effects';
import { jwtInterceptor } from './core/auth/jwt.interceptor';
import { fichasReducer } from './features/fichas/store/fichas.reducer';
import { FichasEffects } from './features/fichas/store/fichas.effects';
import { errorInterceptor } from './core/http/error.interceptor';
import { loadingInterceptor } from './core/http/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([jwtInterceptor, loadingInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    provideStore({ auth: authReducer, clients: clientReducer, services: serviceReducer, appointments: appointmentReducer, dashboard: dashboardReducer, financial: financialReducer, inventory: inventoryReducer, fichas: fichasReducer }),
    provideEffects([AuthEffects, ClientEffects, ServiceEffects, AppointmentEffects, DashboardEffects, FinancialEffects, InventoryEffects, FichasEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
  ],
};
