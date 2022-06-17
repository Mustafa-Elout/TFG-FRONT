import { REFERENCE_PREFIX } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Paciente } from 'src/app/_modulo/paciente';
import { PacientesService } from 'src/app/_services/pacientes.service';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacientesService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombres' : new FormControl(''),
      'apellidos' : new FormControl(''),
      'dni' : new FormControl(''),
      'direccion' : new FormControl(''),
      'telefono' : new FormControl(''),
      'email': new FormControl('')
    });
    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    })
  }

  initForm(){
    if (this.edicion) {
      
      this.pacienteService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id' : new FormControl(data.idPaciente),
          'nombres' : new FormControl(data.nombres),
          'apellidos' : new FormControl(data.apellidos),
          'dni' : new FormControl(data.dni),
          'direccion' : new FormControl(data.direccion),
          'telefono' : new FormControl(data.telefono),
          'email' : new FormControl(data.email)
        });
      })
    }
  }

  operar(){
    let paciente = new Paciente();

    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.direccion = this.form.value['direccion'];
    paciente.telefono = this.form.value['telefono'];
    paciente.email = this.form.value['email'];

    if(this.edicion){
      this.pacienteService.modificar(paciente).subscribe(() =>{
        this.pacienteService.listar().subscribe(data => {
          this.pacienteService.setPacienteCambiado(data);
          this.pacienteService.setMensajeCambiado("SE MODIFICO");
        })
      })

    }else{
      this.pacienteService.registrar(paciente).pipe(switchMap(()=> {
        return this.pacienteService.listar();
      }))
      .subscribe(data => {
        this.pacienteService.pacienteCambiado.next(data);
        this.pacienteService.setMensajeCambiado("SE REGISTRO");
      })
      this.pacienteService.getMensajeCambiado().subscribe(data =>{
        this.snackBar.open(data, 'CLOSE', {duration : 6000});
      })
    }
    this.router.navigate(['paciente']);
  }
  
}
