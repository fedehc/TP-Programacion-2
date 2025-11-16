import { EstadoReserva } from "../Extras/enums";
import RangoDeFechas from "../Extras/rangoDeFechas";
import Vehiculo from "../Vehiculo/vehiculo";
import Reserva from "./reserva";


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

  public confirmar(reserva: Reserva, vehiculo: Vehiculo | null): Reserva {
    if (vehiculo) {
      reserva.confirmarConVehiculo(vehiculo);
      vehiculo.bloquear(reserva.getRango());
      this.reservas.push(reserva);
    } else {
      reserva.cancelar();
    }
    return reserva;
  }

  public cancelar(reserva: Reserva): void {
    const vehiculo = reserva.getVehiculo();
    if (vehiculo) {
      vehiculo.desbloquear(reserva.getRango());
    }
    reserva.cancelar();
  }

  public listar(): Reserva[] {
    return this.reservas;
  }

  private generarIdReserva(): string {
    return "R-" + Date.now();
  }
}