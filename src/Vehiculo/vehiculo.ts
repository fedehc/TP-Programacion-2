import DisponibilidadService from "../Extras/disponibilidadService";
import { CategoriaVehiculo, EstadoVehiculo } from "../Extras/enums";
import FichaMantenimiento from "../Mantenimiento/fichaMantenimiento";
import RangoDeFechas from "../Extras/rangoDeFechas";
import Tarifa from "../Tarifa/tarifa";
import EstadoVehiculoState from "./estadoVehiculoState";
import DisponibleState from "./disponibleState";


export default class Vehiculo {
  private bloqueos: RangoDeFechas[] = [];
  private fichaMantenimiento: FichaMantenimiento = new FichaMantenimiento();
  private estadoState: EstadoVehiculoState;
  private requiereMantenimiento: boolean = false;
  private bloqueoMantenimiento?: RangoDeFechas;
  
  constructor(
    private matricula: string,
    private categoria: CategoriaVehiculo,
    private tarifa: Tarifa,
    private kilometraje: number
  ) {
    this.estadoState = new DisponibleState();
  }

  public cambiarEstado(nuevoEstado: EstadoVehiculoState): void {
    this.estadoState = nuevoEstado;
  }

  
  public getEstadoState(): EstadoVehiculoState {
    return this.estadoState;
  }

  public getMatricula(): string {
    return this.matricula;
  }

  public getCategoria(): CategoriaVehiculo {
    return this.categoria;
  }

  public getEstado(): EstadoVehiculo {
    return this.estadoState.estadoActual();
  }

  public getTarifa(): Tarifa {
    return this.tarifa;
  }

  public getKilometraje(): number {
    return this.kilometraje;
  }

  public registrarMantenimiento(fechaActual: Date, kmActual: number, costo: number): void {
    this.fichaMantenimiento.registrarMantenimiento(fechaActual, kmActual, costo);
    this.kilometraje = kmActual;
    if (this.bloqueoMantenimiento) {
      this.desbloquear(this.bloqueoMantenimiento);
      this.bloqueoMantenimiento = undefined;
    }
  }


  public registrarFinalizacion(kmFinal: number, requiereMantenimiento: boolean, fechaActual: Date): void {
    this.actualizarKilometrajeYEstado(kmFinal, requiereMantenimiento);
    if (requiereMantenimiento) {
      this.bloquearVehiculoPorMantenimiento(fechaActual);
    }
  }

  private actualizarKilometrajeYEstado(kilometrajeFinal: number, necesitaMantenimiento: boolean): void {
    this.kilometraje = kilometrajeFinal;
    this.notificarAlquilerCompletado();
    this.requiereMantenimiento = necesitaMantenimiento;
  }

  private bloquearVehiculoPorMantenimiento(fechaInicio: Date): void {
    const fechaFin = new Date(fechaInicio.getTime() + 24 * 60 * 60 * 1000);
    this.bloqueoMantenimiento = new RangoDeFechas(fechaInicio, fechaFin);
    this.bloquear(this.bloqueoMantenimiento);
  }


  public getRequiereMantenimiento(): boolean {
    return this.requiereMantenimiento;
  }

  public setKilometraje(nuevoKilometraje: number) {
    this.kilometraje = nuevoKilometraje;
  }

  public getRangosBloqueados(): ReadonlyArray<RangoDeFechas> {
    return this.bloqueos;
  }

  public bloquear(rango: RangoDeFechas): void {
    this.bloqueos.push(rango);
  }

  public desbloquear(rango: RangoDeFechas): void {
    this.bloqueos = this.bloqueos.filter(b => !b.esIgualA(rango));
  }

  public limpiarBloqueos(): void {
    this.bloqueos = [];
  }

  public estaDisponible(periodo: RangoDeFechas): boolean {
    return DisponibilidadService.estaLibre(periodo, this.bloqueos);
  }

  public getFichaMantenimiento(): FichaMantenimiento {
    return this.fichaMantenimiento;
  }

  public notificarAlquilerCompletado(): void {
    this.fichaMantenimiento.registrarAlquilerCompletado();
  }
}
