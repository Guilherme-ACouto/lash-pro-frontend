import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { TopbarComponent } from './topbar/topbar.component';
import { AuthActions } from '../../../features/auth/store/auth.actions';
import { selectCurrentUser } from '../../../features/auth/store/auth.selectors';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, BottomNavComponent, TopbarComponent, AsyncPipe, MatIconModule, MatButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private store = inject(Store);

  isDesktop$ = this.breakpointObserver
    .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
    .pipe(map(result => result.matches));

  user$ = this.store.select(selectCurrentUser);

  exitSupport(): void {
    this.store.dispatch(AuthActions.exitSupport());
  }
}
