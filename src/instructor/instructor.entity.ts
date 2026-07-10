export interface InstructorProps {
  id: number;
  nombre: string;
  apellido: string;
  //especialidad: string;
  email: string;
}


export class Instructor {
  id: number;
  nombre: string;
  apellido: string;
  //especialidad: string;
  email: string;

  constructor(props: InstructorProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.apellido = props.apellido;
    this.email = props.email;
    //this.especialidad = props.especialidad;
  }
}