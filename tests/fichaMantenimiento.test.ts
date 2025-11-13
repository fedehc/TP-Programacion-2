import FichaMantenimiento from "../src/fichaMantenimiento";

describe("FichaMantenimiento", () => {
  test("inicial - sin mantenimiento registrado", () => {
    const ficha = new FichaMantenimiento();
    expect(ficha.getFechaUltimo()).toBeUndefined();
    expect(ficha.getKmUltimo()).toBeUndefined();
    expect(ficha.getAlquileresDesdeUltimo()).toBe(0);
    expect(ficha.huboAlgunaVezMantenimiento()).toBe(false);
  });

  test("contador - registrarAlquilerCompletado incrementa el contador", () => {
    const ficha = new FichaMantenimiento();
    expect(ficha.getAlquileresDesdeUltimo()).toBe(0);
    ficha.registrarAlquilerCompletado();
    expect(ficha.getAlquileresDesdeUltimo()).toBe(1);
    ficha.registrarAlquilerCompletado();
    expect(ficha.getAlquileresDesdeUltimo()).toBe(2);
  });

  test("registrarMantenimiento - actualiza fecha y km y resetea contador", () => {
    const ficha = new FichaMantenimiento();
    ficha.registrarAlquilerCompletado();
    ficha.registrarAlquilerCompletado();
    expect(ficha.getAlquileresDesdeUltimo()).toBe(2);

    const fechaHoy = new Date("2025-11-12T10:00:00");
    ficha.registrarMantenimiento(fechaHoy, 12345, 500);

    expect(ficha.getFechaUltimo()).toBeInstanceOf(Date);
    expect(ficha.getFechaUltimo()!.getTime()).toBe(fechaHoy.getTime());
    expect(ficha.getKmUltimo()).toBe(12345);
    expect(ficha.getAlquileresDesdeUltimo()).toBe(0);
    expect(ficha.huboAlgunaVezMantenimiento()).toBe(true);
  });

  test("registrarMantenimiento - sobrescribe valores previos y resetea contador", () => {
    const ficha = new FichaMantenimiento();
    const fechaPrimero = new Date("2025-01-01T00:00:00");
    ficha.registrarMantenimiento(fechaPrimero, 2000, 100);
    expect(ficha.getFechaUltimo()!.getTime()).toBe(fechaPrimero.getTime());
    expect(ficha.getKmUltimo()).toBe(2000);
    ficha.registrarAlquilerCompletado();
    expect(ficha.getAlquileresDesdeUltimo()).toBe(1);

    const fechaSegundo = new Date("2025-06-01T00:00:00");
    ficha.registrarMantenimiento(fechaSegundo, 5000, 200);
    expect(ficha.getFechaUltimo()!.getTime()).toBe(fechaSegundo.getTime());
    expect(ficha.getKmUltimo()).toBe(5000);
    expect(ficha.getAlquileresDesdeUltimo()).toBe(0);
  });

  test("hubo mantenimiento si kmUltimo existe aunque fechaUltimo sea undefined", () => {
    const fichaMutada = new FichaMantenimiento() as any;
    fichaMutada.kmUltimo = 9999;

    const fichaNueva = new FichaMantenimiento();
    expect(fichaNueva.huboAlgunaVezMantenimiento()).toBe(false);
    expect(fichaMutada.huboAlgunaVezMantenimiento()).toBe(true);
  });
});
