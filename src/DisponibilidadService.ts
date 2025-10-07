import { Reserva } from "./Reserva";

export class DisponibilidadService {

  public static estaDisponible(vehiculo: Vehiculo, rango: RangoDeFechas, reservas: Reserva[]): boolean {
     const reservasDelVehiculo = reservas.filter(
      r => r.obtenerVehiculo().obtenerMatricula() === vehiculo.obtenerMatricula()
    );
    return !reservasDelVehiculo.some(r => r.obtenerRangoReservado().tieneInterseccion(rango));
  }
  
}