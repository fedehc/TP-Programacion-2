// Patrón State: cada estado solo decide las transiciones válidas, sin lógica de negocio.
import { TransicionEstadoInvalidaException } from "../Excepciones/exceptions";
import { EstadoVehiculo } from "../Extras/enums";
import Vehiculo from "./vehiculo";


/**
 * Clase abstracta base para los estados de un vehículo (Patrón State).
 * Define la interfaz y las transiciones válidas entre estados.
 * Cada subclase representa un estado concreto y decide qué transiciones permite.
 */
export default abstract class EstadoVehiculoState {
  /**
   * Devuelve el nombre del estado (ej: "disponible", "alquilado").
   */
  abstract getNombre(): string;

  /**
   * Devuelve el valor enum asociado al estado.
   */
  abstract estadoActual(): EstadoVehiculo;

  /**
   * Indica si el vehículo puede iniciar un alquiler en este estado.
   * @param vehiculo Vehículo a consultar
   * @returns true si puede, false si no
   */
  puedeIniciarAlquiler(vehiculo: Vehiculo): boolean { return false; }

  /**
   * Indica si el vehículo puede finalizar un alquiler en este estado.
   * @param vehiculo Vehículo a consultar
   * @returns true si puede, false si no
   */
  puedeFinalizarAlquiler(vehiculo: Vehiculo): boolean { return false; }

  /**
   * Indica si el vehículo puede ser liberado de mantenimiento en este estado.
   * @param vehiculo Vehículo a consultar
   * @returns true si puede, false si no
   */
  puedeLiberarDeMantenimiento(vehiculo: Vehiculo): boolean { return false; }

  /**
   * Intenta iniciar un alquiler. Lanza excepción si la transición no es válida.
   * @param vehiculo Vehículo a modificar
   * @throws TransicionEstadoInvalidaException si la transición no es válida
   */
  iniciarAlquiler(vehiculo: Vehiculo): void {
    throw new TransicionEstadoInvalidaException(this.getNombre(), "iniciar alquiler");
  }

  /**
   * Intenta finalizar un alquiler. Lanza excepción si la transición no es válida.
   * @param vehiculo Vehículo a modificar
   * @throws TransicionEstadoInvalidaException si la transición no es válida
   */
  finalizarAlquiler(vehiculo: Vehiculo): void {
    throw new TransicionEstadoInvalidaException(this.getNombre(), "finalizar alquiler");
  }

  /**
   * Intenta liberar el vehículo de mantenimiento. Lanza excepción si la transición no es válida.
   * @param vehiculo Vehículo a modificar
   * @throws TransicionEstadoInvalidaException si la transición no es válida
   */
  liberarDeMantenimiento(vehiculo: Vehiculo): void {
    throw new TransicionEstadoInvalidaException(this.getNombre(), "liberar de mantenimiento");
  }
}
