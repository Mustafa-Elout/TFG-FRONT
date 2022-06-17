import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Analitica } from 'src/app/_modulo/analitica';
import { Consulta } from 'src/app/_modulo/consulta';

import { DetalleConsulta } from 'src/app/_modulo/detalleConsulta';
import { Especialidad } from 'src/app/_modulo/especialidad';
import { Medico } from 'src/app/_modulo/medico';
import { Paciente } from 'src/app/_modulo/paciente';


import { EspecialidadService } from 'src/app/_services/especialidad.service';

import { PacientesService } from 'src/app/_services/pacientes.service';


import { MedicosService } from 'src/app/_services/medicos.service';
import { AnaliticasService } from 'src/app/_services/analiticas.service';
import { ConsultaService } from 'src/app/_services/consulta.service';
import { ConsultaListaExamenDTO } from 'src/app/_modulo/consultaListaExamenDTO';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  constructor(private pacienteService: PacientesService,
    private medicoService: MedicosService,
    private especialidadService: EspecialidadService,
    private examenService: AnaliticasService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar) { }

  idPacienteSeleccionado: number;
  idMedicoSeleccionado: number;
  idEspecialidadSeleccionada: number;
  analiticaSeleccionada: Analitica;
  fechaSeleccionada: Date = new Date();

  pacientes: Paciente[];
  pacientes$: Observable<Paciente[]>;
  // Forma de declarar un Observable
  medicos$: Observable<Medico[]>;
  especialidades$: Observable<Especialidad[]>;
  examenes$: Observable<Analitica[]>;

  examenSeleccionado: Analitica;


  maxFecha: Date = new Date();
  diagnostico: string;
  tratamiento: string;

  detalleConsulta: DetalleConsulta[] = [];
  examenesSelecccionados: Analitica[] = [];



  ngOnInit(): void {
    this.listarInicial();
  }

  listarInicial() {

    this.pacientes$ = this.pacienteService.listar();
    this.medicos$ = this.medicoService.listar();
    this.especialidades$ = this.especialidadService.listar();
    this.examenes$ = this.examenService.listar();
  }

  agregar() {
    if (this.diagnostico && this.tratamiento) {
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      this.detalleConsulta.push(det);
    } else {
      this.snackBar.open('Debe agregar un diagnostico y tratamiento', 'Aviso', { duration: 2000 });
    }
  }

  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);
  }

  agregarExamen() {
    if (this.examenSeleccionado) {
      let cont = 0;
      for (let i = 0; i < this.examenesSelecccionados.length; i++) {
        let examen = this.examenesSelecccionados[i];
        if (examen.idAnalitica === this.examenSeleccionado.idAnalitica) {
          cont++;
          break;
        }
      }
      if (cont > 0) {
        this.snackBar.open('El examen ya ha sido seleccionado', 'Aviso', { duration: 2000 });
      } else {
        this.examenesSelecccionados.push(this.examenSeleccionado);
      }
    }
  }

  removerExamen(index: number) {
    this.examenesSelecccionados.splice(index, 1);
  }

  aceptar() {
    let medico = new Medico();
    medico.idMedico = this.idMedicoSeleccionado;
   
    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    let especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionada;
    let consulta = new Consulta();
    consulta.medico = medico;
    consulta.paciente = paciente;
    consulta.especialidad = especialidad;
    // Forma de usar fechas con JS
    // let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    // let localISOTime = (new Date(this.fechaSeleccionada.getTime() - tzoffset)).toISOString();
    // consulta.fecha = localISOTime;

    //Usando la librería moment.js
    //Seguimos usando el formato ISO
    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    consulta.numConsultorio = "C1";
    consulta.detalleConsulta = this.detalleConsulta;
    let dto = new ConsultaListaExamenDTO();
    dto.consulta = consulta;
    dto.lstExamen = this.examenesSelecccionados;
    this.consultaService.registrarTransaccion(dto).subscribe(() => {
      this.snackBar.open('Se registró la consulta', 'Aviso', { duration: 2000 });
      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSelecccionados = [];
    this.diagnostico = null;
    this.tratamiento = null;
    this.idPacienteSeleccionado = 0;
    this.idEspecialidadSeleccionada = 0;
    this.idMedicoSeleccionado = 0;
    this.examenSeleccionado = null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
  }

}
