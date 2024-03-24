import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NavigationService } from './navigation.service';
import { UserService } from './user.service';
import { BaseService } from './base.service';
import { Observable, map } from 'rxjs';
import { LocalStorage } from '../enum/local-storage.enum';


export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {

      const jwtHelper = inject(JwtHelperService);
      const router = inject(Router)

      const token = localStorage.getItem('jwt');

      if(token && !jwtHelper.isTokenExpired(token)) {
          return true;
      }

      router.navigate(['login']);
      return false;
}

// export const getPagePermission: CanActivateFn = (): boolean | Observable<boolean> => {
  
//         const navService = inject(NavigationService);
//         const userService = inject(UserService);
//         const baseService = inject(BaseService);
//         const router = inject(Router);

//         // const menuName = navService.selectedChildMenu.name;

//         const user = JSON.parse(localStorage.getItem(LocalStorage.UserDetails) || '{}');

//         return userService.getUserPermissions2(user.id)
//             .pipe(map(res => {
//                 baseService.pagePermission = res;
//                 if(res && res.readRt == true) {
//                     router.navigate(['/unauthorized']);
//                     return false
//                 }
//                 return true;
//             }));
//         // ({
//         //     next: (res) => {
//         //         baseService.pagePermission = res;
//         //         if(res && res.readRt == true){
//         //             router.navigate(['/unauthorized']);
//         //             return true
//         //         }
//         //         return false;
//         //     }
//         // });
//     }
