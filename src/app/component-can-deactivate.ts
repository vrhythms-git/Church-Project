import { Observable } from "rxjs";

export interface ComponentCanDeactivate {
    canDeactivate:() => Boolean | Observable<boolean>
}
