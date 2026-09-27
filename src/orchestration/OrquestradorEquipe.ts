import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';
import { Equipe } from '../domain/entities/Equipe.js';
import { MembroEquipe } from '../domain/entities/MembroEquipe.js';
import { Papel } from '../domain/enums/Papel.js';
import { RecomendacaoStrategy } from '../strategies/RecomendacaoStrategy.js';

export abstract class OrquestradorEquipe {
  // Método template: a ordem das etapas é fixa e não pode ser alterada pelas subclasses.
  orquestrar(
    projeto: Projeto,
    estrategia: RecomendacaoStrategy,
    profissionais: Profissional[],
  ): Equipe {
    const restricoesValidas = this.validarRestricoes(projeto);
    if (!restricoesValidas) {
      throw new Error(`Projeto ${projeto.id} não atende às restrições necessárias.`);
    }

    const profissionaisNormalizados = this.normalizarDados(projeto, profissionais);

    // INTERPRETAÇÃO: a chamada à estratégia não é um hook nomeado no diagrama — fica fixa
    // dentro do método template, entre normalizarDados e posProcessar.
    const recomendacoes = estrategia.recomendar(projeto, profissionaisNormalizados);

    const recomendacoesProcessadas = this.posProcessar(recomendacoes);

    // INTERPRETAÇÃO: o diagrama não define como o Map<Papel, Profissional[]> retornado pela
    // estratégia vira uma Equipe. Esta montagem (pegar o melhor candidato de cada papel) é
    // fixa dentro do template, pela mesma lógica aplicada à chamada da estratégia acima.
    return this.montarEquipe(projeto, recomendacoesProcessadas);
  }

  protected abstract validarRestricoes(projeto: Projeto): boolean;

  protected abstract normalizarDados(
    projeto: Projeto,
    profissionais: Profissional[],
  ): Profissional[];

  protected abstract posProcessar(
    recomendacoes: Map<Papel, Profissional[]>,
  ): Map<Papel, Profissional[]>;

  private montarEquipe(projeto: Projeto, recomendacoes: Map<Papel, Profissional[]>): Equipe {
    const equipe = new Equipe(`equipe-${projeto.id}`, new Date(), 'EM_FORMACAO');

    for (const papel of projeto.papeisObrigatorios) {
      const candidatos = recomendacoes.get(papel) ?? [];
      const melhorCandidato = candidatos[0];

      if (melhorCandidato) {
        equipe.membros.push(new MembroEquipe(papel, melhorCandidato));
      }
    }

    return equipe;
  }
}