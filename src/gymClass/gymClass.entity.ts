export interface GymClassProps {
  id: number;
  instructorId: number;
  name: string;
  description: string;
  category: GymClassCategory;
  maxNumber: number;
  durationMinutes: number;
}

export type GymClassCategory = 'yoga' | 'spinning' | 'crossfit' | 'pilates';

export class GymClass {
  id: number;
  instructorId: number;
  name: string;
  description: string;
  category: GymClassCategory;
  maxNumber: number;
  durationMinutes: number;

  constructor(props: GymClassProps) {
    this.id = props.id;
    this.instructorId = props.instructorId;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.maxNumber = props.maxNumber;
    this.durationMinutes = props.durationMinutes;
  }
}
