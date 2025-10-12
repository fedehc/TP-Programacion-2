import { EstadoReserva } from "./enums";
import RangoDeFechas from "./rangoDeFechas";
import Vehiculo from "./vehiculo";


export default class Reserva {

  private id: string;
  private clienteId: string;
  private rango: RangoDeFechas;
  private estado: EstadoReserva;
  private vehiculo?: Vehiculo;

  constructor(
    id: string,
    clienteId: string,
    rango: RangoDeFechas,
    estado: EstadoReserva = EstadoReserva.pendiente,
    vehiculo?: Vehiculo
  ) {
    this.id = id;
    this.clienteId = clienteId;
    this.rango = rango;
    this.estado = estado;
    this.vehiculo = vehiculo;
  }

  public getId(): string {
    return this.id;
  }

  public getClienteId(): string {
    return this.clienteId;
  }

  public getRango(): RangoDeFechas {
    return this.rango;
  }

  public getEstado(): EstadoReserva {
    return this.estado;
  }

  public getVehiculo(): Vehiculo | undefined {
    return this.vehiculo;
  }

  public getVehiculoMatricula(): string | undefined {
    return this.vehiculo?.getMatricula();
  }

  public marcarCumplida() {
    this.estado = EstadoReserva.confirmada;
  }

  public confirmarConVehiculo(v: Vehiculo): void {
    this.vehiculo = v;
    this.estado = EstadoReserva.confirmada;
  }

  public cancelar(): void {
    this.estado = EstadoReserva.cancelada;
    this.vehiculo = undefined;
  }
}