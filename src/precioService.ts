import RangoDeFechas from "./rangoDeFechas";
import SelectorTemporada from "./temporadaSelector";



export default class ServicioDePrecios {
  public static factorPara(periodo: RangoDeFechas): number {
    const selector = new SelectorTemporada();
    return selector.obtener(periodo.getInicio()).obtenerFactor();
  }

  
  public static aplicar(base: number, periodo: RangoDeFechas): number {
    return base * this.factorPara(periodo);
  }
}
