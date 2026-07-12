export interface ClassProps {
  id: number;
  instructorId: number;
  name: string;
  description: string;
  category: ClassCategory;
  maxNumber: number;
  durationMinutes: number;
}

export type ClassCategory = 'Yoga' | 'Spinning' | 'Crossfit' | 'Pilates';

export class Class {
  id: number;
  instructorId: number;
  name: string;
  description: string;
  category: ClassCategory;
  maxNumber: number;
  durationMinutes: number;

  constructor(props: ClassProps) {
    this.id = props.id;
    this.instructorId = props.instructorId;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.maxNumber = props.maxNumber;
    this.durationMinutes = props.durationMinutes;
  }
}
