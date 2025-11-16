export default interface Temporada{
    obtenerFactor(): number;
    aplicarCostoBase(costoBase: number): number;
}