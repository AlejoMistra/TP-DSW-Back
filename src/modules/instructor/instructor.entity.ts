export interface InstructorProps {
  id: number;
  name: string;
  surname: string;
  //especialidad: string;
  email: string;
  phoneNumber: string;
}

export class Instructor {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;

  constructor(props: InstructorProps) {
    this.id = props.id;
    this.name = props.name;
    this.surname = props.surname;
    this.email = props.email;
    this.phoneNumber = props.phoneNumber;
  }
}
