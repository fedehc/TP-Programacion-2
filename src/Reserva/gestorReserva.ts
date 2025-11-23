import { VehiculoNoDisponibleException } from "../Excepciones/exceptions";
import { EstadoReserva } from "../Extras/enums";
import RangoDeFechas from "../Extras/rangoDeFechas";
import Vehiculo from "../Vehiculo/vehiculo";
import Reserva from "./reserva";



/**
 * Gestor de reservas: administra la creación, confirmación, cancelación y listado de reservas.
 *
 * Responsabilidad principal: orquestar el ciclo de vida de una reserva y su relación con vehículos.
 *
 * Ejemplo de uso:
 * ```ts
 * const gestor = new GestorReserva();
 * const reserva = gestor.crearPendiente("CLI-1", fechaInicio, fechaFin);
 * gestor.confirmar(reserva, vehiculo);
 * ```
 */
export default class GestorReserva {
  private reservas: Reserva[] = [];

  public agregar(reserva: Reserva): void {
    this.reservas.push(reserva);
  }

  /**
   * Crea una reserva en estado pendiente (no la agrega al listado).
   *
   * @param clienteId - ID del cliente
   * @param fechaInicio - Fecha de inicio de la reserva
   * @param fechaFin - Fecha de fin de la reserva
   * @returns Reserva pendiente
   */
  public crearPendiente(clienteId: string, fechaInicio: Date, fechaFin: Date): Reserva {
    const rango = new RangoDeFechas(fechaInicio, fechaFin);
    const nueva = new Reserva(this.generarIdReserva(), clienteId, rango);
    return nueva;
  }

  /**
   * Confirma una reserva con un vehículo disponible o la cancela si no hay vehículo.
   *
   * @param reserva - Reserva a confirmar
   * @param vehiculo - Vehículo asignado o null
   * @returns Reserva confirmada o cancelada
   */
  public confirmar(reserva: Reserva, vehiculo: Vehiculo | null): Reserva {
    if (vehiculo) {
      this.confirmarConVehiculo(reserva, vehiculo);
    } else {
      this.cancelarReserva(reserva);
    }
    return reserva;
  }

  /**
   * Cancela una reserva y libera el vehículo si corresponde.
   *
   * @param reserva - Reserva a cancelar
   */
  public cancelar(reserva: Reserva): void {
    const vehiculo = reserva.getVehiculo();
    if (vehiculo) {
      vehiculo.desbloquear(reserva.getRango());
    }
    reserva.cancelar();
  }

  /**
   * Devuelve el listado de reservas gestionadas.
   *
   * @returns Reservas
   */
  public listar(): Reserva[] {
    return this.reservas;
  }

  /**
   * Genera un identificador único para una reserva.
   *
   * @returns ID de reserva
   */
  private generarIdReserva(): string {
    return "R-" + Date.now();
  }

  /**
   * Confirma la reserva asociando y bloqueando el vehículo, y agrega la reserva al listado.
   *
   * @param reserva - Reserva a confirmar
   * @param vehiculo - Vehículo a asociar
   * @throws VehiculoNoDisponibleException si el vehículo no está disponible
   */
  private confirmarConVehiculo(reserva: Reserva, vehiculo: Vehiculo): void {
    if (!vehiculo.estaDisponible(reserva.getRango())) {
      throw new VehiculoNoDisponibleException();
    }
    reserva.confirmarConVehiculo(vehiculo);
    vehiculo.bloquear(reserva.getRango());
    this.reservas.push(reserva);
  }

  private cancelarReserva(reserva: Reserva): void {
    reserva.cancelar();
  }
}