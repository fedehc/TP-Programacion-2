import Temporada from "./temporada";

export default class TemporadaMedia implements Temporada {
    public obtenerFactor(): number {
        return 1;
    }

    public aplicarCostoBase(costoBase: number): number {
        return costoBase * this.obtenerFactor();
    }

}