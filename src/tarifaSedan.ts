import Tarifa from "./tarifa";


export default class TarifaSedan implements Tarifa {
  constructor(
    private baseDia = 50,
    private porKm = 0.20
  ) { }


  calcularCosto(dias: number, kmRecorridos: number): number {
    const base = this.baseDia * dias;
    const variable = kmRecorridos * this.porKm;
    return base + variable;
  }
}