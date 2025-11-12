import Alquiler from "./alquiler";
import { EstadoVehiculo } from "./enums";
import { IMantenimientoPolicy } from "./IPoliticaMantenimiento";
import Reserva from "./reserva";
import Vehiculo from "./vehiculo";

export default class GestorAlquiler {
  constructor(
    private readonly policy: IMantenimientoPolicy,
    private alquileres: Alquiler[] = []
  ) { }


  public agregar(a: Alquiler): void {
    this.alquileres.push(a);
  }

  public listar(): Alquiler[] {
    return this.alquileres;
  }

  public crear(reserva: Reserva, vehiculo: Vehiculo): Alquiler {
    const nuevo = new Alquiler(
      `A-${Date.now()}`,
      reserva,
      vehiculo,
      reserva.getClienteId(),
      reserva.getRango(),
      vehiculo.getKilometraje()
    );
    vehiculo.setEstado(EstadoVehiculo.alquiler);
    this.alquileres.push(nuevo);
    return nuevo;
  }

  public iniciarAlquileresProgramadosDelDia(reservas: Reserva[], fechaActual: Date = new Date()): Alquiler[] {
    const iniciados: Alquiler[] = [];
    for (const r of reservas) {
      const vehiculo = r.getVehiculo();
      if (!vehiculo) continue;
      if (r.getRango().esMismoDiaQueInicio(fechaActual) && vehiculo.getEstado() === EstadoVehiculo.disponible) {
        iniciados.push(this.crear(r, vehiculo));
      }
    }
    return iniciados;
  }

  public finalizar(alquiler: Alquiler, kmFinal: number, _fechaActual: Date = new Date()): void {
    alquiler.finalizar(kmFinal);
    const vehiculo = alquiler.getVehiculo();
    vehiculo.setKilometraje(kmFinal);
    vehiculo.getFichaMantenimiento().registrarAlquilerCompletado();
    const requiere = this.policy.requiere(_fechaActual, kmFinal, vehiculo.getFichaMantenimiento());
    if (requiere) vehiculo.setEstado(EstadoVehiculo.mantenimiento); else vehiculo.setEstado(EstadoVehiculo.limpieza);
  }

}