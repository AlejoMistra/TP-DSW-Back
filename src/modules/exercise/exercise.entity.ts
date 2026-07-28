export interface ExerciseProps {
  id: number;
  name: string;
  description: string;
  muscleGroup: string;
  difficultyLevel: DifficultyLevelExercise;
}

export type DifficultyLevelExercise = 'beginner' | 'intermediate' | 'advanced';

export class Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: string;
  difficultyLevel: DifficultyLevelExercise;

  constructor(props: ExerciseProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.muscleGroup = props.muscleGroup;
    this.difficultyLevel = props.difficultyLevel;
  }
}
