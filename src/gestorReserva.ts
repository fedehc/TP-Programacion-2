import { EstadoReserva } from "./enums";
import RangoDeFechas from "./rangoDeFechas";
import Reserva from "./reserva";
import Vehiculo from "./vehiculo";



export default class GestorReserva {
  private reservas: Reserva[] = [];

  public agregar(r: Reserva): void {
    this.reservas.push(r);
  }

  public crearPendiente(clienteId: string, fechaInicio: Date, fechaFin: Date): Reserva {
    const rango = new RangoDeFechas(fechaInicio, fechaFin);
    const nueva = new Reserva(this.generarIdReserva(), clienteId, rango);
    return nueva;
  }

  public listar(): Reserva[] {
    return this.reservas;
  }

  public bloqueosDeVehiculo(vehiculo: Vehiculo): RangoDeFechas[] {
    const bloqueos: RangoDeFechas[] = [];
    for (const r of this.reservas) {
      const mismoVehiculo = r.getVehiculo()?.getMatricula() === vehiculo.getMatricula();
      const confirmada = r.getEstado() === EstadoReserva.confirmada;
      if (mismoVehiculo && confirmada) bloqueos.push(r.getRango());
    }
    return bloqueos;
  }

  public confirmar(reserva: Reserva, vehiculo: Vehiculo | null): Reserva {
    if (vehiculo) {
      reserva.confirmarConVehiculo(vehiculo);
      this.reservas.push(reserva);
    } else {
      reserva.cancelar();
    }
    return reserva;
  }

  private generarIdReserva(): string {
    return "R-" + Date.now();
  }
}