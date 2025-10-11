import Cliente from "./cliente";
import { EstadoReserva } from "./enums";
import RangoDeFechas from "./rangoDeFechas";
import Vehiculo from "./vehiculo";

export default class Reserva {
  private readonly id: string;
  private readonly cliente: Cliente;
  private readonly vehiculo: Vehiculo;
  private readonly rangoReservado: RangoDeFechas;
  private estado: EstadoReserva;

  constructor(id: string, cliente: Cliente, vehiculo: Vehiculo, rangoReservado: RangoDeFechas) {
    this.id = id;
    this.cliente = cliente;
    this.vehiculo = vehiculo;
    this.rangoReservado = rangoReservado;
    this.estado = EstadoReserva.pendiente;
  }

  public diasReservados(): number {
    return this.rangoReservado.dias();
  }
  public confirmarReserva(): void {
    if (this.estado === EstadoReserva.pendiente) this.estado = EstadoReserva.confirmada;
  }
  public cancelarReserva(): void { this.estado = EstadoReserva.cancelada; }

  public marcarReservaComoCumplida(): void {
    this.estado = EstadoReserva.cumplida;
  }

  public estadoActual(): EstadoReserva {
    return this.estado;
  }

  public obtenerVehiculo(): Vehiculo {
    return this.vehiculo;
  }

  public obtenerCliente(): Cliente {
    return this.cliente;
  }

  public obtenerRangoReservado(): RangoDeFechas {
    return this.rangoReservado;
  }

  public obtenerId(): string {
    return this.id;
  }
}