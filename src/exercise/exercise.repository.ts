import ExercisesMock from './exercises.json' with { type: 'json' };
import { PropiedadesExercise, DifficultyLevelExercise } from './exercise.entity.js';

export class ExerciseRepository {
    private exercises: PropiedadesExercise[];

    constructor() {

        this.exercises = ExercisesMock.map((exercise) => ({
            ...exercise,
            difficultyLevel: exercise.difficultyLevel as DifficultyLevelExercise,
        }));
    }

    async getAllExercises(): Promise<PropiedadesExercise[]> {
        return Promise.resolve(this.exercises);
    }

    //FILTRADO DE EJERCICIOS POR GRUPO MUSCULAR
    //  async find(filter?: {muscleGroup?: string}): Promise<PropiedadesExercise[]> {
    //      if (!filter?.muscleGroup) return this.getAllExercises();

    //      const filteredExercises = filter.muscleGroup.trim().toLowerCase();
    //      return this.exercises.filter((e) => (e.muscleGroup ?? '').toLowerCase().includes(filteredExercises));
    // }

    async getExerciseById(id: number): Promise<PropiedadesExercise | null> {
        const exercise = this.exercises.find((e) => e.id === id);
        return Promise.resolve(exercise || null);
    }

    async create(
        propiedades: Omit<PropiedadesExercise, 'id'>
    ): Promise<PropiedadesExercise> {
        const newId = Math.max(...this.exercises.map((e) => e.id), 0) + 1;
        const newExercise: PropiedadesExercise = {
            id: newId,
            ...propiedades
        };
        this.exercises.push(newExercise);
        return Promise.resolve(newExercise);
    }

    async save(
        id: number,
        propiedades: Partial<PropiedadesExercise>
    ): Promise<PropiedadesExercise | null> {
        const exercise = this.exercises.find((e) => e.id === id);
        if (!exercise) return Promise.resolve(null);

        const updated = { ...exercise, ...propiedades };
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
