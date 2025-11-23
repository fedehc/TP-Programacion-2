import TemporadaMedia from "../src/Temporada/temporadaMedia";

describe("Cálculo de costo en temporada media", () => {
  test("no modifica el costo base", () => {
    const temporada = new TemporadaMedia();
    expect(temporada.aplicarCostoBase(1000)).toBe(1000);
    expect(temporada.aplicarCostoBase(0)).toBe(0);
    expect(temporada.aplicarCostoBase(500)).toBe(500);
  });

  test("funciona con valores decimales", () => {
    const temporada = new TemporadaMedia();
    expect(temporada.aplicarCostoBase(123.45)).toBeCloseTo(123.45);
  });
});
