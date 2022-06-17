import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paciente } from '../_modulo/paciente';
import { GenericService } from './generic.service';
@Injectable({
  providedIn: 'root'
})
export class PacientesService extends GenericService<Paciente>{

  public pacienteCambiado = new Subject<Paciente[]>();
  private mensajeCambiado = new Subject<string>();

  constructor(protected override http: HttpClient) { 
    super(
      http, `${environment.HOST}/pacientes`
    );
  }

  getPacienteCambiado(){
    return this.pacienteCambiado.asObservable();
  }

  setPacienteCambiado(pacientes:Paciente[]){
    this.pacienteCambiado.next(pacientes);
  }

  getMensajeCambiado(){
    return this.mensajeCambiado.asObservable();
  }

  setMensajeCambiado(mensajeCambiado:string){
    this.mensajeCambiado.next(mensajeCambiado);
  }
}