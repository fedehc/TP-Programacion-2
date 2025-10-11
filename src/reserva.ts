import Cliente from "./cliente";
import { EstadoReserva } from "./enums";
import RangoDeFechas from "./rangoDeFechas";
import Vehiculo from "./vehiculo";

export class Reserva {
  private id: string;
  private cliente: Cliente;
  private vehiculo: Vehiculo;
  private rangoReservado: RangoDeFechas;
  private estado: EstadoReserva;

  constructor(id: string, cliente: Cliente, vehiculo: Vehiculo, rangoReservado: RangoDeFechas) {
    this.id = id;
    this.cliente = cliente;
    this.vehiculo = vehiculo;
    this.rangoReservado = rangoReservado;
    this.estado = EstadoReserva.PENDIENTE;
  }

  public diasReservados(): number {
    return this.rangoReservado.dias();
  }
  public confirmarReserva(): void {
    if (this.estado === EstadoReserva.PENDIENTE) this.estado = EstadoReserva.CONFIRMADA;
  }
  public cancelarReserva(): void { this.estado = EstadoReserva.CANCELADA; }

  public marcarReservaComoCumplida(): void {
    this.estado = EstadoReserva.CUMPLIDA;
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
