import { SocioRepository } from '../socio/socio.repository';
import { PropiedadesSocio } from './socio.entity';

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

    return socio;
  }
}
