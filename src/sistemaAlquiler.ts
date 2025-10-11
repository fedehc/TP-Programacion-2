import RangoDeFechas from "./rangoDeFechas";
import Reserva from "./Reserva";
import Vehiculo from "./vehiculo";

export default class SistemaAlquiler {

  private vehiculos: Vehiculo[] = [];
  private reservas: Reserva[] = [];

  public crearReservaPendiente(clienteId: string, fechaInicio: Date, fechaFin: Date): Reserva {
    const rango = new RangoDeFechas(fechaInicio, fechaFin);
    const nueva = new Reserva(this.generarIdReserva(), clienteId, rango);
    // Todavía no se guarda, hasta saber si se puede confirmar.
    return nueva;
  }
  private generarIdReserva(): string {
    return "R-" + Date.now();
  }



}

