import Alquiler from "./alquiler";
import Reserva from "../Reserva/reserva";
import Vehiculo from "../Vehiculo/vehiculo";
import ISelectorTemporada from "../Temporada/ISelector.temporada";
import { IReglaMantenimiento } from "../Mantenimiento/IReglaMantenimiento";
import { TransicionEstadoInvalidaException } from "../Excepciones/exceptions";


/**
 * Gestiona el ciclo de vida de los alquileres, incluyendo la creación, inicio y finalización,
 * así como la evaluación de mantenimiento y el manejo de estados de los vehículos.
 */
export default class GestorAlquiler {
  constructor(
    private readonly reglaMantenimiento: IReglaMantenimiento,
    private readonly selector: ISelectorTemporada,
    private alquileres: Alquiler[] = []
  ) { }


  /**
   * Devuelve la lista de alquileres gestionados actualmente.
   * @returns {Alquiler[]} Lista de alquileres
   */
  public listar(): Alquiler[] {
    return this.alquileres;
  }

  /**
   * Inicia un nuevo alquiler a partir de una reserva y un vehículo, cambiando el estado del vehículo y la reserva.
   * @param {Reserva} reserva Reserva a cumplir
   * @param {Vehiculo} vehiculo Vehículo a alquilar
   * @returns {Alquiler} El alquiler iniciado
   */
  private iniciarAlquiler(reserva: Reserva, vehiculo: Vehiculo): Alquiler {
    const estado = vehiculo.getEstadoState();
    const alquiler = new Alquiler( `A-${Date.now()}`, reserva, vehiculo, reserva.getClienteId(),reserva.getRango(), vehiculo.getKilometraje(), this.selector);
    reserva.marcarCumplida();
    estado.iniciarAlquiler(vehiculo);
    this.alquileres.push(alquiler);
    return alquiler;
  }

  /**
   * Inicia todos los alquileres programados para el día actual a partir de una lista de reservas.
   * Solo inicia aquellos que cumplen las condiciones necesarias.
   * @param {Reserva[]} reservas Reservas a evaluar
   * @param {Date} [fechaActual] Fecha actual (por defecto, hoy)
   * @returns {Alquiler[]} Lista de alquileres iniciados
   */
  public iniciarAlquileresProgramadosDelDia(reservas: Reserva[], fechaActual: Date = new Date()): Alquiler[] {
    const iniciados: Alquiler[] = [];
    for (const reserva of reservas) {
      const vehiculo = reserva.getVehiculo();
      if ( vehiculo && reserva.getRango().esMismoDiaQueInicio(fechaActual) && reserva.puedeIniciarAlquiler() && vehiculo.getEstadoState().puedeIniciarAlquiler(vehiculo)) {
        iniciados.push(this.iniciarAlquiler(reserva, vehiculo));
      }
    }
    return iniciados;
  }

  /**
   * Finaliza un alquiler, libera el vehículo y evalúa si requiere mantenimiento.
   * Actualiza el estado del vehículo según corresponda.
   * @param {Alquiler} alquiler Alquiler a finalizar
   * @param {number} kmFinal Kilometraje final del vehículo
   * @param {Date} [fechaActual] Fecha de finalización (por defecto, hoy)
   */
  public finalizar(alquiler: Alquiler, kmFinal: number, fechaActual: Date = new Date()): void {
    const vehiculo = alquiler.getVehiculo();
    this.finalizarAlquilerYLiberarBloqueo(alquiler, kmFinal);
    const necesitaMantenimiento = this.evaluarSiNecesitaMantenimiento(vehiculo, kmFinal, fechaActual);
    this.actualizarEstadoDelVehiculo(vehiculo, kmFinal, necesitaMantenimiento, fechaActual);
  }

  /**
   * Finaliza el alquiler y desbloquea el rango de fechas del vehículo asociado.
   * @param {Alquiler} alquiler Alquiler a finalizar
   * @param {number} kilometrajeFinal Kilometraje final registrado
   */
  private finalizarAlquilerYLiberarBloqueo(alquiler: Alquiler, kilometrajeFinal: number): void {
    alquiler.finalizar(kilometrajeFinal);
    const vehiculo = alquiler.getVehiculo();
    vehiculo.desbloquear(alquiler.getRango());
  }

  /**
   * Evalúa si el vehículo requiere mantenimiento según la regla configurada.
   * @param {Vehiculo} vehiculo Vehículo a evaluar
   * @param {number} kilometrajeFinal Kilometraje final
   * @param {Date} fecha Fecha de evaluación
   * @returns {boolean} True si requiere mantenimiento, false en caso contrario
   */
  private evaluarSiNecesitaMantenimiento(vehiculo: Vehiculo, kilometrajeFinal: number, fecha: Date): boolean {
    const fichaDelVehiculo = vehiculo.getFichaMantenimiento();
    return this.reglaMantenimiento.requiere(fecha, kilometrajeFinal, fichaDelVehiculo);
  }

  /**
   * Actualiza el estado del vehículo tras finalizar un alquiler, considerando si requiere mantenimiento.
   * Lanza excepción si la transición de estado no es válida.
   * @param {Vehiculo} vehiculo Vehículo a actualizar
   * @param {number} kilometrajeFinal Kilometraje final
   * @param {boolean} necesitaMantenimiento Indica si requiere mantenimiento
   * @param {Date} fechaActual Fecha de actualización
   * @throws {TransicionEstadoInvalidaException} Si la transición de estado no es válida
   */
  private actualizarEstadoDelVehiculo(vehiculo: Vehiculo,kilometrajeFinal: number,necesitaMantenimiento: boolean,fechaActual: Date): void {
    const estadoActual = vehiculo.getEstadoState();
    if (!estadoActual.puedeFinalizarAlquiler(vehiculo)) {
      throw new TransicionEstadoInvalidaException(
        estadoActual.getNombre(),
        `finalizar alquiler en vehículo ${vehiculo.getMatricula()}`
      );
    }
    vehiculo.registrarFinalizacion(kilometrajeFinal, necesitaMantenimiento, fechaActual);
    estadoActual.finalizarAlquiler(vehiculo);
  }

  

}