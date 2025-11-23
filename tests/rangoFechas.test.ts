import RangoDeFechas from "../src/Extras/rangoDeFechas";
describe("RangoDeFechas - pruebas", () => {
  test("getFin: devuelve la fecha final", () => {
    const inicio = new Date("2023-01-01");
    const fin = new Date("2023-01-03");
    const rango = new RangoDeFechas(inicio, fin);

    expect(rango.getFin().getTime()).toBe(fin.getTime());
  });

  test("diasDeDiferencia: 1 al 3 enero -> 2 días", () => {
    const rangoDosDias = new RangoDeFechas("2023-01-01", "2023-01-03");
    expect(rangoDosDias.diasDeDiferencia()).toBe(2);
  });


  test("esIgualA: detecta rangos idénticos", () => {
    const rangoA = new RangoDeFechas("2023-01-01", "2023-01-03");
    const rangoB = new RangoDeFechas("2023-01-01", "2023-01-03");
    expect(rangoA.esIgualA(rangoB)).toBe(true);
  });

  test("esMismoDiaQueInicio: ignora horas", () => {
    const inicioDia = new Date("2023-01-01T05:30:00");
    const finDia = new Date("2023-01-02T10:00:00");
    const rangoDia = new RangoDeFechas(inicioDia, finDia);
    const otraHora = new Date("2023-01-01T23:59:59");
    expect(rangoDia.esMismoDiaQueInicio(otraHora)).toBe(true);
  });

});

