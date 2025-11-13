import RangoDeFechas from "../src/rangoDeFechas";
describe("RangoDeFechas", () => {
  test("getFin debe devolver la fecha de fin pasada en el constructor", () => {
    const inicio = new Date("2023-01-01");
    const fin = new Date("2023-01-03");
    const rango = new RangoDeFechas(inicio, fin);

    expect(rango.getFin().getTime()).toBe(fin.getTime());
  });

  test("diasDeDiferencia debe devolver 2 para 2023-01-01 a 2023-01-03", () => {
    const rango = new RangoDeFechas("2023-01-01", "2023-01-03");
    expect(rango.diasDeDiferencia()).toBe(2);
  });

  test("seCruzaCon debe ser true para rangos que se solapan", () => {
    const a = new RangoDeFechas("2023-01-01", "2023-01-04");
    const b = new RangoDeFechas("2023-01-03", "2023-01-05");
    expect(a.seCruzaCon(b)).toBe(true);
    expect(b.seCruzaCon(a)).toBe(true);
  });

  test("seCruzaCon debe ser false para rangos contiguos sin solapamiento", () => {
    const a = new RangoDeFechas("2023-01-01", "2023-01-02");
    const b = new RangoDeFechas("2023-01-02", "2023-01-03");
    expect(a.seCruzaCon(b)).toBe(false);
    expect(b.seCruzaCon(a)).toBe(false);
  });

  test("esIgualA debe detectar rangos idénticos", () => {
    const a = new RangoDeFechas("2023-01-01", "2023-01-03");
    const b = new RangoDeFechas("2023-01-01", "2023-01-03");
    expect(a.esIgualA(b)).toBe(true);
  });

  test("esMismoDiaQueInicio debe comparar por día (ignora horas)", () => {
    const inicio = new Date("2023-01-01T05:30:00");
    const fin = new Date("2023-01-02T10:00:00");
    const rango = new RangoDeFechas(inicio, fin);
    const otra = new Date("2023-01-01T23:59:59");
    expect(rango.esMismoDiaQueInicio(otra)).toBe(true);
  });

  test("getFin debe devolver la fecha de fin pasada en el constructor", () => {
    const inicio = new Date("2023-01-01");
    const fin = new Date("2023-01-03");
    const rango = new RangoDeFechas(inicio, fin);
  
    expect(rango.getFin().getTime()).toBe(fin.getTime());
  });
});

