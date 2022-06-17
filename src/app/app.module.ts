import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrganizarMaterialModule } from './organizar-material/organizar-material.module';
import { LayoutComponent } from './pages/layout/layout.component';
import { CommonModule } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Not404Component } from './not404/not404.component';
import { Not403Component } from './not403/not403.component';
import { RegistroComponent } from './registro/registro.component';



export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    Not403Component,
    Not404Component,
    RegistroComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    OrganizarMaterialModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.HOST.substring(7)],
        disallowedRoutes: [`${environment.HOST}/login/enviarCorreo`],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
