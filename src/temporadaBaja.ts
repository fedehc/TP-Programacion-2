import Temporada from "./temporada";

export default class TemporadaBaja implements Temporada {
    public obtenerFactor(): number {
        return 0.9;
    }

    public aplicarCostoBase(costoBase: number): number {
        return costoBase * this.obtenerFactor();
    }


}