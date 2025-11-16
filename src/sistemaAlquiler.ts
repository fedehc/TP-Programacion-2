import Alquiler from "./Alquiler/alquiler";
import GestorAlquiler from "./Alquiler/gestorAlquiler";
import { CategoriaVehiculo } from "./Extras/enums";
import RangoDeFechas from "./Extras/rangoDeFechas";
import GestorReserva from "./Reserva/gestorReserva";
import Reserva from "./Reserva/reserva";
import GestorVehiculo from "./Vehiculo/gestorVehiculo";
import Vehiculo from "./Vehiculo/vehiculo";

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