import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Especialidad } from '../_modulo/especialidad';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService extends GenericService<Especialidad>{

  public especialidadCambiado = new Subject<Especialidad[]>();
  private mensajeCambiado = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(
      http, `${environment.HOST}/especialidades`
    );
  }

  getEspecialidadCambiado(){
    return this.especialidadCambiado.asObservable();
  }

  setEspecialidadCambiado(especialidad:Especialidad[]){
    this.especialidadCambiado.next(especialidad);
  }

  getMensajeCambiado(){
    return this.mensajeCambiado.asObservable();
  }

  setMensajeCambiado(mensajeCambiado:string){
    this.mensajeCambiado.next(mensajeCambiado);
  }
}
