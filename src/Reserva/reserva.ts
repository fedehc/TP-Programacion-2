import { EstadoReserva } from "../Extras/enums";
import RangoDeFechas from "../Extras/rangoDeFechas";
import Vehiculo from "../Vehiculo/vehiculo";



export default class Reserva {
  constructor(
    private id: string,
    private clienteId: string,
    private rango: RangoDeFechas,
    private estado: EstadoReserva = EstadoReserva.pendiente,
    private vehiculo?: Vehiculo
  ) { }

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
    this.estado = EstadoReserva.cumplida;
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