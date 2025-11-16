import FichaMantenimiento from "../src/Mantenimiento/fichaMantenimiento";

describe("FichaMantenimiento - pruebas", () => {
  test("estado inicial: sin datos todavía", () => {
    const fichaInicial = new FichaMantenimiento();
    expect(fichaInicial.getFechaUltimo()).toBeUndefined();
    expect(fichaInicial.getKmUltimo()).toBeUndefined();
    expect(fichaInicial.getAlquileresDesdeUltimo()).toBe(0);
    expect(fichaInicial.huboAlgunaVezMantenimiento()).toBe(false);
  });

  test("contador: registrarAlquilerCompletado suma 1 cada vez", () => {
    const fichaContador = new FichaMantenimiento();
    expect(fichaContador.getAlquileresDesdeUltimo()).toBe(0);
    fichaContador.registrarAlquilerCompletado();
    expect(fichaContador.getAlquileresDesdeUltimo()).toBe(1);
    fichaContador.registrarAlquilerCompletado();
    expect(fichaContador.getAlquileresDesdeUltimo()).toBe(2);
  });

  test("registrarMantenimiento: guarda fecha/km y pone contador en 0", () => {
    const fichaMant = new FichaMantenimiento();
    fichaMant.registrarAlquilerCompletado();
    fichaMant.registrarAlquilerCompletado();
    expect(fichaMant.getAlquileresDesdeUltimo()).toBe(2);

    const fechaHoy = new Date("2025-11-12T10:00:00");
    fichaMant.registrarMantenimiento(fechaHoy, 12345, 500);

    expect(fichaMant.getFechaUltimo()).toBeInstanceOf(Date);
    expect(fichaMant.getFechaUltimo()!.getTime()).toBe(fechaHoy.getTime());
    expect(fichaMant.getKmUltimo()).toBe(12345);
    expect(fichaMant.getAlquileresDesdeUltimo()).toBe(0);
    expect(fichaMant.huboAlgunaVezMantenimiento()).toBe(true);
  });

  test("registrarMantenimiento: si llamo otra vez reemplaza datos y contador vuelve a 0", () => {
    const fichaReemplazo = new FichaMantenimiento();
    const fechaPrimero = new Date("2025-01-01T00:00:00");
    fichaReemplazo.registrarMantenimiento(fechaPrimero, 2000, 100);
    expect(fichaReemplazo.getFechaUltimo()!.getTime()).toBe(fechaPrimero.getTime());
    expect(fichaReemplazo.getKmUltimo()).toBe(2000);
    fichaReemplazo.registrarAlquilerCompletado();
    expect(fichaReemplazo.getAlquileresDesdeUltimo()).toBe(1);

    const fechaSegundo = new Date("2025-06-01T00:00:00");
    fichaReemplazo.registrarMantenimiento(fechaSegundo, 5000, 200);
    expect(fichaReemplazo.getFechaUltimo()!.getTime()).toBe(fechaSegundo.getTime());
    expect(fichaReemplazo.getKmUltimo()).toBe(5000);
    expect(fichaReemplazo.getAlquileresDesdeUltimo()).toBe(0);
  });

});
