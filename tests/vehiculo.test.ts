import Vehiculo from "../src/vehiculo";
import { CategoriaVehiculo, EstadoVehiculo } from "../src/enums";
import RangoDeFechas from "../src/rangoDeFechas";
import Tarifa from "../src/tarifa";

jest.mock("../src/disponibilidadService", () => ({
  __esModule: true,
  default: { estaLibre: jest.fn() }
}));
import DisponibilidadService from "../src/disponibilidadService";

describe("Tests de la clase Vehiculo", () => {
  let v: Vehiculo;
  let tarifa: Tarifa;

  beforeEach(() => {
    tarifa = { getPrecioBase: () => 1000 } as any;
    v = new Vehiculo("ABC123", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifa, 5000);
    (DisponibilidadService.estaLibre as jest.Mock).mockReset();
  });

  it("crea un Vehiculo disponible con sus datos básicos", () => {
    expect(v).toBeInstanceOf(Vehiculo);
    expect(v.getMatricula()).toBe("ABC123");
    expect(v.getCategoria()).toBe(CategoriaVehiculo.compacto);
    expect(v.getEstado()).toBe(EstadoVehiculo.disponible);
    expect(v.getTarifa()).toBe(tarifa);
    expect(v.getKilometraje()).toBe(5000);
  });

  it("bloquear agrega un rango a los bloqueos", () => {
    const r = new RangoDeFechas(new Date(2025, 0, 1), new Date(2025, 0, 5));
    v.bloquear(r);
    expect(v.getRangosBloqueados()).toHaveLength(1);
    expect(v.getRangosBloqueados()[0]).toBe(r);
  });

  it("desbloquear elimina el rango exacto bloqueado (por referencia)", () => {
    const r1 = new RangoDeFechas(new Date(2025, 0, 1), new Date(2025, 0, 5));
    const r2 = new RangoDeFechas(new Date(2025, 1, 1), new Date(2025, 1, 5));
    v.bloquear(r1);
    v.bloquear(r2);

    v.desbloquear(r1);
    expect(v.getRangosBloqueados()).toHaveLength(1);
    expect(v.getRangosBloqueados()[0]).toBe(r2);
  });

  it("limpiarBloqueos deja el auto sin bloqueos", () => {
    v.bloquear(new RangoDeFechas(new Date(2025, 0, 1), new Date(2025, 0, 5)));
    v.bloquear(new RangoDeFechas(new Date(2025, 2, 1), new Date(2025, 2, 5)));
    v.limpiarBloqueos();
    expect(v.getRangosBloqueados()).toHaveLength(0);
  });

  it("estaDisponible consulta al service y respeta su respuesta (false)", () => {
    const pedido = new RangoDeFechas(new Date(2025, 0, 10), new Date(2025, 0, 12));
    (DisponibilidadService.estaLibre as jest.Mock).mockReturnValue(false);

    const disponible = v.estaDisponible(pedido);

    expect(DisponibilidadService.estaLibre).toHaveBeenCalledWith(pedido, v.getRangosBloqueados());
    expect(disponible).toBe(false);
  });

  it("estaDisponible consulta al service y respeta su respuesta (true)", () => {
    const pedido = new RangoDeFechas(new Date(2025, 3, 10), new Date(2025, 3, 12));
    (DisponibilidadService.estaLibre as jest.Mock).mockReturnValue(true);

    const disponible = v.estaDisponible(pedido);

    expect(DisponibilidadService.estaLibre).toHaveBeenCalledWith(pedido, v.getRangosBloqueados());
    expect(disponible).toBe(true);
  });

  it("cambia estado y kilometraje (setters simples)", () => {
    v.setEstado(EstadoVehiculo.mantenimiento);
    v.setKilometraje(5050);
    expect(v.getEstado()).toBe(EstadoVehiculo.mantenimiento);
    expect(v.getKilometraje()).toBe(5050);
  });
});
