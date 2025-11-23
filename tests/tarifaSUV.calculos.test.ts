import TarifaSUV from "../src/Tarifa/tarifaSuv";

// Modelo: costo = baseDia*dias + seguroDia*dias + max(0, km - 500) * excedenteKm
// Nota: el límite de 500 km es fijo, independiente de los días.

describe("Cálculos de precio para tarifa SUV", () => {
  test("un día sin kilómetros: base + seguro", () => {
    const tarifa = new TarifaSUV();
    // 80 + 15 = 95
    expect(tarifa.calcularCosto(1, 0)).toBe(95);
  });

  test("dos días con 600 km genera excedente de 100 km", () => {
    const tarifa = new TarifaSUV();
    // base=160 seguro=30 exceso=100 variable=25 total=215
    expect(tarifa.calcularCosto(2, 600)).toBe(215);
  });

  test("tres días exactamente en el límite de 500 km", () => {
    const tarifa = new TarifaSUV();
    // base=240 seguro=45 variable=0 total=285
    expect(tarifa.calcularCosto(3, 500)).toBe(285);
  });

  test("cinco días y 2000 km: gran excedente", () => {
    const tarifa = new TarifaSUV();
    // base=400 seguro=75 exceso=1500 variable=375 total=850
    expect(tarifa.calcularCosto(5, 2000)).toBe(850);
  });

  test("kilometraje negativo se ignora para excedente (solo base + seguro)", () => {
    const tarifa = new TarifaSUV();
    // dias=2 base=160 seguro=30 total=190
    expect(tarifa.calcularCosto(2, -300)).toBe(190);
  });

  test("parámetros personalizados alteran cálculo", () => {
    const tarifa = new TarifaSUV(90, 20, 0.30); // baseDia=90 seguroDia=20 excedenteKm=0.30
    // dias=2 base=180 seguro=40 km=650 exceso=150 variable=45 total=265
    expect(tarifa.calcularCosto(2, 650)).toBe(265);
  });
});
