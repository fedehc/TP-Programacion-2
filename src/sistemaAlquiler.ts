
import Alquiler from "./Alquiler/alquiler";
import GestorAlquiler from "./Alquiler/gestorAlquiler";
import { CategoriaVehiculo, EstadoVehiculo } from "./Extras/enums";
import RangoDeFechas from "./Extras/rangoDeFechas";
import GestorReserva from "./Reserva/gestorReserva";
import Reserva from "./Reserva/reserva";
import GestorVehiculo from "./Vehiculo/gestorVehiculo";
import Vehiculo from "./Vehiculo/vehiculo";


/**
 * Clase principal que orquesta la gestión de vehículos, reservas y alquileres.
 * Permite agregar vehículos, crear y confirmar reservas, buscar disponibilidad y gestionar alquileres.
 */
export default class SistemaAlquiler {
  /**
   * Crea una instancia del sistema de alquiler.
   * @param gestorVehiculo Gestor de vehículos
   * @param gestorReserva Gestor de reservas
   * @param gestorAlquiler Gestor de alquileres
   */
  constructor(
    private gestorVehiculo: GestorVehiculo,
    private gestorReserva: GestorReserva,
    private gestorAlquiler: GestorAlquiler
  ) {}


  /**
   * Confirma una reserva con manejo de errores. Si ocurre una excepción,
   * retorna null y loguea el error en consola.
   *
   * @param reserva Reserva a confirmar
   * @param categoria Categoría del vehículo solicitado
   * @returns Reserva confirmada o null si hubo error
   */
  public ConfirmarReservaConManejoErrores(reserva: Reserva,categoria: CategoriaVehiculo): Reserva | null {
    try {
      return this.ConfirmarReserva(reserva, categoria);
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      return null;
    }
  }

  /**
   * Agrega un vehículo al sistema.
   * @param v Vehículo a agregar
   */
  public agregarVehiculo(v: Vehiculo): void {
    this.gestorVehiculo.agregar(v);
  }


  /**
   * Lista todos los vehículos registrados en el sistema.
   * @returns Array de vehículos
   */
  public listarVehiculos(): Vehiculo[] {
    return this.gestorVehiculo.listar();
  }


  /**
   * Lista todas las reservas existentes.
   * @returns Array de reservas
   */
  public listarReservas(): Reserva[] {
    return this.gestorReserva.listar();
  }


  /**
   * Crea una reserva pendiente para un cliente en un rango de fechas.
   * @param clienteId ID del cliente
   * @param fechaInicio Fecha de inicio de la reserva
   * @param fechaFin Fecha de fin de la reserva
   * @returns Reserva creada en estado pendiente
   */
  public crearReservaPendiente(clienteId: string, fechaInicio: Date,fechaFin: Date ): Reserva {
    return this.gestorReserva.crearPendiente(clienteId,fechaInicio,fechaFin);
  }


  /**
   * Busca un vehículo disponible de una categoría para un rango de fechas.
   * @param categoria Categoría del vehículo
   * @param rangoPedido Rango de fechas solicitado
   * @returns Vehículo disponible o null si no hay
   */
  public buscarVehiculoDisponible(categoria: CategoriaVehiculo,rangoPedido: RangoDeFechas): Vehiculo | null {
    const candidatos = this.filtrarPorCategoria(categoria);
    const operativos = candidatos.filter((v) => this.estaOperativamenteDisponible(v));

    return this.seleccionarDisponible(operativos, rangoPedido);
  }


  /**
   * Confirma una reserva asignando un vehículo disponible de la categoría solicitada.
   * @param reserva Reserva a confirmar
   * @param categoria Categoría del vehículo solicitado
   * @returns Reserva confirmada
   */
  public ConfirmarReserva(reserva: Reserva, categoria: CategoriaVehiculo): Reserva {
    const vehiculo = this.buscarVehiculoDisponible( categoria, reserva.getRango());
    return this.gestorReserva.confirmar(reserva, vehiculo);
  }


  /**
   * Inicia los alquileres programados para el día actual.
   * @param reservas Reservas a iniciar
   * @param fechaActual Fecha actual (por defecto, hoy)
   * @returns Array de alquileres iniciados
   */
  public iniciarAlquileresDelDia( reservas: Reserva[], fechaActual: Date = new Date() ): Alquiler[] {
    return this.gestorAlquiler.iniciarAlquileresProgramadosDelDia( reservas,fechaActual );
  }


  /**
   * Finaliza un alquiler, registrando el kilometraje final y la fecha de devolución.
   * @param alquiler Alquiler a finalizar
   * @param kmFinal Kilometraje final del vehículo
   * @param fechaActual Fecha de finalización (por defecto, hoy)
   */
  public finalizarAlquiler(alquiler: Alquiler, kmFinal: number,fechaActual: Date = new Date() ): void {
    this.gestorAlquiler.finalizar(alquiler, kmFinal, fechaActual);
  }


  /**
   * Lista todos los alquileres registrados en el sistema.
   * @returns Array de alquileres
   */
  public listarAlquileres(): Alquiler[] {
    return this.gestorAlquiler.listar();
  }


  /**
   * Filtra los vehículos por categoría.
   * @param categoria Categoría a filtrar
   * @returns Array de vehículos de la categoría
   */
  private filtrarPorCategoria(categoria: CategoriaVehiculo): Vehiculo[] {
    return this.gestorVehiculo.filtrarPorCategoria(categoria);
  }


  /**
   * Verifica si un vehículo está disponible operativamente (estado disponible).
   * @param v Vehículo a verificar
   * @returns true si está disponible, false si no
   */
  private estaOperativamenteDisponible(v: Vehiculo): boolean {
    return v.getEstado() === EstadoVehiculo.disponible;
  }

  /**
   * Selecciona el primer vehículo disponible en un rango de fechas.
   * @param candidatos Vehículos candidatos
   * @param rango Rango de fechas solicitado
   * @returns Vehículo disponible o null si no hay
   */
  private seleccionarDisponible( candidatos: Vehiculo[],rango: RangoDeFechas): Vehiculo | null {
    for (const v of candidatos) {
      if (v.estaDisponible(rango)) {
        return v;
      }
    }
    return null;
  }
}
