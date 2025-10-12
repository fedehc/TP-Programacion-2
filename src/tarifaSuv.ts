import Tarifa from "./tarifa";

export default  class TarifaSUV implements Tarifa {
  private baseDia = 80;
  private seguroDia = 15;
  private excedenteKm = 0.25;

  calcularCosto(dias: number, kmRecorridos: number): number {

    const base = this.baseDia * dias;
    const seguro = this.seguroDia * dias;

    const limite = 500;
    const exceso = Math.max(0, kmRecorridos - limite);
    const variable = exceso * this.excedenteKm;

    return base + seguro + variable;
  }
}