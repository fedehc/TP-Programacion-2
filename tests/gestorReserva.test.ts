import GestorReserva from "../src/gestorReserva";
import RangoDeFechas from "../src/rangoDeFechas";
import Vehiculo from "../src/vehiculo";
import Reserva from "../src/reserva";
import { CategoriaVehiculo, EstadoVehiculo, EstadoReserva } from "../src/enums";

describe("GestorReserva - flujo básico", () => {
  const inicio = new Date("2024-01-10T00:00:00");
  const fin = new Date("2024-01-12T00:00:00");
  const tarifaMock: any = { calcularCosto: jest.fn().mockReturnValue(0) };

  test("crearPendiente crea una reserva pendiente con rango correcto y id con prefijo R-", () => {
    const g = new GestorReserva();
    const r = g.crearPendiente("cli-1", inicio, fin);

    expect(r.getClienteId()).toBe("cli-1");
    expect(r.getRango().getInicio().getTime()).toBe(inicio.getTime());
    expect(r.getRango().getFin().getTime()).toBe(fin.getTime());
    expect(r.getEstado()).toBe(EstadoReserva.pendiente);
    expect(r.getId().startsWith("R-")).toBe(true);
  });

  test("confirmar con vehículo asigna, bloquea el vehículo y agrega a la lista", () => {
    const g = new GestorReserva();
    const reserva = g.crearPendiente("cli-2", inicio, fin);
    const v = new Vehiculo("MAT1", CategoriaVehiculo.suv, EstadoVehiculo.disponible, tarifaMock, 2000);

    const spyBloq = jest.spyOn(v, "bloquear");

    const res = g.confirmar(reserva, v);

    expect(res.getVehiculo()).toBe(v);
    expect(res.getEstado()).toBe(EstadoReserva.confirmada);
    expect(spyBloq).toHaveBeenCalledWith(reserva.getRango());
    expect(g.listar()).toEqual(expect.arrayContaining([reserva]));
  });

  test("confirmar con null cancela la reserva y no la agrega a la lista", () => {
    const g = new GestorReserva();
    const reserva = g.crearPendiente("cli-3", inicio, fin);

    const res = g.confirmar(reserva, null);

    expect(res.getEstado()).toBe(EstadoReserva.cancelada);
    expect(g.listar()).not.toEqual(expect.arrayContaining([reserva]));
  });

  test("agregar y listar funcionan (agregar reserva externa)", () => {
    const g = new GestorReserva();
    const externa = new Reserva("EXT-1", "cX", new RangoDeFechas(inicio, fin));
    g.agregar(externa);
    expect(g.listar()).toEqual(expect.arrayContaining([externa]));
  });

  test("cancelar desbloquea el vehículo si estaba asignado y marca cancelada", () => {
    const g = new GestorReserva();
    const reserva = g.crearPendiente("cli-4", inicio, fin);
    const v = new Vehiculo("MAT2", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaMock, 3000);


    g.confirmar(reserva, v);
    const spyDesb = jest.spyOn(v, "desbloquear");

    g.cancelar(reserva);

    expect(spyDesb).toHaveBeenCalledWith(reserva.getRango());
    expect(reserva.getEstado()).toBe(EstadoReserva.cancelada);
  });
});
