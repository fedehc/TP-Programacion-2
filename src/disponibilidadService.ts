import RangoDeFechas from "./rangoDeFechas";

export default class DisponibilidadService {

  static seSolapan(rango1: RangoDeFechas, rango2: RangoDeFechas): boolean {
    return rango1.getInicio() < rango2.getFin() && rango2.getInicio() < rango1.getFin();
  }
  static estaLibre(rangoPedido: RangoDeFechas, bloqueos: RangoDeFechas[]): boolean {
    for (const b of bloqueos) {
      if (this.seSolapan(rangoPedido, b)) {
        return false;
      }
    }
    return true;
  }
}

