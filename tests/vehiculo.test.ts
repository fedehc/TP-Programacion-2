import Vehiculo from "../src/Vehiculo/vehiculo";
import RangoDeFechas from "../src/Extras/rangoDeFechas";
import FichaMantenimiento from "../src/Mantenimiento/fichaMantenimiento";
import DisponibilidadService from "../src/Extras/disponibilidadService";
import { CategoriaVehiculo, EstadoVehiculo } from "../src/Extras/enums";

describe("Vehiculo - pruebas básicas", () => {
  const rango = new RangoDeFechas(new Date("2023-01-01T00:00:00"), new Date("2023-01-03T00:00:00"));
  const tarifaMock: any = { calcularCosto: jest.fn().mockReturnValue(0) };
  const vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaMock, 1000);

  afterEach(() => {
    jest.restoreAllMocks();
    tarifaMock.calcularCosto.mockReset && tarifaMock.calcularCosto.mockReset();
  });

  test("getters: devuelve lo que se pasó al crear", () => {
    expect(vehiculo.getMatricula()).toBe("ABC123");
    expect(vehiculo.getCategoria()).toBe(CategoriaVehiculo.compacto);
    expect(vehiculo.getEstado()).toBe(EstadoVehiculo.disponible);
    expect(vehiculo.getTarifa()).toBe(tarifaMock);
    expect(vehiculo.getKilometraje()).toBe(1000);
  });

  test("setEstado / setKilometraje: actualiza valores", () => {
    vehiculo.setEstado(EstadoVehiculo.mantenimiento);
    expect(vehiculo.getEstado()).toBe(EstadoVehiculo.mantenimiento);

    vehiculo.setKilometraje(12345);
    expect(vehiculo.getKilometraje()).toBe(12345);

    vehiculo.setEstado(EstadoVehiculo.disponible);
    vehiculo.setKilometraje(1000);
  });

  test("bloquear/desbloquear/limpiar: maneja lista de rangos", () => {
    expect(vehiculo.getRangosBloqueados()).toHaveLength(0);

    const rangoUno = new RangoDeFechas(new Date("2023-02-01T00:00:00"), new Date("2023-02-03T00:00:00"));
    const rangoDos = new RangoDeFechas(new Date("2023-03-01T00:00:00"), new Date("2023-03-02T00:00:00"));

    vehiculo.bloquear(rangoUno);
    vehiculo.bloquear(rangoDos);

    expect(vehiculo.getRangosBloqueados()).toHaveLength(2);
    expect(vehiculo.getRangosBloqueados()).toEqual(expect.arrayContaining([rangoUno, rangoDos]));

    const rangoUnoIgual = new RangoDeFechas(new Date("2023-02-01T00:00:00"), new Date("2023-02-03T00:00:00"));
    vehiculo.desbloquear(rangoUnoIgual);
    expect(vehiculo.getRangosBloqueados()).toHaveLength(1);
    expect(vehiculo.getRangosBloqueados()).toEqual(expect.arrayContaining([rangoDos]));

    vehiculo.limpiarBloqueos();
    expect(vehiculo.getRangosBloqueados()).toHaveLength(0);
  });

  test("estaDisponible: llama al service con el rango y bloqueos", () => {
    const espiaEstaLibre = jest.spyOn(DisponibilidadService, "estaLibre").mockReturnValue(true);
    const rangoBloqueo = new RangoDeFechas(new Date("2023-04-01T00:00:00"), new Date("2023-04-02T00:00:00"));
    vehiculo.bloquear(rangoBloqueo);

    const pedido = new RangoDeFechas(new Date("2023-05-01T00:00:00"), new Date("2023-05-02T00:00:00"));
    const resultado = vehiculo.estaDisponible(pedido);
    expect(resultado).toBe(true);
    expect(espiaEstaLibre).toHaveBeenCalledWith(pedido, vehiculo.getRangosBloqueados());

    vehiculo.limpiarBloqueos();
  });

  test("fichaMantenimiento: se crea y aumenta alquileres al notificar", () => {
    const ficha = vehiculo.getFichaMantenimiento();
    expect(ficha).toBeInstanceOf(FichaMantenimiento);
    expect(ficha.getAlquileresDesdeUltimo()).toBe(0);

    vehiculo.notificarAlquilerCompletado();
    expect(ficha.getAlquileresDesdeUltimo()).toBe(1);
  });


  test.skip("marcarEnMantenimiento/limpieza/disponible: cambia estado", () => {
    vehiculo.marcarEnMantenimiento();
    expect(vehiculo.getEstado()).toBe(EstadoVehiculo.mantenimiento);

    vehiculo.marcarLimpieza();
    expect(vehiculo.getEstado()).toBe(EstadoVehiculo.limpieza);

    vehiculo.marcarDisponible();
    expect(vehiculo.getEstado()).toBe(EstadoVehiculo.disponible);
  });
});
