import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Analitica } from '../_modulo/analitica';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class AnaliticasService extends GenericService<Analitica> {

  public analiticaCambiado = new Subject<Analitica[]>();
  private mensajeCambiado = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(
      http, `${environment.HOST}/analiticas`
    );
  }

  getAnaliticaCambiado(){
    return this.analiticaCambiado.asObservable();
  }

  setAnaliticaCambiado(analitica:Analitica[]){
    this.analiticaCambiado.next(analitica);
  }

  getMensajeCambiado(){
    return this.mensajeCambiado.asObservable();
  }

  setMensajeCambiado(mensajeCambiado:string){
    this.mensajeCambiado.next(mensajeCambiado);
  }
}
