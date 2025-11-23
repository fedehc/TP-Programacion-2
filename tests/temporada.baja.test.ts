import TemporadaBaja from "../src/Temporada/temporadaBaja";

describe("Cálculo de costo en temporada baja", () => {
  test("aplica un 10% de descuento sobre el costo base", () => {
    const temporada = new TemporadaBaja();
    expect(temporada.aplicarCostoBase(1000)).toBe(900);
    expect(temporada.aplicarCostoBase(0)).toBe(0);
    expect(temporada.aplicarCostoBase(500)).toBe(450);
  });

  test("funciona con valores decimales", () => {
    const temporada = new TemporadaBaja();
    expect(temporada.aplicarCostoBase(123.45)).toBeCloseTo(111.105);
  });
});
