import { SocioRepository } from '../socio/socio.repository';
import { PropiedadesSocio } from './socio.entity';
import { CreateSocioInput, UpdateSocioInput } from './socio.schemas';

export class SocioService {
  constructor(private socioRepository: SocioRepository) {}

  async getAll() {
    //Aca va la logica de negocio, validaciones, etc. Por ejemplo ocultar algun dato o agregar algun campo calculado.

    return await this.socioRepository.getAllSocios();
  }

  async getById(id: number): Promise<PropiedadesSocio> {
    //Aca va la logica de negocio, validaciones, etc. Por ejemplo ocultar algun dato o agregar algun campo calculado.
    const socio = await this.socioRepository.getSocioById(id);
    if(!socio){
      throw new Error ('Socio no encontrado');
    }

    return await this.socioRepository.getSocioById(id);
  }

  async create(propiedades: CreateSocioInput): Promise<PropiedadesSocio> {
    const nuevoSocio = await this.socioRepository.create({
      ...propiedades,
      fechaIngreso: new Date(),
    });
    return nuevoSocio;
  }

  async update(
    id: number,
    propiedades: UpdateSocioInput,
  ): Promise<PropiedadesSocio | null> {
    const socioActualizado = await this.socioRepository.save(id, propiedades);
    return socioActualizado;
  }

  async delete(id: number): Promise<boolean> {
    return await this.socioRepository.delete(id);
  }
}
