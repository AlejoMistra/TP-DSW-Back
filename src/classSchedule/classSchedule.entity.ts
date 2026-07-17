export enum GymClassCategory {
  YOGA = 'Yoga',
  SPINNING = 'Spinning',
  CROSSFIT = 'Crossfit',
  PILATES = 'Pilates',
}

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface ClassScheduleProps {
  id: number;
  name: string;
  description: string;
  category: GymClassCategory;
  maxNumber: number;
  durationMinutes: number;
  instructorId: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:MM" format
}

export class ClassSchedule {
  id: number;
  name: string;
  description: string;
  category: GymClassCategory;
  maxNumber: number;
  durationMinutes: number;
  instructorId: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:MM" format

  constructor(props: ClassScheduleProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.maxNumber = props.maxNumber;
    this.durationMinutes = props.durationMinutes;
    this.instructorId = props.instructorId;
    this.dayOfWeek = props.dayOfWeek;
    this.startTime = props.startTime;
  }
}
