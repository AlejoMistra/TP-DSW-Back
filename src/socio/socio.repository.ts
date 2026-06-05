import SociosMock from './socios.json'; //por ahora es un json con socios, depues una bd
import { PropiedadesSocio, EstadosSocio} from './socio.entity';

export class SocioRepository {
  private socios: PropiedadesSocio[]; 

  constructor() { //simula la carga de dados desde una BD a memoria
    this.socios = SociosMock.map(socio => ({
      ...socio,
      fechaIngreso: new Date(socio.fechaIngreso),
      estado: socio.estado as EstadosSocio
    }))
  }

  async getAllSocios(): Promise<PropiedadesSocio[]> {
    return Promise.resolve(this.socios);
  }

  async getSocioById(id: number): Promise<PropiedadesSocio | null> {
    const socio = this.socios.find(s => s.id === id);
    return Promise.resolve(socio || null);
  }
}