import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/_modulo/paciente';
import { PacientesService } from 'src/app/_services/pacientes.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  constructor(private pacienteService : PacientesService,
    private snackBar: MatSnackBar,) { }
    
  origen: MatTableDataSource<Paciente>;
  columnasAMostrar: String[] = ['idPaciente', 'nombres', 'apellidos', 'acciones'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  liveAnnouncer: LiveAnnouncer;

  ngOnInit(): void {

    this.pacienteService.pacienteCambiado.subscribe(data => {
      this.origen = new MatTableDataSource(data);
      this.origen.sort = this.sort;
      this.origen.paginator = this.paginator;
    })

    this.pacienteService.listar().subscribe(data => {
      this.origen = new MatTableDataSource(data);
      this.origen.sort = this.sort;
      this.origen.paginator = this.paginator;
    })
  }

  cambioFiltro(event: Sort){
    if (event.direction) {
      this.liveAnnouncer.announce(`Sorted ${event.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  eliminar(id:number){
    this.pacienteService.eliminar(id).subscribe(()=>{
      this.pacienteService.listar().subscribe(data=>{
        this.pacienteService.setPacienteCambiado(data);
        this.pacienteService.setMensajeCambiado("ELIMINADO");
      })
    })
    this.pacienteService.getMensajeCambiado().subscribe(mensaje=>{
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
