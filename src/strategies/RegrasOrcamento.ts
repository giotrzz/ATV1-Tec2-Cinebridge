import { RecomendacaoStrategy } from './RecomendacaoStrategy.js';
import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';
import { Papel } from '../domain/enums/Papel.js';

export class RegrasOrcamento implements RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const resultado = new Map<Papel, Profissional[]>();
    const tetoPorPapel = projeto.orcamento / projeto.papeisObrigatorios.length;

    for (const papel of projeto.papeisObrigatorios) {
      const candidatos = profissionais
        .filter((p) => p.precoMedio <= tetoPorPapel)
        .sort((a, b) => a.precoMedio - b.precoMedio);

      resultado.set(papel, candidatos);
    }

    return resultado;
  }
}