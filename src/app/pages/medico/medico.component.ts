import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Medico } from 'src/app/_modulo/medico';
import { MedicosService } from 'src/app/_services/medicos.service';
import { MedicoEdicionComponent } from './medico-edicion/medico-edicion.component';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})

export class MedicoComponent implements OnInit {

  origen: MatTableDataSource<Medico>;
  columnasAMostrar: String[] = ['idMedico', 'nombres', 'apellidos', 'cedula', 'acciones'];

  columnasChild: string[] = ['nombres', 'apellidos', 'cedula', 'fotoUrl'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  liveAnnouncer: LiveAnnouncer;

  constructor(private medicoService : MedicosService, 
    public dialog: MatDialog,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {

    this.medicoService.listar().subscribe(data => {
      this.origen = new MatTableDataSource(data);
      this.origen.sort = this.sort;
      this.origen.paginator = this.paginator;
    })

    this.medicoService.medicoCambiado.subscribe(data => {
      this.origen = new MatTableDataSource(data);
      this.origen.sort = this.sort;
      this.origen.paginator = this.paginator;
    })
  }

  openDialog(medico?:Medico) : void{

    const dialogref = this.dialog.open(MedicoEdicionComponent, {
      width: '500px', //tamaño del dialogo
      data: medico
    });

  }

  cambioFiltro(event: Sort){
    if (event.direction) {
      this.liveAnnouncer.announce(`Sorted ${event.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  eliminar(id:number){
    this.medicoService.eliminar(id).subscribe(()=>{
      this.medicoService.listar().subscribe(data=>{
        this.medicoService.setMedicoCambiado(data);
        this.medicoService.setMensajeCambiado("ELIMINADO");
      })
    })
    this.medicoService.getMensajeCambiado().subscribe(mensaje=>{
      this.snackBar.open(mensaje,"cerrar", {duration : 6000})
    })
  }

  buscar(event: Event) {
    // Se guarda el filtro del campo de búsqueda en una constante
    var filtro = (event.target as HTMLInputElement).value; 
    filtro= filtro.trim();
    // Se usa MatTableDataSource para buscar según el filtro
    // Opcional si se quiere usar .trim() o toLowerCase()
    this.origen.filter = filtro;
    // Si se encuentra se muestra como una página única
    if (this.origen.paginator) {
      this.origen.paginator.firstPage();
    }
  }
}