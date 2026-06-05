import { SocioRepository } from '../repository/socio.repository';
import { PropiedadesSocio } from '../types';

export class SocioService {
  
  constructor(private socioRepository: SocioRepository) {}

  async getAll() {
    //Aca va la logica de negocio, validaciones, etc. Por ejemplo ocultar algun dato o agregar algun campo calculado.

    return await this.socioRepository.getAllSocios();
  }

  async getById(id: number): Promise<PropiedadesSocio | null> {
    //Aca va la logica de negocio, validaciones, etc. Por ejemplo ocultar algun dato o agregar algun campo calculado.

    return await this.socioRepository.getSocioById(id);
  }}