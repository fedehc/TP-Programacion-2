import GestorEstadisticas from "../src/Estadistica/gestorEstadisticas";
import CalculadorVehiculos from "../src/Estadistica/calculadorVehiculos";
import CalculadorRentabilidad from "../src/Estadistica/calculadorRentabilidad";
import CalculadorOcupacion from "../src/Estadistica/calculadorOcupacion";
import Alquiler from "../src/Alquiler/alquiler";
import Vehiculo from "../src/Vehiculo/vehiculo";
import RangoDeFechas from "../src/Extras/rangoDeFechas";
import SelectorTemporada from "../src/Temporada/temporadaSelector";
import { CategoriaVehiculo, EstadoReserva, EstadoVehiculo } from "../src/Extras/enums";
import Reserva from "../src/Reserva/reserva";

const tarifaStub: any = { calcularCosto: jest.fn().mockReturnValue(100) };
const selector = new SelectorTemporada();
function crearVehiculo(mat: string, estado: EstadoVehiculo = EstadoVehiculo.disponible): Vehiculo {
  const v = new Vehiculo(mat, CategoriaVehiculo.compacto, tarifaStub, 1000);
  // Forzar estado si se desea ocupación
  if (estado === EstadoVehiculo.alquiler) {
    // cambiar estado internamente usando EnAlquilerState
    const EnAlquilerState = require("../src/Vehiculo/EnAlquilerState").default;
    v.cambiarEstado(new EnAlquilerState());
  }
  return v;
}

function crearAlquiler(id: string, vehiculo: Vehiculo, ini: string, fin: string, costo: number): Alquiler {
  const inicio = new Date(ini);
  const finD = new Date(fin);
  const rango = new RangoDeFechas(inicio, finD);
  const reserva = new Reserva(id + "-R", "CLI-X", rango, EstadoReserva.confirmada, vehiculo);
  const alq = new Alquiler(id, reserva, vehiculo, "CLI-X", rango, vehiculo.getKilometraje(), selector);
  tarifaStub.calcularCosto.mockReturnValueOnce(costo);
  alq.finalizar(vehiculo.getKilometraje() + 10);
  return alq;
}

describe("GestorEstadisticas", () => {
  test("obtiene mas y menos alquilado delegando en calculadorVehiculos", () => {
    const calculadorVeh = new CalculadorVehiculos();
    const calculadorRent = new CalculadorRentabilidad();
    const calculadorOcup = new CalculadorOcupacion();
    const gestor = new GestorEstadisticas(calculadorVeh, calculadorRent, calculadorOcup);

    const vA = crearVehiculo("AA-111-AA");
    const vB = crearVehiculo("BB-222-BB");
    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    const a1 = crearAlquiler("A1", vA, "2024-01-05", "2024-01-07", 500);
    const a2 = crearAlquiler("A2", vA, "2024-01-10", "2024-01-12", 500);
    const b1 = crearAlquiler("B1", vB, "2024-01-08", "2024-01-09", 500);

    const mas = gestor.obtenerVehiculoMasAlquilado([a1, a2, b1], periodo);
    const menos = gestor.obtenerVehiculoMenosAlquilado([a1, a2, b1], periodo);

    expect(mas).toEqual({ matricula: "AA-111-AA", cantidad: 2 });
    expect(menos).toEqual({ matricula: "BB-222-BB", cantidad: 1 });
  });

  test("obtiene mas y menos rentable delegando en calculadorRentabilidad", () => {
    const calculadorVeh = new CalculadorVehiculos();
    const calculadorRent = new CalculadorRentabilidad();
    const calculadorOcup = new CalculadorOcupacion();
    const gestor = new GestorEstadisticas(calculadorVeh, calculadorRent, calculadorOcup);

    const vA = crearVehiculo("AA-111-AA");
    const vB = crearVehiculo("BB-222-BB");
    // costos de mantenimiento
    vA.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-03"), 1000, 300); // reduce rentabilidad
    vB.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-03"), 1000, 50);

    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    const a1 = crearAlquiler("A1", vA, "2024-01-05", "2024-01-07", 2000);
    const b1 = crearAlquiler("B1", vB, "2024-01-08", "2024-01-09", 1200);

    const masRent = gestor.obtenerVehiculoMasRentable([a1, b1], [vA, vB], periodo);
    const menosRent = gestor.obtenerVehiculoMenosRentable([a1, b1], [vA, vB], periodo);

    // Con los valores actuales de costos e ingresos, AA-111-AA resulta mas rentable
    expect(masRent.matricula).toBe("AA-111-AA");
    expect(menosRent.matricula).toBe("BB-222-BB");
    expect(masRent.monto).toBeGreaterThan(menosRent.monto);
  });

  test("obtiene ocupacion flota delegando en calculadorOcupacion", () => {
    const calculadorVeh = new CalculadorVehiculos();
    const calculadorRent = new CalculadorRentabilidad();
    const calculadorOcup = new CalculadorOcupacion();
    const gestor = new GestorEstadisticas(calculadorVeh, calculadorRent, calculadorOcup);

    const vA = crearVehiculo("AA-111-AA", EstadoVehiculo.alquiler);
    const vB = crearVehiculo("BB-222-BB", EstadoVehiculo.disponible);
    const vC = crearVehiculo("CC-333-CC", EstadoVehiculo.alquiler);

    const ocup = gestor.obtenerOcupacionFlota([vA, vB, vC]);
    expect(ocup.total).toBe(3);
    expect(ocup.enAlquiler).toBe(2);
    expect(ocup.porcentaje).toBeCloseTo(66.66, 1);
  });
});
