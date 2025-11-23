
import { EstadoVehiculo } from "../Extras/enums";
import EnMantenimientoState from "./enMantenimientoState";
import EstadoVehiculoState from "./estadoVehiculoState";
import Vehiculo from "./vehiculo";
import DisponibleState from "./disponibleState";


/**
 * Estado concreto: Vehículo actualmente en alquiler.
 * Permite finalizar el alquiler y transicionar a Disponible o EnMantenimiento.
 */
export default class EnAlquilerState extends EstadoVehiculoState {
  /**
   * Nombre del estado.
   */
  getNombre(): string { return "En Alquiler"; }

  /**
   * Valor enum asociado.
   */
  estadoActual(): EstadoVehiculo { return EstadoVehiculo.alquiler; }

  /**
   * El vehículo puede finalizar el alquiler en este estado.
   */
  puedeFinalizarAlquiler(vehiculo: Vehiculo): boolean { return true; }

  /**
   * Finaliza el alquiler y cambia el estado a Disponible o EnMantenimiento según corresponda.
   */
  finalizarAlquiler(vehiculo: Vehiculo): void {
    if (vehiculo.getRequiereMantenimiento()) {
      vehiculo.cambiarEstado(new EnMantenimientoState());
    } else {
      vehiculo.cambiarEstado(new DisponibleState());
    }
  }
}
