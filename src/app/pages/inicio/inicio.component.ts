import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MenuService } from 'src/app/_services/menu.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  user:string;

  constructor(private menuService : MenuService) { }

  ngOnInit(): void {

    const helper = new JwtHelperService();

    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    let tokenDecodificado = helper.decodeToken(token);
    this.user = tokenDecodificado.user_name;

  }

}
