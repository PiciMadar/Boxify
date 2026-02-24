import { CanActivateFn, Router } from '@angular/router';
import { AuthService} from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)
  const router = inject(Router)

  const role = route.data['role'] as string;
  
  if(authService.hasRole(role)){
    return true
  }
  else{
    router.navigate(['/home']);
    return false;
  }
};
