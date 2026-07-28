import { Repository } from '../../shared/base.repository.js';
import ExercisesMock from './exercises.json' with { type: 'json' };
import { ExerciseProps, DifficultyLevelExercise } from './exercise.entity.js';

export class ExerciseRepository implements Repository<ExerciseProps> {
  private exercises: ExerciseProps[];

  constructor() {
    this.exercises = ExercisesMock.map((exercise) => ({
      ...exercise,
      difficultyLevel: exercise.difficultyLevel as DifficultyLevelExercise,
    }));
  }

  async getAll(): Promise<ExerciseProps[]> {
    return Promise.resolve(this.exercises);
  }

  //FILTRADO DE EJERCICIOS POR GRUPO MUSCULAR
  //  async find(filter?: {muscleGroup?: string}): Promise<PropiedadesExercise[]> {
  //      if (!filter?.muscleGroup) return this.getAllExercises();

  //      const filteredExercises = filter.muscleGroup.trim().toLowerCase();
  //      return this.exercises.filter((e) => (e.muscleGroup ?? '').toLowerCase().includes(filteredExercises));
  // }

  async getOne(id: number): Promise<ExerciseProps | undefined> {
    const exercise = this.exercises.find((e) => e.id === id);
    return Promise.resolve(exercise || undefined);
  }

  async add(item: Omit<ExerciseProps, 'id'>): Promise<ExerciseProps> {
    const newId = Math.max(...this.exercises.map((e) => e.id), 0) + 1;
    const newExercise: ExerciseProps = {
      id: newId,
      ...item,
    };
    this.exercises.push(newExercise);
    return Promise.resolve(newExercise);
  }

  async update(
    id: number,
    item: Partial<Omit<ExerciseProps, 'id'>>,
  ): Promise<ExerciseProps | undefined> {
    const exercise = this.exercises.find((e) => e.id === id);
    if (!exercise) return Promise.resolve(undefined);

    const updated = { ...exercise, ...item };
    const index = this.exercises.findIndex((e) => e.id === id);
    this.exercises[index] = updated;
    return Promise.resolve(updated);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.exercises.findIndex((e) => e.id === id);
    if (index === -1) return Promise.resolve(false);

    this.exercises.splice(index, 1);
    return Promise.resolve(true);
  }
}
