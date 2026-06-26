import SociosMock from './socios.json' with { type: 'json' }; //por ahora es un json con socios, depues una bd
import { PropiedadesSocio, EstadosSocio } from './socio.entity.js';

export class SocioRepository {
  private socios: PropiedadesSocio[];

  constructor() {
    //simula la carga de dados desde una BD a memoria
    this.socios = SociosMock.map((socio) => ({
      ...socio,
      fechaIngreso: new Date(socio.fechaIngreso),
      estado: socio.estado as EstadosSocio,
    }));
  }

  async getAllSocios(): Promise<PropiedadesSocio[]> {
    return Promise.resolve(this.socios);
  }

  async getSocioById(id: number): Promise<PropiedadesSocio | null> {
    const socio = this.socios.find((s) => s.id === id);
    return Promise.resolve(socio || null);
  }

  async create(
    propiedades: Omit<PropiedadesSocio, 'id'>,
  ): Promise<PropiedadesSocio> {
    const newId = Math.max(...this.socios.map((s) => s.id), 0) + 1;
    const newSocio: PropiedadesSocio = {
      id: newId,
      ...propiedades,
    };
    this.socios.push(newSocio);
    return Promise.resolve(newSocio);
  }

  async save(
    id: number,
    propiedades: Partial<PropiedadesSocio>,
  ): Promise<PropiedadesSocio | null> {
    const socio = this.socios.find((s) => s.id === id);
    if (!socio) return Promise.resolve(null);

    const updated = { ...socio, ...propiedades };
    const index = this.socios.findIndex((s) => s.id === id);
    this.socios[index] = updated;
    return Promise.resolve(updated);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.socios.findIndex((s) => s.id === id);
    if (index === -1) return Promise.resolve(false);

    this.socios.splice(index, 1);
    return Promise.resolve(true);
  }
}
