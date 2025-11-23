import { EstadoVehiculo } from "../Extras/enums";
import EstadoVehiculoState from "./estadoVehiculoState";
import Vehiculo from "./vehiculo";
import EnAlquilerState from "./enAlquilerState";

/**
 * Estado concreto: Vehículo disponible para alquiler.
 * Permite iniciar un alquiler y transicionar a EnAlquilerState.
 */
export default class DisponibleState extends EstadoVehiculoState {
  /**
   * Nombre del estado.
   */
  getNombre(): string { return "Disponible"; }

  /**
   * Valor enum asociado.
   */
  estadoActual(): EstadoVehiculo { return EstadoVehiculo.disponible; }

  /**
   * El vehículo puede iniciar un alquiler en este estado.
   */
  puedeIniciarAlquiler(vehiculo: Vehiculo): boolean { return true; }

  /**
   * Inicia un alquiler y cambia el estado a EnAlquilerState.
   */
  iniciarAlquiler(vehiculo: Vehiculo): void {
    vehiculo.cambiarEstado(new EnAlquilerState());
  }
}
