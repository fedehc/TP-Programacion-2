import TarifaCompacto from "../src/Tarifa/tarifaCompacto";

// Tests naturales sobre la lógica de TarifaCompacto
// Modelo: costo = baseDia * dias + max(0, km - (100*dias)) * excedenteKm

describe("Cálculos de precio para tarifa de auto compacto", () => {
  test("un día sin kilómetros: solo base", () => {
    const tarifa = new TarifaCompacto();
    expect(tarifa.calcularCosto(1, 0)).toBe(30);
  });

  test("dos días y kilómetros por debajo del límite: sin excedente", () => {
    const tarifa = new TarifaCompacto();
    expect(tarifa.calcularCosto(2, 150)).toBe(60); // limite = 200
  });

  test("tres días con 400 km genera excedente de 100 km", () => {
    const tarifa = new TarifaCompacto();
    // base = 90, exceso = 100 * 0.15 = 15
    expect(tarifa.calcularCosto(3, 400)).toBeCloseTo(105);
  });

  test("exactamente en el límite no suma variable", () => {
    const tarifa = new TarifaCompacto();
    expect(tarifa.calcularCosto(5, 500)).toBe(150);
  });

  test("gran recorrido produce costo creciente por excedente", () => {
    const tarifa = new TarifaCompacto();
    // dias=10 base=300 limite=1000 exceso=1000 variable=150 total=450
    expect(tarifa.calcularCosto(10, 2000)).toBe(450);
  });

  test("kilometraje negativo se trata como 0 excedente (solo base)", () => {
    const tarifa = new TarifaCompacto();
    expect(tarifa.calcularCosto(2, -50)).toBe(60);
  });

  test("cero días con kilómetros cobra solo excedente sobre límite cero", () => {
    const tarifa = new TarifaCompacto();
    // dias=0 base=0 limite=0 exceso=100 variable=15
    expect(tarifa.calcularCosto(0, 100)).toBe(15);
  });

  test("parámetros personalizados ajustan el cálculo", () => {
    const tarifa = new TarifaCompacto(40, 0.10); // baseDia=40, excedente=0.10
    // dias=2 base=80 limite=200 km=280 exceso=80 variable=8 total=88
    expect(tarifa.calcularCosto(2, 280)).toBe(88);
  });
});
