import Vehiculo from "../src/vehiculo";
import RangoDeFechas from "../src/rangoDeFechas";
import FichaMantenimiento from "../src/fichaMantenimiento";
import DisponibilidadService from "../src/disponibilidadService";
import { CategoriaVehiculo, EstadoVehiculo } from "../src/enums";

describe("Vehiculo", () => {
  const rango = new RangoDeFechas(new Date("2023-01-01T00:00:00"), new Date("2023-01-03T00:00:00"));
  const tarifaMock: any = { calcularCosto: jest.fn().mockReturnValue(0) };
  const vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaMock, 1000);

  afterEach(() => {
    jest.restoreAllMocks();
    tarifaMock.calcularCosto.mockReset && tarifaMock.calcularCosto.mockReset();
  });

  test("getters devuelven los valores del constructor", () => {
    expect(vehiculo.getMatricula()).toBe("ABC123");
    expect(vehiculo.getCategoria()).toBe(CategoriaVehiculo.compacto);
    expect(vehiculo.getEstado()).toBe(EstadoVehiculo.disponible);
    expect(vehiculo.getTarifa()).toBe(tarifaMock);
    expect(vehiculo.getKilometraje()).toBe(1000);
  });

  test("setEstado y setKilometraje modifican los valores", () => {
    vehiculo.setEstado(EstadoVehiculo.mantenimiento);
    expect(vehiculo.getEstado()).toBe(EstadoVehiculo.mantenimiento);

    vehiculo.setKilometraje(12345);
    expect(vehiculo.getKilometraje()).toBe(12345);

    vehiculo.setEstado(EstadoVehiculo.disponible);
    vehiculo.setKilometraje(1000);
  });

  test("bloquear, getRangosBloqueados, desbloquear y limpiarBloqueos funcionan correctamente", () => {
    expect(vehiculo.getRangosBloqueados()).toHaveLength(0);

    const r1 = new RangoDeFechas(new Date("2023-02-01T00:00:00"), new Date("2023-02-03T00:00:00"));
    const r2 = new RangoDeFechas(new Date("2023-03-01T00:00:00"), new Date("2023-03-02T00:00:00"));

    vehiculo.bloquear(r1);
    vehiculo.bloquear(r2);

    expect(vehiculo.getRangosBloqueados()).toHaveLength(2);
    expect(vehiculo.getRangosBloqueados()).toEqual(expect.arrayContaining([r1, r2]));

    const r1igual = new RangoDeFechas(new Date("2023-02-01T00:00:00"), new Date("2023-02-03T00:00:00"));
    vehiculo.desbloquear(r1igual);
    expect(vehiculo.getRangosBloqueados()).toHaveLength(1);
    expect(vehiculo.getRangosBloqueados()).toEqual(expect.arrayContaining([r2]));

    vehiculo.limpiarBloqueos();
    expect(vehiculo.getRangosBloqueados()).toHaveLength(0);
  });

  test("estaDisponible delega en DisponibilidadService.estaLibre y pasa los argumentos correctos", () => {
    const spy = jest.spyOn(DisponibilidadService, "estaLibre").mockReturnValue(true);
    const r = new RangoDeFechas(new Date("2023-04-01T00:00:00"), new Date("2023-04-02T00:00:00"));
    vehiculo.bloquear(r);

    const pedido = new RangoDeFechas(new Date("2023-05-01T00:00:00"), new Date("2023-05-02T00:00:00"));
    const resultado = vehiculo.estaDisponible(pedido);
    expect(resultado).toBe(true);
    expect(spy).toHaveBeenCalledWith(pedido, vehiculo.getRangosBloqueados());

    vehiculo.limpiarBloqueos();
  });

  test("getFichaMantenimiento inicializa y notificarAlquilerCompletado delega correctamente", () => {
    const ficha = vehiculo.getFichaMantenimiento();
    expect(ficha).toBeInstanceOf(FichaMantenimiento);
    expect(ficha.getAlquileresDesdeUltimo()).toBe(0);

    vehiculo.notificarAlquilerCompletado();
    expect(ficha.getAlquileresDesdeUltimo()).toBe(1);
  });

  test("marcarEnMantenimiento, marcarLimpieza y marcarDisponible cambian el estado", () => {
    vehiculo.marcarEnMantenimiento();
    expect(vehiculo.getEstado()).toBe(EstadoVehiculo.mantenimiento);

    vehiculo.marcarLimpieza();
    expect(vehiculo.getEstado()).toBe(EstadoVehiculo.limpieza);

    vehiculo.marcarDisponible();
    expect(vehiculo.getEstado()).toBe(EstadoVehiculo.disponible);
  });
});
