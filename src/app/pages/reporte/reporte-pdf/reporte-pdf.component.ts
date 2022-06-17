import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConsultaService } from 'src/app/_services/consulta.service';


@Component({
  selector: 'app-reporte-pdf',
  templateUrl: './reporte-pdf.component.html',
  styleUrls: ['./reporte-pdf.component.css']
})
export class ReportePDFComponent implements OnInit {

  constructor(private consultaService: ConsultaService,
    public dialogRef: MatDialogRef<ReportePDFComponent>,
    private router: Router) { }
  pdfSrc: any;

  ngOnInit(): void {
    this.verReporte();
  }

  verReporte() {
    this.consultaService.generarReporte().subscribe(data => {
      //Crear un fichero ficticio
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        //console.log(this.pdfSrc);
      };
      reader.readAsArrayBuffer(data);
    });
  }

  cancelar() {
    this.dialogRef.close();
    this.router.navigate(['reporte']);
  }

  descargarReporte() {
    this.consultaService.generarReporte().subscribe(data => {
      const url = window.URL.createObjectURL(data); //Crear url temporal
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'Reporte Consultas.pdf';
      a.click();
    });
  }

}
