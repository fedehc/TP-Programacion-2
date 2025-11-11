import RangoDeFechas from "../src/rangoDeFechas";

describe("RangoDeFechas", () => {
  describe("consultas por fecha puntual (normaliza a 00:00)", () => {
    test("esMismoDiaQueInicio: true si es el mismo día (ignora horas)", () => {
      const r = new RangoDeFechas(
        new Date(2025, 1, 10, 0, 0, 0),
        new Date(2025, 1, 12, 23, 59, 59)
      );

      const mismaFechaConHora = new Date(2025, 1, 10, 18, 30, 0);
      expect(r.esMismoDiaQueInicio(mismaFechaConHora)).toBe(true);
    });

    test("esAntesDeFin: true el día anterior, false si es el mismo día que fin", () => {
      const r = new RangoDeFechas(
        new Date(2025, 1, 10, 0, 0, 0),
        new Date(2025, 1, 12, 0, 0, 0)
      );

      expect(r.esAntesDeFin(new Date(2025, 1, 11, 23, 59, 59))).toBe(true);
      expect(r.esAntesDeFin(new Date(2025, 1, 12, 0, 0, 1))).toBe(false);
    });

    test("esIgualOPosteriorAFin complementa a esAntesDeFin", () => {
      const r = new RangoDeFechas(
        new Date(2025, 1, 10, 0, 0, 0),
        new Date(2025, 1, 12, 0, 0, 0)
      );

      expect(r.esIgualOPosteriorAFin(new Date(2025, 1, 11))).toBe(false);
      expect(r.esIgualOPosteriorAFin(new Date(2025, 1, 12))).toBe(true);  
      expect(r.esIgualOPosteriorAFin(new Date(2025, 1, 13))).toBe(true);  
    });
  });

  describe("diasDeDiferencia", () => {
    test("redondea hacia arriba (ceil) los días", () => {
      const r = new RangoDeFechas(
        new Date(2025, 0, 1, 0, 0, 0),
        new Date(2025, 0, 3, 1, 0, 0)
      );
      expect(r.diasDeDiferencia()).toBe(3);
    });

    test("exactamente 2 días de diferencia", () => {
      const r = new RangoDeFechas(
        new Date(2025, 0, 1, 0, 0, 0),
        new Date(2025, 0, 3, 0, 0, 0)
      );
      expect(r.diasDeDiferencia()).toBe(2);
    });
  });
});
