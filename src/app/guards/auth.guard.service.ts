import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {tap, from, map, Observable} from 'rxjs';
import {getDefaultSession, onSessionRestore} from '@inrupt/solid-client-authn-browser';
import {Store} from "@ngrx/store";
import {loggedInStatus} from "../selectors";
import {mergeMap} from "rxjs/operators";
import {CoreActions} from "../actions";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private store: Store,
  ) {
    onSessionRestore((currentUrl: string) => {
      const url = new URL(currentUrl)
      const requestedPath = url.pathname + url.search
      this.store.dispatch(CoreActions.pathRequested({ requestedPath }))
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return from(this.tryToRecoverSession()).pipe(
      mergeMap(() =>
        this.store.select(loggedInStatus) // TODO: login flashes since status changes from false to true
      ),
      map(status => status || this.router.parseUrl('login'))
    );
  }

  private async tryToRecoverSession(): Promise<void> {
    const session = getDefaultSession();

    if (session.info.isLoggedIn) {
      return;
    } else {
      const info = await session.handleIncomingRedirect({restorePreviousSession: true});
      this.store.dispatch(CoreActions.loginStatusChanged({loggedIn: !!info?.isLoggedIn}));
    }
  }
}
