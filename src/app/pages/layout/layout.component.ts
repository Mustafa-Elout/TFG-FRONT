import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Menu } from 'src/app/_modulo/menu'
import { LoginService } from 'src/app/_services/login.service';
import { MenuService } from 'src/app/_services/menu.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  user:string;

  constructor(
    private rutas: Router,
    private menuService: MenuService,
    private loginService: LoginService,
    ) { }

  menus : Menu[]

  ngOnInit(): void {

    this.menuService.getMenuCambio().subscribe(
      x=> this.menus = x
    )

    const helper = new JwtHelperService();

    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    let tokenDecodificado = helper.decodeToken(token);
    this.user = tokenDecodificado.user_name;

    this.menuService.listarPorUsuario(this.user).subscribe(  data=>    //sessionStorage.getItem("usuario")
    this.menuService.setMenuCambio(data));

  }

  navegar(url: string){
    this.rutas.navigate([url]);
  }

  cerrarSesion(){
    this.loginService.cerrarSesion();
  }
}
