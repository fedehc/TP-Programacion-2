import RangoDeFechas from "../src/Extras/rangoDeFechas";
import DisponibilidadService from "../src/Extras/disponibilidadService";

describe("DisponibilidadService", () => {
  test("true cuando no hay bloqueos", () => {
    const pedido = new RangoDeFechas("2024-07-01", "2024-07-05");
    expect(DisponibilidadService.estaLibre(pedido, [])).toBe(true);
  });

  test("false al solaparse con bloqueo", () => {
    const pedido = new RangoDeFechas("2024-07-10", "2024-07-15");
    const bloqueos = [new RangoDeFechas("2024-07-14", "2024-07-20")];
    expect(DisponibilidadService.estaLibre(pedido, bloqueos)).toBe(false);
  });

  test("true si solo toca borde (fin == inicio)", () => {
    const pedido = new RangoDeFechas("2024-08-01", "2024-08-05");
    const bloqueos = [new RangoDeFechas("2024-08-05", "2024-08-10")];
    expect(DisponibilidadService.estaLibre(pedido, bloqueos)).toBe(true);
  });

  test("false si bloqueo cubre completamente", () => {
    const pedido = new RangoDeFechas("2024-09-05", "2024-09-08");
    const bloqueos = [new RangoDeFechas("2024-09-01", "2024-09-10")];
    expect(DisponibilidadService.estaLibre(pedido, bloqueos)).toBe(false);
  });
});

