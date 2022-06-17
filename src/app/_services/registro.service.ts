import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../_modulo/usuario';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroService extends GenericService<Usuario>{
  private cambio= new Subject<Usuario[]>();
  private mensajeCambio= new Subject<string>();
  constructor(protected override http:HttpClient) {

    super(
      http,`${environment.HOST}/usuarios`
    );
   }

   getCambio(){
    return this.cambio.asObservable();
  }

  setCambio(analiticas:Usuario[]){
    this.cambio.next(analiticas);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje:string){
    this.mensajeCambio.next(mensaje);
  }
}
