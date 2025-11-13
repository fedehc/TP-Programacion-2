import ServicioDePrecios from "../src/precioService";
import SelectorTemporada from "../src/temporadaSelector";
import TemporadaAlta from "../src/temporadaAlta";
import TemporadaBaja from "../src/temporadaBaja";
import TemporadaMedia from "../src/temporadaMedia";
import RangoDeFechas from "../src/rangoDeFechas";

describe("SelectorTemporada y ServicioDePrecios", () => {
  test("Selector: meses 12,1,2 -> temporada alta", () => {
    const d1 = new Date("2023-12-15T00:00:00");
    const d2 = new Date("2024-01-10T00:00:00");
    const d3 = new Date("2024-02-01T00:00:00");

    const s = new SelectorTemporada();
    expect(s.obtener(d1)).toBeInstanceOf(TemporadaAlta);
    expect(s.obtener(d2)).toBeInstanceOf(TemporadaAlta);
    expect(s.obtener(d3)).toBeInstanceOf(TemporadaAlta);
  });

  test("Selector: meses 5,6 -> temporada baja", () => {
    const d5 = new Date("2024-05-05T00:00:00");
    const d6 = new Date("2024-06-20T00:00:00");
    const s = new SelectorTemporada();
    expect(s.obtener(d5)).toBeInstanceOf(TemporadaBaja);
    expect(s.obtener(d6)).toBeInstanceOf(TemporadaBaja);
  });

  test("Selector: otros meses -> temporada media", () => {
    const d = new Date("2024-03-15T00:00:00");
    const s = new SelectorTemporada();
    expect(s.obtener(d)).toBeInstanceOf(TemporadaMedia);
  });

  test("Temporadas: factores y aplicarCostoBase", () => {
    const alta = new TemporadaAlta();
    const baja = new TemporadaBaja();
    const media = new TemporadaMedia();

    expect(alta.obtenerFactor()).toBeCloseTo(1.20);
    expect(baja.obtenerFactor()).toBeCloseTo(0.9);
    expect(media.obtenerFactor()).toBeCloseTo(1);

    expect(alta.aplicarCostoBase(100)).toBeCloseTo(120);
    expect(baja.aplicarCostoBase(100)).toBeCloseTo(90);
    expect(media.aplicarCostoBase(100)).toBeCloseTo(100);
  });

  test("ServicioDePrecios.aplicar usa el factor correcto", () => {
    const inicioAlta = new Date("2023-12-01T00:00:00");
    const finAlta = new Date("2023-12-03T00:00:00");
    const rangoAlta = new RangoDeFechas(inicioAlta, finAlta);

    const inicioBaja = new Date("2024-05-01T00:00:00");
    const finBaja = new Date("2024-05-02T00:00:00");
    const rangoBaja = new RangoDeFechas(inicioBaja, finBaja);

    expect(ServicioDePrecios.aplicar(100, rangoAlta)).toBeCloseTo(120);
    expect(ServicioDePrecios.aplicar(100, rangoBaja)).toBeCloseTo(90);
  });

  test("ServicioDePrecios.factorPara invoca al selector con la fecha de inicio", () => {
    const inicio = new Date("2024-03-10T00:00:00");
    const fin = new Date("2024-03-12T00:00:00");
    const rango = new RangoDeFechas(inicio, fin);

    expect(ServicioDePrecios.factorPara(rango)).toBeCloseTo(1);
  });

  test("caso negativo: aplicar con base 0 devuelve 0 independientemente de la temporada", () => {
    const inicio = new Date("2023-12-01T00:00:00");
    const fin = new Date("2023-12-02T00:00:00");
    const rango = new RangoDeFechas(inicio, fin);
    expect(ServicioDePrecios.aplicar(0, rango)).toBe(0);
  });
});
