import { DestroyRef, Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map } from 'rxjs';
import { selectCurrentUser, userCan } from '../../features/auth/store/auth.selectors';

/**
 * Mostra o elemento só se o usuário tiver a permissão: {@code *appCan="'client.create'"}.
 * {@code 'admin'} = só administrador da assinatura. É conveniência de tela — quem garante de
 * verdade é o backend (403).
 */
@Directive({
  selector: '[appCan]',
  standalone: true,
})
export class CanDirective {
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private store = inject(Store);
  private permission$ = new BehaviorSubject<string>('');
  private hasView = false;

  @Input() set appCan(permission: string) {
    this.permission$.next(permission);
  }

  constructor() {
    combineLatest([this.store.select(selectCurrentUser), this.permission$])
      .pipe(
        map(([user, permission]) => (permission === 'admin' ? !!user?.admin : userCan(user, permission))),
        distinctUntilChanged(),
        takeUntilDestroyed(inject(DestroyRef))
      )
      .subscribe((allowed) => {
        if (allowed && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else if (!allowed && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      });
  }
}
