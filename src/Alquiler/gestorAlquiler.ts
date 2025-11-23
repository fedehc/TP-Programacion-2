import Alquiler from "./alquiler";
import Reserva from "../Reserva/reserva";
import Vehiculo from "../Vehiculo/vehiculo";
import ISelectorTemporada from "../Temporada/ISelector.temporada";
import { IReglaMantenimiento } from "../Mantenimiento/IReglaMantenimiento";
import { TransicionEstadoInvalidaException } from "../Excepciones/exceptions";


export default class GestorAlquiler {
  constructor(
    private readonly reglaMantenimiento: IReglaMantenimiento,
    private readonly selector: ISelectorTemporada,
    private alquileres: Alquiler[] = []
  ) { }


  public listar(): Alquiler[] {
    return this.alquileres;
  }

  private iniciarAlquiler(reserva: Reserva, vehiculo: Vehiculo): Alquiler {
    const estado = vehiculo.getEstadoState();
    const alquiler = new Alquiler( `A-${Date.now()}`, reserva, vehiculo, reserva.getClienteId(),reserva.getRango(), vehiculo.getKilometraje(), this.selector);
    reserva.marcarCumplida();
    estado.iniciarAlquiler(vehiculo);
    this.alquileres.push(alquiler);
    return alquiler;
  }

  public iniciarAlquileresProgramadosDelDia(reservas: Reserva[], fechaActual: Date = new Date()): Alquiler[] {
    const iniciados: Alquiler[] = [];
    for (const reserva of reservas) {
      const vehiculo = reserva.getVehiculo();
      if ( vehiculo && reserva.getRango().esMismoDiaQueInicio(fechaActual) && reserva.puedeIniciarAlquiler() && vehiculo.getEstadoState().puedeIniciarAlquiler(vehiculo)) {
        iniciados.push(this.iniciarAlquiler(reserva, vehiculo));
      }
    }
    return iniciados;
  }

  public finalizar(alquiler: Alquiler, kmFinal: number, fechaActual: Date = new Date()): void {
    const vehiculo = alquiler.getVehiculo();
    this.finalizarAlquilerYLiberarBloqueo(alquiler, kmFinal);
    const necesitaMantenimiento = this.evaluarSiNecesitaMantenimiento(vehiculo, kmFinal, fechaActual);
    this.actualizarEstadoDelVehiculo(vehiculo, kmFinal, necesitaMantenimiento, fechaActual);
  }

  private finalizarAlquilerYLiberarBloqueo(alquiler: Alquiler, kilometrajeFinal: number): void {
    alquiler.finalizar(kilometrajeFinal);
    const vehiculo = alquiler.getVehiculo();
    vehiculo.desbloquear(alquiler.getRango());
  }

  private evaluarSiNecesitaMantenimiento(vehiculo: Vehiculo, kilometrajeFinal: number, fecha: Date): boolean {
    const fichaDelVehiculo = vehiculo.getFichaMantenimiento();
    return this.reglaMantenimiento.requiere(fecha, kilometrajeFinal, fichaDelVehiculo);
  }

  private actualizarEstadoDelVehiculo(vehiculo: Vehiculo,kilometrajeFinal: number,necesitaMantenimiento: boolean,fechaActual: Date): void {
    const estadoActual = vehiculo.getEstadoState();
    if (!estadoActual.puedeFinalizarAlquiler(vehiculo)) {
      throw new TransicionEstadoInvalidaException(
        estadoActual.getNombre(),
        `finalizar alquiler en vehículo ${vehiculo.getMatricula()}`
      );
    }
    vehiculo.registrarFinalizacion(kilometrajeFinal, necesitaMantenimiento, fechaActual);
    estadoActual.finalizarAlquiler(vehiculo);
  }

  

}