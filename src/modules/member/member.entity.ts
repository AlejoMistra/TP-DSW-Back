export interface MemberProps {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  joinDate: Date;
  status: MemberStatus;
}

export type MemberStatus = 'active' | 'inactive';

export class Socio {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  joinDate: Date;
  status: MemberStatus;

  constructor(props: MemberProps) {
    this.id = props.id;
    this.name = props.name;
    this.surname = props.surname;
    this.email = props.email;
    this.phoneNumber = props.phoneNumber;
    this.joinDate = props.joinDate;
    this.status = props.status;
  }
}