import Tarifa from "./tarifa";
import Mantenimiento from "./mantenimiento";
import { CategoriaVehiculo } from "./enums";


export default abstract class Vehiculo {
    private categoria: CategoriaVehiculo;
    private matricula: string;
    private estado: string;
    private kilometraje: number;
    private tarifa: Tarifa;
    private mantenimientos: Mantenimiento[];


    getCategoria(): CategoriaVehiculo {  return this.categoria; }
    setCategoria(nuevaCat: CategoriaVehiculo) { this.categoria = nuevaCat; }
    getMatricula(): string {  return this.matricula; }
    setMatricula(nuevaMat: string) { this.matricula = nuevaMat; }
    getEstado(): string { return this.estado; }
    setEstado(nuevoEstado: string) { this.estado = nuevoEstado; }
    getKilometraje(): number { return this.kilometraje; }
    setKilometraje(nuevoKm: number) { this.kilometraje = nuevoKm; }
    getTarifa(): Tarifa { return this.tarifa; }
    setTarifa(nuevaTarifa: Tarifa) { this.tarifa = nuevaTarifa; }  
    getMantenimiento(): Mantenimiento[] { return this.mantenimientos; }
    setMantenimiento(nuevoMant: Mantenimiento[]) { this.mantenimientos = nuevoMant; }


    constructor(categoria: CategoriaVehiculo, matricula: string, estado: string, kilometraje: number,
                tarifa: Tarifa, mantenimientos: Mantenimiento[]) {
        this.categoria = categoria;
        this.matricula = matricula;
        this.estado = estado;
        this.kilometraje = kilometraje;
        this.tarifa = tarifa;
        this.mantenimientos = mantenimientos;
    }
}