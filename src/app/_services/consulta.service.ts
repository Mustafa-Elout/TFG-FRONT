import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsultaListaExamenDTO } from '../_modulo/consultaListaExamenDTO';


@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private url: string = `${environment.HOST}/consultas`;
  constructor(
    private http: HttpClient
  ) { }
  listarResumen() {
    return this.http.get<any[]>(`${this.url}/listarResumen`);
  }

  generarReporte(){
    return this.http.get(`${this.url}/generarReporte`,{responseType:'blob'})
  }

  registrarTransaccion(consultaDTO: ConsultaListaExamenDTO){
    return this.http.post(this.url, consultaDTO);
  }
}
