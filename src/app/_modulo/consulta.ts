import { DetalleConsulta } from "./detalleConsulta";
import { Especialidad } from "./especialidad";
import { Medico } from "./medico";
import { Paciente } from "./paciente";
export class Consulta {
    idConsulta: number;
    paciente: Paciente;
    medico: Medico;
    especialidad: Especialidad;
    // Se va a definir string porque así es el Json
    fecha: string;
    numConsultorio: string;
    detalleConsulta: DetalleConsulta[];
}
