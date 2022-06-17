import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Analitica } from 'src/app/_modulo/analitica';
import { AnaliticasService } from 'src/app/_services/analiticas.service';

@Component({
  selector: 'app-analitica-edicion',
  templateUrl: './analitica-edicion.component.html',
  styleUrls: ['./analitica-edicion.component.css']
})
export class AnaliticaEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  constructor(
    private analiticaService : AnaliticasService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,) { }


  ngOnInit(): void {

    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl(''),
      'descripcion' : new FormControl(''),
    });
    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    })
  }

  initForm(){
    if (this.edicion) {
      
      this.analiticaService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id' : new FormControl(data.idAnalitica),
          'nombres' : new FormControl(data.nombre),
          'descripcion' : new FormControl(data.descripcion)
        });
      })
    }
  }

  operar(){
    let analitica = new Analitica();

    analitica.idAnalitica = this.form.value['id'];
    analitica.nombre = this.form.value['nombre'];
    analitica.descripcion = this.form.value['descripcion'];

    if(this.edicion){
      this.analiticaService.modificar(analitica).subscribe(() =>{
        this.analiticaService.listar().subscribe(data => {
          this.analiticaService.setAnaliticaCambiado(data);
          this.analiticaService.setMensajeCambiado("SE MODIFICO");
        })
      })

    }else{
      this.analiticaService.registrar(analitica).pipe(switchMap(()=> {
        return this.analiticaService.listar();
      }))
      .subscribe(data => {
        this.analiticaService.analiticaCambiado.next(data);
        this.analiticaService.setMensajeCambiado("SE REGISTRO");
      })
      this.analiticaService.getMensajeCambiado().subscribe(data =>{
        this.snackBar.open(data, 'CLOSE', {duration : 6000});
      })
    }
    this.router.navigate(['analitica']);
  }

}
