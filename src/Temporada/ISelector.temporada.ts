import Temporada from "./temporada";

export default interface ISelectorTemporada {
    obtener(fecha: Date): Temporada;
}