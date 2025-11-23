import TarifaSedan from "../src/Tarifa/tarifaSedan";

// Modelo: costo = baseDia * dias + kmRecorridos * porKm

describe("Cálculos de precio para tarifa de sedán", () => {
  test("un día sin kilómetros solo cobra base", () => {
    const tarifa = new TarifaSedan();
    expect(tarifa.calcularCosto(1, 0)).toBe(50);
  });

  test("tres días con 120 km suma variable correcta", () => {
    const tarifa = new TarifaSedan();
    // base=150 variable=24 total=174
    expect(tarifa.calcularCosto(3, 120)).toBe(174);
  });

  test("diez días y mil kilómetros", () => {
    const tarifa = new TarifaSedan();
    // base=500 variable=200 total=700
    expect(tarifa.calcularCosto(10, 1000)).toBe(700);
  });

  test("cero días con kilómetros cobra solo componente variable", () => {
    const tarifa = new TarifaSedan();
    // base=0 variable=20
    expect(tarifa.calcularCosto(0, 100)).toBe(20);
  });

  test("kilometraje negativo reduce el costo (comportamiento actual)", () => {
    const tarifa = new TarifaSedan();
    // base=50 variable=-20 total=30
    expect(tarifa.calcularCosto(1, -100)).toBe(30);
  });

  test("parámetros personalizados cambian el resultado", () => {
    const tarifa = new TarifaSedan(60, 0.25); // baseDia=60 porKm=0.25
    // dias=2 base=120 km=300 variable=75 total=195
    expect(tarifa.calcularCosto(2, 300)).toBe(195);
  });
});
