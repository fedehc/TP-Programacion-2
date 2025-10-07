export default abstract class Tarifa {
    abstract calcularRecargoTotal(): number;
    abstract calcularCostoKmsTotal(): number;
    abstract calcularTarifaTotal(): number;
}