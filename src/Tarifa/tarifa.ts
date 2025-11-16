export default interface Tarifa {
    calcularCosto(dias: number, kmRecorridos: number): number;
}