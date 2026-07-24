import { ExerciseRepository } from './exercise.repository.js';
import { PropiedadesExercise } from './exercise.entity.js';
import {
  CreateExerciseInput,
  ExerciseResponse,
  ExerciseResponseSchema,
  UpdateExerciseInput,
} from './exercise.schemas.js';

export class ExerciseService {
  constructor(private exerciseRepository: ExerciseRepository) {}

  //PARA EL FILTRADO DE EJERCICIOS POR GRUPO MUSCULAR
  // async getAll(filter?: { muscleGroup?: string }): Promise<ExerciseResponse[]> {
  //  const items = await this.exerciseRepository.find(filter);
  //  if (!items || items.length === 0) {
  //     throw new Error('No se encontraron ejercicios');
  //  }
  //  return items.map((it) => ExerciseResponseSchema.parse(it)) as ExerciseResponse[];
  // }

  async getAll() {
    //Aca va la logica de negocio, validaciones, etc. Por ejemplo ocultar algun dato o agregar algun campo calculado.
    return await this.exerciseRepository.getAllExercises();
  }

  async getById(id: number): Promise<PropiedadesExercise> {
    //Aca va la logica de negocio, validaciones, etc. Por ejemplo ocultar algun dato o agregar algun campo calculado.
    const exercise = await this.exerciseRepository.getExerciseById(id);
    if (!exercise) {
      throw new Error('Ejercicio no encontrado');
    }
    return exercise;
  }

  async create(props: CreateExerciseInput): Promise<PropiedadesExercise> {
    const newExercise = await this.exerciseRepository.create(props);
    return newExercise;
  }

  async update(
    id: number,
    props: UpdateExerciseInput,
  ): Promise<PropiedadesExercise> {
    const updatedExercise = await this.exerciseRepository.save(id, props);
    if (!updatedExercise) {
      throw new Error('Ejercicio no encontrado');
    }
    return updatedExercise;
  }

  async delete(id: number): Promise<boolean> {
    return await this.exerciseRepository.delete(id);
  }
}
