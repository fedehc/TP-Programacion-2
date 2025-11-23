import TemporadaAlta from "../src/Temporada/temporadaAlta";

describe("Cálculo de costo en temporada alta", () => {
  test("aplica un 20% de aumento sobre el costo base", () => {
    const temporada = new TemporadaAlta();
    expect(temporada.aplicarCostoBase(1000)).toBe(1200);
    expect(temporada.aplicarCostoBase(0)).toBe(0);
    expect(temporada.aplicarCostoBase(500)).toBe(600);
  });

  test("funciona con valores decimales", () => {
    const temporada = new TemporadaAlta();
    expect(temporada.aplicarCostoBase(123.45)).toBeCloseTo(148.14);
  });
});
