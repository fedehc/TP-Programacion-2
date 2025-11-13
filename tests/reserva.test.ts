import Reserva from "../src/reserva";
import RangoDeFechas from "../src/rangoDeFechas";
import Vehiculo from "../src/vehiculo";
import { EstadoReserva, CategoriaVehiculo, EstadoVehiculo } from "../src/enums";

describe("Reserva - unidad", () => {
  const rango = new RangoDeFechas(new Date("2023-06-01T00:00:00"), new Date("2023-06-05T00:00:00"));
  const tarifaMock: any = { calcularCosto: jest.fn().mockReturnValue(0) };
  const vehiculo = new Vehiculo("XYZ999", CategoriaVehiculo.sedan, EstadoVehiculo.disponible, tarifaMock, 5000);

  test("getters devuelven los valores del constructor y estado por defecto", () => {
    const reserva = new Reserva("r-1", "cliente-1", rango);
    expect(reserva.getId()).toBe("r-1");
    expect(reserva.getClienteId()).toBe("cliente-1");
    expect(reserva.getRango()).toBe(rango);
    expect(reserva.getEstado()).toBe(EstadoReserva.pendiente);
    expect(reserva.getVehiculo()).toBeUndefined();
    expect(reserva.getVehiculoMatricula()).toBeUndefined();
  });

  test("confirmarConVehiculo asigna vehiculo y cambia estado a confirmada", () => {
    const reserva = new Reserva("r-2", "cliente-2", rango);
    reserva.confirmarConVehiculo(vehiculo);
    expect(reserva.getVehiculo()).toBe(vehiculo);
    expect(reserva.getEstado()).toBe(EstadoReserva.confirmada);
    expect(reserva.getVehiculoMatricula()).toBe("XYZ999");
  });

  test("marcarCumplida cambia el estado a cumplida", () => {
    const reserva = new Reserva("r-3", "cliente-3", rango);
    reserva.marcarCumplida();
    expect(reserva.getEstado()).toBe(EstadoReserva.cumplida);
  });

  test("cancelar pone estado en cancelada y remueve vehiculo asignado", () => {
    const reserva = new Reserva("r-4", "cliente-4", rango);
    reserva.confirmarConVehiculo(vehiculo);
    expect(reserva.getVehiculo()).toBe(vehiculo);

    reserva.cancelar();
    expect(reserva.getEstado()).toBe(EstadoReserva.cancelada);
    expect(reserva.getVehiculo()).toBeUndefined();
    expect(reserva.getVehiculoMatricula()).toBeUndefined();
  });
});
