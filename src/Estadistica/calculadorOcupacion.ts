import { EstadoVehiculo } from "../Extras/enums";
import Vehiculo from "../Vehiculo/vehiculo";


export default class CalculadorOcupacion {
  private porcentaje: number = 0;
  private enAlquiler: number = 0;
  private total: number = 0;

  public contarEnAlquiler(vehiculos: Vehiculo[]): number {
    let contador = 0;
    for (let i = 0; i < vehiculos.length; i++) {
      if (vehiculos[i].getEstado() === EstadoVehiculo.alquiler) {
        contador++;
      }
    }
    return contador;
  }

  public calcularPorcentaje(enAlquiler: number, total: number): number {
    if (total === 0) {
      return 0;
    }
    return (enAlquiler / total) * 100;
  }

  public calcular(vehiculos: Vehiculo[]): void {
    this.total = vehiculos.length;
    this.enAlquiler = this.contarEnAlquiler(vehiculos);
    this.porcentaje = this.calcularPorcentaje(this.enAlquiler, this.total);
  }

  public obtenerOcupacion(): { porcentaje: number; enAlquiler: number; total: number } {
    return { porcentaje: this.porcentaje, enAlquiler: this.enAlquiler, total: this.total };
  }
}
