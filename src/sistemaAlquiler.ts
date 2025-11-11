import Alquiler from "./alquiler";
import DisponibilidadService from "./disponibilidadService";
import { CategoriaVehiculo } from "./enums";
import GestorAlquiler from "./gestorAlquiler";
import GestorReserva from "./gestorReserva";
import GestorVehiculo from "./gestorVehiculo";
import RangoDeFechas from "./rangoDeFechas";
import Reserva from "./reserva";
import Vehiculo from "./vehiculo";


export default class SistemaAlquiler {
  constructor(
    private gestorVehiculo: GestorVehiculo,
    private gestorReserva: GestorReserva,
    private gestorAlquiler: GestorAlquiler
  ) { }

  public agregarVehiculo(v: Vehiculo): void { this.gestorVehiculo.agregar(v); }
  public listarVehiculos(): Vehiculo[] { return this.gestorVehiculo.listar(); }
  public listarReservas(): Reserva[] { return this.gestorReserva.listar(); }

  public crearReservaPendiente(clienteId: string, fechaInicio: Date, fechaFin: Date): Reserva {
    return this.gestorReserva.crearPendiente(clienteId, fechaInicio, fechaFin);
  }

public buscarVehiculoDisponible(categoria: CategoriaVehiculo, rangoPedido: RangoDeFechas): Vehiculo | null {
  const candidatos = this.gestorVehiculo.filtrarPorCategoria(categoria);

  for (const v of candidatos) {
    if (v.estaDisponible(rangoPedido)) {
      return v;
    }
  }
  return null;
}

  public ConfirmarReserva(reserva: Reserva, categoria: CategoriaVehiculo): Reserva {
    const vehiculo = this.buscarVehiculoDisponible(categoria, reserva.getRango());
    return this.gestorReserva.confirmar(reserva, vehiculo);
  }

  public iniciarAlquileresDelDia(reservas: Reserva[], fechaActual: Date = new Date()): Alquiler[] {
    return this.gestorAlquiler.iniciarAlquileresProgramadosDelDia(reservas, fechaActual);
  }

  public finalizarAlquiler(alquiler: Alquiler, kmFinal: number, fechaActual: Date = new Date()): void {
    this.gestorAlquiler.finalizar(alquiler, kmFinal, fechaActual);
  }

  public listarAlquileres(): Alquiler[] { return this.gestorAlquiler.listar(); }
}