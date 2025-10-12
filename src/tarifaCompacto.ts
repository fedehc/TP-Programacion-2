import Tarifa from "./tarifa";


export default class TarifaCompacto implements Tarifa {
  constructor(
    private baseDia = 30,
    private excedenteKm = 0.15
  ) { }


  calcularCosto(dias: number, kmRecorridos: number): number {
    const base = this.baseDia * dias;
    const limite = 100 * dias;
    const exceso = Math.max(0, kmRecorridos - limite);
    const variable = exceso * this.excedenteKm;
    return base + variable;
  }
}