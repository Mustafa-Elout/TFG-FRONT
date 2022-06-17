import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Menu } from '../_modulo/menu';
import { LoginService } from './login.service';
import { MenuService } from './menu.service';
@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {
  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //1) Verificar ue esta logueado
    let rpta = this.loginService.estaLogueado();
    if (!rpta) {
      this.loginService.cerrarSesion();
      return false;
    } else {
      //2)Verificar si el token no ha expirado
      const helper = new JwtHelperService();
      let token = sessionStorage.getItem(environment.TOKEN_NAME);
      if (!helper.isTokenExpired(token)) {
        //3)Verifica si tienes el rol necesario para acceder a esa pagina
        //url -< /pages/pacientes
        let url = state.url;
        //este se tiene que verificar con la bbdd
        const decodedToken = helper.decodeToken(token);
        //dentro de un guard no hayq eu suscribirse ya que necesita ser en el momento
        return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map((data:Menu[]) => {
          this.menuService.setMenuCambio(data);
          let cont = 0;
          for (let m of data) {
            if (url.startsWith(m.url)) {
              cont ++;
              break;
            }
          }
          if (cont > 0) {
            return true;
          } else {
            this.router.navigate(['/not-403']);
            return false;
          }
        }));
      } else {
        this.loginService.cerrarSesion();
        return false;
      }
    }
  }
}
