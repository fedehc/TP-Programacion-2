import DisponibleState from "../src/Vehiculo/disponibleState";
import Vehiculo from "../src/Vehiculo/vehiculo";
import Tarifa from "../src/Tarifa/tarifa";
import { CategoriaVehiculo } from "../src/Extras/enums";

describe("Estado Disponible del vehículo", () => {
  let vehiculo: Vehiculo;
  let tarifa: Tarifa;

  beforeEach(() => {
    tarifa = { calcularCosto: () => 100 } as Tarifa;
    vehiculo = new Vehiculo("MAT123", CategoriaVehiculo.compacto, tarifa, 1000);
    vehiculo.cambiarEstado(new DisponibleState());
  });

  test("permite iniciar alquiler", () => {
    expect(vehiculo.getEstadoState().puedeIniciarAlquiler(vehiculo)).toBe(true);
  });

  test("transición a EnAlquilerState al iniciar alquiler", () => {
    vehiculo.getEstadoState().iniciarAlquiler(vehiculo);
    expect(vehiculo.getEstadoState().getNombre()).toBe("En Alquiler");
  });

  test("no permite finalizar alquiler ni liberar de mantenimiento", () => {
    expect(vehiculo.getEstadoState().puedeFinalizarAlquiler(vehiculo)).toBe(false);
    expect(vehiculo.getEstadoState().puedeLiberarDeMantenimiento(vehiculo)).toBe(false);
  });
});
