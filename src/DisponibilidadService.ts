import RangoDeFechas from "./rangoDeFechas";
import Reserva from "./reserva";
import Vehiculo from "./vehiculo";

export class DisponibilidadService {

  public static estaDisponible(vehiculo: Vehiculo, rango: RangoDeFechas, reservas: Reserva[]): boolean {
     const reservasDelVehiculo = reservas.filter(
      r => r.obtenerVehiculo().getMatricula() === vehiculo.getMatricula()
    );
    return !reservasDelVehiculo.some(r => r.obtenerRangoReservado().seCruzaCon(rango));
  }
  
}