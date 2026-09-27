import { describe, it, expect } from 'vitest';
import { SimilaridadeCosseno } from '../../src/strategies/SimilaridadeCosseno.js';
import { Projeto } from '../../src/domain/entities/Projeto.js';
import { Profissional } from '../../src/domain/entities/Profissional.js';
import { Competencia } from '../../src/domain/entities/Competencia.js';
import { Intervalo } from '../../src/domain/entities/Intervalo.js';
import { Papel } from '../../src/domain/enums/Papel.js';

describe('SimilaridadeCosseno', () => {
  const disponibilidade: Intervalo = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

  const projeto = new Projeto('proj1', 'Ficção', 120, 50000, new Date('2026-12-01'), [Papel.DIRETOR]);

  it('deve priorizar o profissional com maior similaridade de competências', () => {
    const altaSimilaridade = new Profissional(
      'p1',
      'Ana',
      [new Competencia('Direção', 9), new Competencia('Liderança', 8)],
      disponibilidade,
      5000,
    );

    const baixaSimilaridade = new Profissional(
      'p2',
      'Bruno',
      [new Competencia('Direção', 2)],
      disponibilidade,
      5000,
    );

    const estrategia = new SimilaridadeCosseno();
    const resultado = estrategia.recomendar(projeto, [baixaSimilaridade, altaSimilaridade]);

    expect(resultado.get(Papel.DIRETOR)?.[0]?.id).toBe('p1');
  });

  it('deve excluir profissionais sem nenhuma competência relevante (score zero)', () => {
    const semCompetenciaRelevante = new Profissional('p1', 'Ana', [], disponibilidade, 5000);

    const estrategia = new SimilaridadeCosseno();
    const resultado = estrategia.recomendar(projeto, [semCompetenciaRelevante]);

    expect(resultado.get(Papel.DIRETOR)).toEqual([]);
  });
});