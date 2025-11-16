import GestorReserva from "../src/Reserva/gestorReserva";
import RangoDeFechas from "../src/Extras/rangoDeFechas";
import Vehiculo from "../src/Vehiculo/vehiculo";
import Reserva from "../src/Reserva/reserva";
import { CategoriaVehiculo, EstadoVehiculo, EstadoReserva } from "../src/Extras/enums";

describe("GestorReserva - pruebas básicas de reservas", () => {
  const inicio = new Date("2024-01-10T00:00:00");
  const fin = new Date("2024-01-12T00:00:00");
  const tarifaMock: any = { calcularCosto: jest.fn().mockReturnValue(0) };

  test("crearPendiente: genera reserva pendiente con rango e id R-", () => {
    const gestor = new GestorReserva();
    const reservaPendiente = gestor.crearPendiente("cli-1", inicio, fin);

    expect(reservaPendiente.getClienteId()).toBe("cli-1");
    expect(reservaPendiente.getRango().getInicio().getTime()).toBe(inicio.getTime());
    expect(reservaPendiente.getRango().getFin().getTime()).toBe(fin.getTime());
    expect(reservaPendiente.getEstado()).toBe(EstadoReserva.pendiente);

  });

  test("confirmar: asigna vehículo, lo bloquea y guarda", () => {
    const gestor = new GestorReserva();
    const reservaPendiente = gestor.crearPendiente("cli-2", inicio, fin);
    const vehiculo = new Vehiculo("MAT1", CategoriaVehiculo.suv, EstadoVehiculo.disponible, tarifaMock, 2000);

    const espiaBloquear = jest.spyOn(vehiculo, "bloquear");

    const reservaConfirmada = gestor.confirmar(reservaPendiente, vehiculo);

    expect(reservaConfirmada.getVehiculo()).toBe(vehiculo);
    expect(reservaConfirmada.getEstado()).toBe(EstadoReserva.confirmada);
    expect(espiaBloquear).toHaveBeenCalledWith(reservaPendiente.getRango());
    expect(gestor.listar()).toEqual(expect.arrayContaining([reservaPendiente]));
  });

  test("confirmar: si paso null la cancela y no guarda", () => {
    const gestor = new GestorReserva();
    const reservaPendiente = gestor.crearPendiente("cli-3", inicio, fin);

    const reservaCancelada = gestor.confirmar(reservaPendiente, null);

    expect(reservaCancelada.getEstado()).toBe(EstadoReserva.cancelada);
    expect(gestor.listar()).not.toEqual(expect.arrayContaining([reservaPendiente]));
  });

  test("agregar/listar: puedo añadir una reserva externa", () => {
    const gestor = new GestorReserva();
    const reservaExterna = new Reserva("EXT-1", "cX", new RangoDeFechas(inicio, fin));
    gestor.agregar(reservaExterna);
    expect(gestor.listar()).toEqual(expect.arrayContaining([reservaExterna]));
  });

  test("cancelar: desbloquea vehículo y pone estado cancelada", () => {
    const gestor = new GestorReserva();
    const reservaPendiente = gestor.crearPendiente("cli-4", inicio, fin);
    const vehiculo = new Vehiculo("MAT2", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaMock, 3000);

    gestor.confirmar(reservaPendiente, vehiculo);
    const espiaDesbloquear = jest.spyOn(vehiculo, "desbloquear");

    gestor.cancelar(reservaPendiente);

    expect(espiaDesbloquear).toHaveBeenCalledWith(reservaPendiente.getRango());
    expect(reservaPendiente.getEstado()).toBe(EstadoReserva.cancelada);
  });
});
