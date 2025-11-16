import Temporada from "./temporada";
import TemporadaAlta from "./temporadaAlta";
import TemporadaBaja from "./temporadaBaja";
import TemporadaMedia from "./temporadaMedia";

export default class SelectorTemporada {
    public obtener(fechaInicio: Date): Temporada {
    const mes = fechaInicio.getMonth() + 1;

    if (mes === 12 || mes === 1 || mes === 2) {
      return new TemporadaAlta();
    }

    if (mes === 5 || mes === 6) {
      return new TemporadaBaja();
    }

    return new TemporadaMedia();
  }
}
