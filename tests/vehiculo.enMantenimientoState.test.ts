import EnMantenimientoState from "../src/Vehiculo/enMantenimientoState";
import Vehiculo from "../src/Vehiculo/vehiculo";
import Tarifa from "../src/Tarifa/tarifa";
import { CategoriaVehiculo } from "../src/Extras/enums";

describe("Estado En Mantenimiento del vehículo", () => {
  let vehiculo: Vehiculo;
  let tarifa: Tarifa;

  beforeEach(() => {
    tarifa = { calcularCosto: () => 100 } as Tarifa;
    vehiculo = new Vehiculo("MAT789", CategoriaVehiculo.suv, tarifa, 3000);
    vehiculo.cambiarEstado(new EnMantenimientoState());
  });

  test("permite liberar de mantenimiento", () => {
    expect(vehiculo.getEstadoState().puedeLiberarDeMantenimiento(vehiculo)).toBe(true);
  });

  test("transición a DisponibleState al liberar de mantenimiento", () => {
    vehiculo.getEstadoState().liberarDeMantenimiento(vehiculo);
    expect(vehiculo.getEstadoState().getNombre()).toBe("Disponible");
  });

  test("no permite iniciar ni finalizar alquiler", () => {
    expect(vehiculo.getEstadoState().puedeIniciarAlquiler(vehiculo)).toBe(false);
    expect(vehiculo.getEstadoState().puedeFinalizarAlquiler(vehiculo)).toBe(false);
  });
});
