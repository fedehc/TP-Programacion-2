import RangoDeFechas from "../src/Extras/rangoDeFechas";
import { RangoInvalidoException } from "../src/Excepciones/exceptions";

describe("test rangoDeFechasl", () => {
  test("crea bien inicio y fin", () => {
    const r = new RangoDeFechas("2024-01-01", "2024-01-03");
    expect(r.getInicio()).toBeInstanceOf(Date);
    expect(r.getFin()).toBeInstanceOf(Date);
  });

  test("lanza si inicio >= fin", () => {
    expect(() => new RangoDeFechas("2024-01-05", "2024-01-05")).toThrowError(/Rango inválido/i);
    expect(() => new RangoDeFechas("2024-01-06", "2024-01-05")).toThrowError(/Rango inválido/i);
  });

  test("diasDeDiferencia usa ceil", () => {
    const r = new RangoDeFechas("2024-02-01", "2024-02-03");
    expect(r.diasDeDiferencia()).toBe(2);
  });

  test("superposicion true cuando hay cruce", () => {
    const a = new RangoDeFechas("2024-03-01", "2024-03-10");
    const b = new RangoDeFechas("2024-03-05", "2024-03-12");
    expect(a.seSuperponeConOtraFecha(b)).toBe(true);
  });

  test("superposicion false cuando solo tocan borde", () => {
    const a = new RangoDeFechas("2024-04-01", "2024-04-05");
    const b = new RangoDeFechas("2024-04-05", "2024-04-07");
    expect(a.seSuperponeConOtraFecha(b)).toBe(false);
  });

  test("esMismoDiaQueInicio reconoce mismo dia", () => {
    const r = new RangoDeFechas("2024-05-10T10:00:00", "2024-05-12T00:00:00");
    expect(r.esMismoDiaQueInicio(new Date("2024-05-10T23:59:59"))).toBe(true);
    expect(r.esMismoDiaQueInicio(new Date("2024-05-11T00:00:00"))).toBe(false);
  });

  test("esIgualA compara fechas iguales", () => {
    const r1 = new RangoDeFechas("2024-06-01", "2024-06-02");
    const r2 = new RangoDeFechas("2024-06-01", "2024-06-02");
    const r3 = new RangoDeFechas("2024-06-01", "2024-06-03");
    expect(r1.esIgualA(r2)).toBe(true);
    expect(r1.esIgualA(r3)).toBe(false);
  });
});
