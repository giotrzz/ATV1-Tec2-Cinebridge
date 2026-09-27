import { RecomendacaoStrategy } from './RecomendacaoStrategy.js';
import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';
import { Papel } from '../domain/enums/Papel.js';

export class FiltragemColaborativa implements RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const resultado = new Map<Papel, Profissional[]>();

    for (const papel of projeto.papeisObrigatorios) {
      const candidatos = profissionais
        .filter((p) => p.avaliacoes.length > 0)
        .sort((a, b) => this.mediaAvaliacoes(b) - this.mediaAvaliacoes(a));

      resultado.set(papel, candidatos);
    }

    return resultado;
  }

  private mediaAvaliacoes(profissional: Profissional): number {
    const soma = profissional.avaliacoes.reduce((acc, a) => acc + a.nota, 0);
    return soma / profissional.avaliacoes.length;
  }
}