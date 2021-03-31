import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from './component-can-deactivate';

@Injectable({
  providedIn: 'root'
})
export class DirtycheckGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(
    component: ComponentCanDeactivate,
    currentroute: ActivatedRouteSnapshot,
    currentstate: RouterStateSnapshot,
    nextstate?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.canDeactivate()){
      return true;
    }
    else{
      return confirm("There are some unsaved changes on this page.\n Are you sure you want to leave this page?");
    }
  }
  
}
