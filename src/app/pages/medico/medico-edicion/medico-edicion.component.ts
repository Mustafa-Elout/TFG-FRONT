import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Medico } from 'src/app/_modulo/medico';
import { MedicosService } from 'src/app/_services/medicos.service';

@Component({
  selector: 'app-medico-edicion',
  templateUrl: './medico-edicion.component.html',
  styleUrls: ['./medico-edicion.component.css']
})
export class MedicoEdicionComponent implements OnInit {

  edicion: boolean;
  medico:Medico;
  nombres: string = '';
  apellidos: string = '';
  cedula: string = '';
  fotoUrl: string = '';

  constructor(
    public dialogRef: MatDialogRef<MedicoEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Medico,
    private medicoService : MedicosService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {  }

  

  ngOnInit(): void {
    this.medico = { ...this.data};

    if(this.data){
      this.edicion=true;
    }else{
      this.edicion=false;
    }
  }

  cancelar() {
    this.dialogRef.close();
    this.router.navigate(['medico']);
  }

  agregar() {
    if(this.edicion){
      this.medicoService.modificar(this.medico).subscribe(() =>{
        this.medicoService.listar().subscribe(data => {
          this.medicoService.setMedicoCambiado(data);
          this.medicoService.setMensajeCambiado("SE MODIFICO");
        })
      })
      this.medicoService.getMensajeCambiado().subscribe(data =>{
        this.snackBar.open(data, 'CLOSE', {duration : 10000});
      })
    }else{
      this.medico = new Medico();
      this.medico.nombres=this.nombres;
      this.medico.apellidos=this.apellidos;
      this.medico.cedula=this.cedula;
      this.medico.fotoUrl=this.fotoUrl;
      this.medicoService.registrar(this.medico).pipe(switchMap(()=> {
        return this.medicoService.listar();
      }))
      .subscribe(data => {
        this.medicoService.medicoCambiado.next(data);
        this.medicoService.setMensajeCambiado("SE REGISTRO");
      })
      this.medicoService.getMensajeCambiado().subscribe(data =>{
        this.snackBar.open(data, 'CLOSE', {duration : 6000});
      })
    }
  }
}
