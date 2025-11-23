import RangoDeFechas from "./rangoDeFechas";


/**
 * Servicio para verificar la disponibilidad de un periodo en un rango de fechas.
 * Proporciona métodos utilitarios para comprobar si un rango está libre considerando bloqueos existentes.
 */
export default class DisponibilidadService {
  /**
   * Verifica si un rango solicitado está libre, es decir, no se superpone con ningún bloqueo.
   * @param {RangoDeFechas} rangoPedido Rango de fechas solicitado.
   * @param {RangoDeFechas[]} bloqueos Lista de rangos bloqueados.
   * @returns {boolean} True si el rango está libre, false si hay superposición.
   */
  static estaLibre(rangoPedido: RangoDeFechas, bloqueos: RangoDeFechas[]): boolean {
    for (const b of bloqueos) {
      if (b.seSuperponeConOtraFecha(rangoPedido)) {
        return false;
      }
    }
    return true;
  }
}

