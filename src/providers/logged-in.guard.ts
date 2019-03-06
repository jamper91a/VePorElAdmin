import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import { Util } from './util';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(
      public util:Util,
      private router: Router
  ) {

  }


  canActivate(): boolean {
      console.log("Ingrese a canactivate");
        if(this.util.isLoggedIn()){
	    	return true;
        }else{
            this.router.navigate(['/pages/login']);
            return false;
		}
	}
  
}