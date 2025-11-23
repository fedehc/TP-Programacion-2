/**
 * @todo Evaluar el uso del patrón Builder para la construcción de Alquiler,
 * especialmente si se agregan más parámetros opcionales o lógica de inicialización.
 */
import { AlquilerNoFinalizadoException, KilometrajeInvalidoException } from "../Excepciones/alquilerExceptions";
import { AlquilerEstadoInvalidoException } from "../Excepciones/exceptions";

import { EstadoAlquiler } from "../Extras/enums";
import RangoDeFechas from "../Extras/rangoDeFechas";
import Reserva from "../Reserva/reserva";
import ISelectorTemporada from "../Temporada/ISelector.temporada";
import Vehiculo from "../Vehiculo/vehiculo";

/**
 * Representa un alquiler de un vehículo por un cliente en un rango de fechas determinado.
 * Gestiona el estado, kilometraje y costos asociados al alquiler.
 */
export default class Alquiler {
    constructor(
        private id: string,
        private reserva: Reserva,
        private vehiculo: Vehiculo,
        private clienteId: string,
        private rango: RangoDeFechas,
        private kilometrajeInicial: number,
        private selector: ISelectorTemporada,
        private estado: EstadoAlquiler = EstadoAlquiler.activo,
        private kilometrajeFinal?: number,
        private costoTotal?: number
    ) { }

    public getId(): string {
        return this.id;
    }

    public getReserva(): Reserva {
        return this.reserva;
    }

    public getVehiculo(): Vehiculo {
        return this.vehiculo;
    }
    public getClienteId(): string { return this.clienteId; }

    public getRango(): RangoDeFechas {
        return this.rango;
    }

    public getKilometrajeInicial(): number {
        return this.kilometrajeInicial;
    }

    public getKilometrajeFinal(): number | undefined {
        return this.kilometrajeFinal;
    }

    public getEstado(): EstadoAlquiler {
        return this.estado;
    }

    public getCostoTotal(): number | undefined {
        return this.costoTotal;
    }

    public validarFinalizacion(kmFinal: number): void {
        if (this.estado !== EstadoAlquiler.activo) {
            throw new AlquilerEstadoInvalidoException("No se puede finalizar alquiler porque el alquiler no está activo.");
        }
        if (kmFinal < this.kilometrajeInicial) {
            throw new KilometrajeInvalidoException(this.kilometrajeInicial, kmFinal);
        }
    }

    public getKmRecorridos(): number {
        if (this.kilometrajeFinal === undefined) {
            throw new AlquilerNoFinalizadoException("El alquiler no fue finalizado todavía.");
        }
        return this.kilometrajeFinal - this.kilometrajeInicial;
    }

    public calcularCostoTotal(): number {
        const dias = this.rango.diasDeDiferencia();
        const kmRecorridos = this.getKmRecorridos();
        const costoBase = this.vehiculo.getTarifa().calcularCosto(dias, kmRecorridos);
        const temporada = this.selector.obtener(this.rango.getInicio());
        const costoFinal = temporada.aplicarCostoBase(costoBase);

        /* NOTA PARA FUTURAS MEJORAS:
        * Si en el futuro se agregan descuentos, promociones o recargos, convendría
        * sacar esta lógica a un servicio de precios (por ejemplo, ServicioDePrecios).
        *
        * Ese servicio podría aplicar una cadena de ajustes usando un patrón Decorator
        * (o, Chain of Responsibility), con cosas como:
        * AjusteTemporada, AjusteDescuentoVIP, AjustePromocion, etc.
      */
        return costoFinal;
    }

    public finalizar(kmFinal: number): void {
        this.validarFinalizacion(kmFinal);
        this.kilometrajeFinal = kmFinal;
        this.costoTotal = this.calcularCostoTotal();
        this.estado = EstadoAlquiler.finalizado;
    }
}