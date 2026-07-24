export interface PlanProps {
  id: number;
  name: string;
  description: string;
  price: number;
  durationDays: number;
}

export class MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  durationDays: number;

  constructor(props: PlanProps) {
    this.id = props.id;
    this.description = props.description;
    this.name = props.name;
    this.price = props.price;
    this.durationDays = props.durationDays;
  }
}