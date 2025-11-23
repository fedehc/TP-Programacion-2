import CalculadorVehiculos from "../src/Estadistica/calculadorVehiculos";
import Alquiler from "../src/Alquiler/alquiler";
import Vehiculo from "../src/Vehiculo/vehiculo";
import RangoDeFechas from "../src/Extras/rangoDeFechas";
import SelectorTemporada from "../src/Temporada/temporadaSelector";
import { CategoriaVehiculo, EstadoReserva } from "../src/Extras/enums";
import Reserva from "../src/Reserva/reserva";
import { PeriodoRequeridoException, EstadisticasInsuficientesException } from "../src/Excepciones/exceptions";

// Helpers estilo estudiante
const selector = new SelectorTemporada();
const tarifaFake: any = { calcularCosto: jest.fn().mockReturnValue(123) };

function crearAuto(matricula: string, km: number = 1000): Vehiculo {
  return new Vehiculo(matricula, CategoriaVehiculo.compacto, tarifaFake, km);
}

function crearAlq(id: string, auto: Vehiculo, ini: string, fin: string): Alquiler {
  const inicio = new Date(ini);
  const finD = new Date(fin);
  const rango = new RangoDeFechas(inicio, finD);
  const reserva = new Reserva(id + "-R", "CLI-X", rango, EstadoReserva.confirmada, auto);
  // El costo no importa para conteo, finalizar para estado consistente
  const alq = new Alquiler(id, reserva, auto, "CLI-X", rango, auto.getKilometraje(), selector);
  alq.finalizar(auto.getKilometraje() + 50);
  return alq;
}

describe("CalculadorVehiculos", () => {
  test("calcular sin periodo tira error", () => {
    const calc = new CalculadorVehiculos();
    expect(() => calc.calcular([], undefined)).toThrow(PeriodoRequeridoException);
  });

  test("calcular con periodo pero sin alquileres tira error de insuficientes", () => {
    const calc = new CalculadorVehiculos();
    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    expect(() => calc.calcular([], periodo)).toThrow(EstadisticasInsuficientesException);
  });

  test("un solo alquiler -> mas y menos son el mismo", () => {
    const calc = new CalculadorVehiculos();
    const autoA = crearAuto("AA-111-AA");
    const alqA = crearAlq("A1", autoA, "2024-01-05", "2024-01-07");
    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    calc.calcular([alqA], periodo);
    expect(calc.obtenerMasAlquilado()).toEqual({ matricula: "AA-111-AA", cantidad: 1 });
    expect(calc.obtenerMenosAlquilado()).toEqual({ matricula: "AA-111-AA", cantidad: 1 });
  });

  test("varios alquileres distintos -> identifica mas y menos usados", () => {
    const calc = new CalculadorVehiculos();
    const autoA = crearAuto("AA-111-AA");
    const autoB = crearAuto("BB-222-BB");
    const autoC = crearAuto("CC-333-CC");
    const periodo = new RangoDeFechas(new Date("2024-02-01"), new Date("2024-02-28"));

    const alqA1 = crearAlq("A1", autoA, "2024-02-02", "2024-02-04");
    const alqA2 = crearAlq("A2", autoA, "2024-02-10", "2024-02-12");
    const alqB1 = crearAlq("B1", autoB, "2024-02-05", "2024-02-06");
    const alqC1 = crearAlq("C1", autoC, "2024-02-07", "2024-02-09");
    const alqC2 = crearAlq("C2", autoC, "2024-02-15", "2024-02-17");
    const alqC3 = crearAlq("C3", autoC, "2024-02-20", "2024-02-22");

    calc.calcular([alqA1, alqA2, alqB1, alqC1, alqC2, alqC3], periodo);

    expect(calc.obtenerMasAlquilado()).toEqual({ matricula: "CC-333-CC", cantidad: 3 });
    expect(calc.obtenerMenosAlquilado()).toEqual({ matricula: "BB-222-BB", cantidad: 1 });
  });

  test("filtra alquileres fuera del periodo (solo cuenta los que se superponen)", () => {
    const calc = new CalculadorVehiculos();
    const autoA = crearAuto("AA-111-AA");
    const periodo = new RangoDeFechas(new Date("2024-03-10"), new Date("2024-03-20"));

    // Dentro total
    const alq1 = crearAlq("A1", autoA, "2024-03-11", "2024-03-12");
    // Fuera total (abril)
    const alq2 = crearAlq("A2", autoA, "2024-04-01", "2024-04-02");
    // Parcial superposición (empieza antes, termina dentro)
    const alq3 = crearAlq("A3", autoA, "2024-03-05", "2024-03-11");
    // Parcial superposición (empieza dentro, termina después)
    const alq4 = crearAlq("A4", autoA, "2024-03-19", "2024-03-25");

    calc.calcular([alq1, alq2, alq3, alq4], periodo);

    expect(calc.obtenerMasAlquilado()).toEqual({ matricula: "AA-111-AA", cantidad: 3 });
    expect(calc.obtenerMenosAlquilado()).toEqual({ matricula: "AA-111-AA", cantidad: 3 });
  });

  test("empate entre varios -> toma el primero que alcanza máximo y mínimo", () => {
    const calc = new CalculadorVehiculos();
    const autoA = crearAuto("AA-111-AA");
    const autoB = crearAuto("BB-222-BB");
    const periodo = new RangoDeFechas(new Date("2024-05-01"), new Date("2024-05-31"));

    const alqA1 = crearAlq("A1", autoA, "2024-05-02", "2024-05-03");
    const alqB1 = crearAlq("B1", autoB, "2024-05-04", "2024-05-05");

    calc.calcular([alqA1, alqB1], periodo);

    // Ambos con 1 -> mas y menos será el primero que recorra en conteo (AA-111-AA)
    expect(calc.obtenerMasAlquilado()).toEqual({ matricula: "AA-111-AA", cantidad: 1 });
    expect(calc.obtenerMenosAlquilado()).toEqual({ matricula: "AA-111-AA", cantidad: 1 });
  });

  test("recalcular cambia resultados internos", () => {
    const calc = new CalculadorVehiculos();
    const autoA = crearAuto("AA-111-AA");
    const autoB = crearAuto("BB-222-BB");
    const periodo = new RangoDeFechas(new Date("2024-06-01"), new Date("2024-06-30"));

    const alqA1 = crearAlq("A1", autoA, "2024-06-05", "2024-06-06");
    const alqB1 = crearAlq("B1", autoB, "2024-06-07", "2024-06-08");
    const alqB2 = crearAlq("B2", autoB, "2024-06-10", "2024-06-11");

    calc.calcular([alqA1, alqB1, alqB2], periodo);
    expect(calc.obtenerMasAlquilado()).toEqual({ matricula: "BB-222-BB", cantidad: 2 });

    // Segunda tanda: ahora autoA gana
    const alqA2 = crearAlq("A2", autoA, "2024-06-15", "2024-06-16");
    const alqA3 = crearAlq("A3", autoA, "2024-06-20", "2024-06-21");
    calc.calcular([alqA1, alqA2, alqA3], periodo);

    expect(calc.obtenerMasAlquilado()).toEqual({ matricula: "AA-111-AA", cantidad: 3 });
    expect(calc.obtenerMenosAlquilado()).toEqual({ matricula: "AA-111-AA", cantidad: 3 });
  });
});
