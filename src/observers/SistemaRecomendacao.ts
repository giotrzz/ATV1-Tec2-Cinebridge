import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';
import { Equipe } from '../domain/entities/Equipe.js';
import { OrquestradorEquipe } from '../orchestration/OrquestradorEquipe.js';
import { RecomendacaoStrategy } from '../strategies/RecomendacaoStrategy.js';
import { Observador } from './Observador.js';
import { EventoRecomendacao } from './EventoRecomendacao.js';

export class SistemaRecomendacao {
  private observadores: Observador[] = [];
  private estrategiaAtual: RecomendacaoStrategy;

  constructor(
    private readonly orquestrador: OrquestradorEquipe,
    estrategiaInicial: RecomendacaoStrategy,
  ) {
    this.estrategiaAtual = estrategiaInicial;
  }

  definirEstrategia(estrategia: RecomendacaoStrategy): void {
    this.estrategiaAtual = estrategia;
  }

  // INTERPRETAÇÃO: mesma lacuna já resolvida em OrquestradorEquipe.orquestrar() — o diagrama
  // não mostra de onde vem a lista de profissionais, então ela entra como parâmetro extra.
  executarRecomendacao(projeto: Projeto, profissionais: Profissional[]): Equipe {
    const equipe = this.orquestrador.orquestrar(projeto, this.estrategiaAtual, profissionais);

    const evento = new EventoRecomendacao(
      'RECOMENDACAO_GERADA',
      new Map<string, unknown>([
        ['projetoId', projeto.id],
        ['equipeId', equipe.id],
      ]),
      'SistemaRecomendacao',
    );

    this.notificarObservadores(evento);

    return equipe;
  }

  adicionarObservador(observador: Observador): void {
    this.observadores.push(observador);
  }

  notificarObservadores(evento: EventoRecomendacao): void {
    for (const observador of this.observadores) {
      try {
        observador.atualizar(evento);
      } catch {
        // Um observador falhar não deve impedir os demais de serem notificados,
        // conforme requisito de tolerância a falhas do enunciado.
      }
    }
  }
}