import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Usuario } from "src/app/_modulo/usuario";
import { RegistroService } from "src/app/_services/registro.service";


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  form:FormGroup;
  usuario:Usuario
  correo: string
  password: string
  hide = true
  constructor(private router: Router,
    private registroService: RegistroService,
    private snakBar:MatSnackBar) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'name': new FormControl(''),
      'apellidos': new FormControl(''),
      'username': new FormControl(''),
      'password': new FormControl(''),
    })

  }
  registrar(){
    this.usuario=new Usuario();

    this.usuario.username=this.form.value['username'];
    this.usuario.password=this.form.value['password'];
    this.usuario.enabled=true;

    this.registroService.registrar(this.usuario).subscribe(data=>{
      this.registroService.setMensajeCambio("Se ha registrado correctamente")
    })
    this.registroService.getMensajeCambio().subscribe(data=>{
      this.snakBar.open(data,"Cerrar",{duration:2000})
    })
    this.router.navigate(['/login'])
  }

  volver() {
    this.router.navigate(['/login'])
  }

}

