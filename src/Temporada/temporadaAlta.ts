import Temporada from "./temporada";


export default class TemporadaAlta implements Temporada {
    public obtenerFactor(): number {
        return 1.20;
    }

    public aplicarCostoBase(costoBase: number): number {
        return costoBase * this.obtenerFactor();
    }

}