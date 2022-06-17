import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Especialidad } from 'src/app/_modulo/especialidad';
import { EspecialidadService } from 'src/app/_services/especialidad.service';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
export class EspecialidadComponent implements OnInit {

  constructor(private especialidadService : EspecialidadService,
    private snackBar: MatSnackBar,) { }

  origen: MatTableDataSource<Especialidad>;
  columnasAMostrar: String[] = ['idEspecialidad', 'nombre', 'descripcion', 'acciones'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  liveAnnouncer: LiveAnnouncer;

  ngOnInit(): void {
    this.especialidadService.especialidadCambiado.subscribe(data => {
      this.origen = new MatTableDataSource(data);
      this.origen.sort = this.sort;
      this.origen.paginator = this.paginator;
    })

    this.especialidadService.listar().subscribe(data => {
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
    this.especialidadService.eliminar(id).subscribe(()=>{
      this.especialidadService.listar().subscribe(data=>{
        this.especialidadService.setEspecialidadCambiado(data);
        this.especialidadService.setMensajeCambiado("ELIMINADO");
      })
    })
    this.especialidadService.getMensajeCambiado().subscribe(mensaje=>{
      this.snackBar.open(mensaje,"cerrar", {duration : 6000})
    })
  }

  buscar(event: Event) {
    // Se guarda el filtro del campo de búsqueda en una constante
    var filtro = (event.target as HTMLInputElement).value;
    console.log(filtro);

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
