import { Observador } from './Observador.js';
import { EventoRecomendacao } from './EventoRecomendacao.js';

export class AuditoriaRecomendacao implements Observador {
  public readonly eventosRecebidos: EventoRecomendacao[] = [];

  atualizar(evento: EventoRecomendacao): void {
    this.eventosRecebidos.push(evento);
  }
}