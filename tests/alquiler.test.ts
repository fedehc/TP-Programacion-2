
import Alquiler from "../src/Alquiler/alquiler";
import Reserva from "../src/Reserva/reserva";
import Vehiculo from "../src/Vehiculo/vehiculo";
import RangoDeFechas from "../src/Extras/rangoDeFechas";
import { CategoriaVehiculo, EstadoAlquiler } from "../src/Extras/enums";
import SelectorTemporada from "../src/Temporada/temporadaSelector";

describe("test Alquiler ", () => {
  const sel = new SelectorTemporada();
  const rangoBase = new RangoDeFechas(new Date("2023-01-01"), new Date("2023-01-03"));
  const reservaBase = new Reserva("R-1", "cli-1", rangoBase);
  const tarifaFake: any = { calcularCosto: jest.fn().mockReturnValue(0) };
  const auto = new Vehiculo("MAT-123", CategoriaVehiculo.compacto, tarifaFake, 1000);

  test("getReserva devuelve la reserva original", () => {
    const alq = new Alquiler("A-1", reservaBase, auto, "cli-1", rangoBase, 1000, sel);
    expect(alq.getReserva()).toBe(reservaBase);
  });

  test("getVehiculo devuelve el mismo vehiculo", () => {
    const alq = new Alquiler("A-2", reservaBase, auto, "cli-2", rangoBase, 1000, sel);
    expect(alq.getVehiculo()).toBe(auto);
  });

  test("cliente id se guarda", () => {
    const alq = new Alquiler("A-3", reservaBase, auto, "cli-x", rangoBase, 900, sel);
    expect(alq.getClienteId()).toBe("cli-x");
  });

  test("rango coincide con el pasado", () => {
    const alq = new Alquiler("A-4", reservaBase, auto, "cli-1", rangoBase, 1000, sel);
    expect(alq.getRango()).toBe(rangoBase);
  });

  test("km inicial se guarda correctamente", () => {
    const alq = new Alquiler("A-5", reservaBase, auto, "cli-1", rangoBase, 777, sel);
    expect(alq.getKilometrajeInicial()).toBe(777);
  });

  test("km final comienza undefined", () => {
    const alq = new Alquiler("A-6", reservaBase, auto, "cli-1", rangoBase, 1000, sel);
    expect(alq.getKilometrajeFinal()).toBeUndefined();
  });

  test("estado inicial es activo", () => {
    const alq = new Alquiler("A-7", reservaBase, auto, "cli-1", rangoBase, 1000, sel);
    expect(alq.getEstado()).toBe(EstadoAlquiler.activo);
  });

  test("costo total antes de finalizar es undefined", () => {
    const alq = new Alquiler("A-8", reservaBase, auto, "cli-1", rangoBase, 1000, sel);
    expect(alq.getCostoTotal()).toBeUndefined();
  });

  describe("finalizar() y calcular costo", () => {
    test("calcularCostoTotal lanza si no finalizado", () => {
      const alq = new Alquiler("A-9", reservaBase, auto, "cli-1", rangoBase, 1000, sel);
      expect(() => alq.calcularCostoTotal()).toThrow(/no fue finalizado/i);
    });

    test("finalizar actualiza km, estado y costo", () => {
      const alq = new Alquiler("A-10", reservaBase, auto, "cli-1", rangoBase, 1000, sel);
      const spyCosto = jest.spyOn(alq as any, "calcularCostoTotal").mockReturnValue(500);
      alq.finalizar(1500);
      expect(alq.getKilometrajeFinal()).toBe(1500);
      expect(alq.getEstado()).toBe(EstadoAlquiler.finalizado);
      expect(alq.getCostoTotal()).toBe(500);
      spyCosto.mockRestore();
    });

    test("finalizar con km menor lanza error y no cambia estado", () => {
      const alq = new Alquiler("A-11", reservaBase, auto, "cli-1", rangoBase, 1000, sel);
      expect(() => alq.finalizar(999)).toThrow(/Kilometraje inválido/i);
      expect(alq.getEstado()).toBe(EstadoAlquiler.activo);
      expect(alq.getKilometrajeFinal()).toBeUndefined();
    });

    test("finalizar con km igual permitido y costo 0", () => {
      const alq = new Alquiler("A-12", reservaBase, auto, "cli-1", rangoBase, 1000, sel);
      jest.spyOn(alq as any, "calcularCostoTotal").mockReturnValue(0);
      alq.finalizar(1000);
      expect(alq.getKilometrajeFinal()).toBe(1000);
      expect(alq.getCostoTotal()).toBe(0);
      expect(alq.getEstado()).toBe(EstadoAlquiler.finalizado);
    });

    test("validarFinalizacion solo valida y no altera estado", () => {
      const alq = new Alquiler("A-13", reservaBase, auto, "cli-1", rangoBase, 1000, sel);
      alq.validarFinalizacion(1200);
      expect(alq.getKilometrajeFinal()).toBeUndefined();
      expect(alq.getEstado()).toBe(EstadoAlquiler.activo);
    });
  });
});
