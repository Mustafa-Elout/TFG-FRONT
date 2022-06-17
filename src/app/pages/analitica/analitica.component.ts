import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Analitica } from 'src/app/_modulo/analitica';
import { AnaliticasService } from 'src/app/_services/analiticas.service';

@Component({
  selector: 'app-analitica',
  templateUrl: './analitica.component.html',
  styleUrls: ['./analitica.component.css']
})
export class AnaliticaComponent implements OnInit {

  constructor(private analiticaService : AnaliticasService,
    private snackBar: MatSnackBar,) { }
    
  origen: MatTableDataSource<Analitica>;
  columnasAMostrar: String[] = ['idAnalitica', 'nombre', 'descripcion', 'acciones'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  liveAnnouncer: LiveAnnouncer;

  ngOnInit(): void {

    this.analiticaService.analiticaCambiado.subscribe(data => {
      this.origen = new MatTableDataSource(data);
      this.origen.sort = this.sort;
      this.origen.paginator = this.paginator;
    })

    this.analiticaService.listar().subscribe(data => {
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
    this.analiticaService.eliminar(id).subscribe(()=>{
      this.analiticaService.listar().subscribe(data=>{
        this.analiticaService.setAnaliticaCambiado(data);
        this.analiticaService.setMensajeCambiado("ELIMINADO");
      })
    })
    this.analiticaService.getMensajeCambiado().subscribe(data =>{
      this.snackBar.open(data, 'CLOSE', {duration : 6000});
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
