
export interface PropiedadesSocio {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaIngreso: Date;
  estado: EstadosSocio;
}

export type EstadosSocio = 'activo' | 'inactivo';

export class Socio {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaIngreso: Date;
  estado: EstadosSocio;

  constructor(props: PropiedadesSocio) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.apellido = props.apellido;
    this.email = props.email;
    this.telefono = props.telefono;
    this.fechaIngreso = props.fechaIngreso;
    this.estado = props.estado;
  }
}