import { RecomendacaoStrategy } from './RecomendacaoStrategy.js';
import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';
import { Papel } from '../domain/enums/Papel.js';

// INTERPRETAÇÃO: o diagrama não define contra o que o vetor de competências do profissional
// deve ser comparado. Esta tabela fixa é uma regra de negócio inventada apenas para viabilizar
// o cálculo de similaridade de cosseno, e deve ser validada com o professor.
const COMPETENCIAS_ESPERADAS: Record<Papel, string[]> = {
  [Papel.DIRETOR]: ['Direção', 'Liderança'],
  [Papel.DIRETOR_FOTOGRAFIA]: ['Fotografia', 'Iluminação'],
  [Papel.SONOPLASTA]: ['Som', 'Mixagem'],
  [Papel.EDITOR]: ['Edição', 'Montagem'],
  [Papel.ROTEIRISTA]: ['Roteiro', 'Narrativa'],
  [Papel.EFEITOS_VISUAIS]: ['VFX', 'Animação'],
};

export class SimilaridadeCosseno implements RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const resultado = new Map<Papel, Profissional[]>();

    for (const papel of projeto.papeisObrigatorios) {
      const esperadas = COMPETENCIAS_ESPERADAS[papel];

      const candidatos = profissionais
        .map((p) => ({ profissional: p, score: this.calcularSimilaridade(p, esperadas) }))
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((c) => c.profissional);

      resultado.set(papel, candidatos);
    }

    return resultado;
  }

  private calcularSimilaridade(profissional: Profissional, competenciasEsperadas: string[]): number {
    const vetorProfissional = competenciasEsperadas.map((nome) => {
      const competencia = profissional.competencias.find((c) => c.nome === nome);
      return competencia?.nivel ?? 0;
    });

    const vetorAlvo = competenciasEsperadas.map(() => 1);

    const produtoInterno = vetorProfissional.reduce((acc, v, i) => acc + v * (vetorAlvo[i] ?? 0), 0);
    const normaProfissional = Math.sqrt(vetorProfissional.reduce((acc, v) => acc + v * v, 0));
    const normaAlvo = Math.sqrt(vetorAlvo.reduce((acc, v) => acc + v * v, 0));

    if (normaProfissional === 0 || normaAlvo === 0) return 0;

    return produtoInterno / (normaProfissional * normaAlvo);
  }
}