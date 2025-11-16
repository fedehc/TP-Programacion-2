import Reserva from "../src/Reserva/reserva";
import RangoDeFechas from "../src/Extras/rangoDeFechas";
import Vehiculo from "../src/Vehiculo/vehiculo";
import { EstadoReserva, CategoriaVehiculo, EstadoVehiculo } from "../src/Extras/enums";

describe("Reserva - pruebas simples", () => {
  const rango = new RangoDeFechas(new Date("2023-06-01T00:00:00"), new Date("2023-06-05T00:00:00"));
  const tarifaMock: any = { calcularCosto: jest.fn().mockReturnValue(0) };
  const vehiculo = new Vehiculo("XYZ999", CategoriaVehiculo.sedan, EstadoVehiculo.disponible, tarifaMock, 5000);

  test("getters: id, cliente, rango y estado inicial", () => {
    const reservaInicial = new Reserva("r-1", "cliente-1", rango);
    expect(reservaInicial.getId()).toBe("r-1");
    expect(reservaInicial.getClienteId()).toBe("cliente-1");
    expect(reservaInicial.getRango()).toBe(rango);
    expect(reservaInicial.getEstado()).toBe(EstadoReserva.pendiente);
    expect(reservaInicial.getVehiculo()).toBeUndefined();
    expect(reservaInicial.getVehiculoMatricula()).toBeUndefined();
  });

  test("confirmarConVehiculo: asigna vehiculo y cambia estado", () => {
    const reservaConfirmar = new Reserva("r-2", "cliente-2", rango);
    reservaConfirmar.confirmarConVehiculo(vehiculo);
    expect(reservaConfirmar.getVehiculo()).toBe(vehiculo);
    expect(reservaConfirmar.getEstado()).toBe(EstadoReserva.confirmada);
    expect(reservaConfirmar.getVehiculoMatricula()).toBe("XYZ999");
  });

  test("marcarCumplida: pasa a estado cumplida", () => {
    const reservaCumplir = new Reserva("r-3", "cliente-3", rango);
    reservaCumplir.marcarCumplida();
    expect(reservaCumplir.getEstado()).toBe(EstadoReserva.cumplida);
  });

  test("cancelar: estado cancelada y quita vehiculo", () => {
    const reservaCancelar = new Reserva("r-4", "cliente-4", rango);
    reservaCancelar.confirmarConVehiculo(vehiculo);
    expect(reservaCancelar.getVehiculo()).toBe(vehiculo);

    reservaCancelar.cancelar();
    expect(reservaCancelar.getEstado()).toBe(EstadoReserva.cancelada);
    expect(reservaCancelar.getVehiculo()).toBeUndefined();
    expect(reservaCancelar.getVehiculoMatricula()).toBeUndefined();
  });
});
