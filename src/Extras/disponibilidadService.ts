import RangoDeFechas from "./rangoDeFechas";

export default class DisponibilidadService {
  static estaLibre(rangoPedido: RangoDeFechas, bloqueos: RangoDeFechas[]): boolean {
    for (const b of bloqueos) {
      if (b.seSuperponeConOtraFecha(rangoPedido)) {
        return false;
      }
    }
    return true;
  }
}

