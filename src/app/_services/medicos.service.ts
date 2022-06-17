import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico } from '../_modulo/medico';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class MedicosService extends GenericService<Medico>{

  public medicoCambiado = new Subject<Medico[]>();
  private mensajeCambiado = new Subject<string>();

  constructor(protected override http : HttpClient) {
    super(
      http, `${environment.HOST}/medicos`
    )
   }
  
  getMedicoCambiado(){
    return this.medicoCambiado.asObservable();
  }

  setMedicoCambiado(medicos:Medico[]){
    this.medicoCambiado.next(medicos);
  }

  getMensajeCambiado(){
    return this.mensajeCambiado.asObservable();
  }

  setMensajeCambiado(mensajeCambiado:string){
    this.mensajeCambiado.next(mensajeCambiado);
  }
}
