import { EstadoVehiculo } from "../Extras/enums";
import Vehiculo from "../Vehiculo/vehiculo";
import ICalculadorOcupacion from "./ICalculadorOcupacion";


/**
 * Calcula la ocupación de la flota de vehículos.
 * Permite obtener el porcentaje de vehículos en alquiler y el total.
 * @implements {ICalculadorOcupacion}
 */
export default class CalculadorOcupacion implements ICalculadorOcupacion {
  private porcentaje: number = 0;
  private enAlquiler: number = 0;
  private total: number = 0;

  /**
   * Cuenta la cantidad de vehículos en alquiler.
   * @param {Vehiculo[]} vehiculos Lista de vehículos.
   * @returns {number} Cantidad de vehículos en alquiler.
   */
  private contarEnAlquiler(vehiculos: Vehiculo[]): number {
    let contador = 0;
    for (let i = 0; i < vehiculos.length; i++) {
      if (vehiculos[i].getEstado() === EstadoVehiculo.alquiler) {
        contador++;
      }
    }
    return contador;
  }

  /**
   * Calcula el porcentaje de vehículos en alquiler.
   * @param {number} enAlquiler Cantidad de vehículos en alquiler.
   * @param {number} total Total de vehículos.
   * @returns {number} Porcentaje de ocupación.
   */
  private calcularPorcentaje(enAlquiler: number, total: number): number {
    if (total === 0) {
      return 0;
    }
    return (enAlquiler / total) * 100;
  }

  /**
   * Calcula la ocupación de la flota.
   * @param {Vehiculo[]} vehiculos Lista de vehículos.
   * @returns {void}
   */
  public calcular(vehiculos: Vehiculo[]): void {
    this.total = vehiculos.length;
    this.enAlquiler = this.contarEnAlquiler(vehiculos);
    this.porcentaje = this.calcularPorcentaje(this.enAlquiler, this.total);
  }

  /**
   * Devuelve el porcentaje de ocupación, cantidad en alquiler y total de vehículos.
   * @returns {{ porcentaje: number, enAlquiler: number, total: number }} Objeto con datos de ocupación.
   */
  public obtenerOcupacion(): { porcentaje: number; enAlquiler: number; total: number } {
    return { porcentaje: this.porcentaje, enAlquiler: this.enAlquiler, total: this.total };
  }
}
