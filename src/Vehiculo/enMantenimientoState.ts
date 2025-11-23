import EstadoVehiculoState from "./estadoVehiculoState";
import { EstadoVehiculo } from "../Extras/enums";
import DisponibleState from "./disponibleState";
import Vehiculo from "./vehiculo";

/**
 * Estado concreto: Vehículo en mantenimiento.
 * Permite liberar el vehículo y transicionar a DisponibleState.
 */
export default class EnMantenimientoState extends EstadoVehiculoState {
  /**
   * Nombre del estado.
   */
  getNombre(): string { return "En Mantenimiento"; }

  /**
   * Valor enum asociado.
   */
  estadoActual(): EstadoVehiculo { return EstadoVehiculo.mantenimiento; }

  /**
   * El vehículo puede ser liberado de mantenimiento en este estado.
   */
  puedeLiberarDeMantenimiento(vehiculo: Vehiculo): boolean { return true; }

  /**
   * Libera el vehículo de mantenimiento y cambia el estado a DisponibleState.
   */
  liberarDeMantenimiento(vehiculo: Vehiculo): void {
    vehiculo.cambiarEstado(new DisponibleState());
  }
}
