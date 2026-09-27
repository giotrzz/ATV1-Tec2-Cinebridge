import { describe, it, expect } from 'vitest';
import { Profissional } from '../../src/domain/entities/Profissional.js';
import { Competencia } from '../../src/domain/entities/Competencia.js';
import { Avaliacao } from '../../src/domain/entities/Avaliacao.js';
import { Intervalo } from '../../src/domain/entities/Intervalo.js';
import { VisitanteProjeto } from '../../src/visitors/VisitanteProjeto.js';

describe('Profissional', () => {
  const disponibilidade: Intervalo = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

  it('deve armazenar os atributos corretamente', () => {
    const competencias = [new Competencia('Edição', 8)];
    const profissional = new Profissional('p1', 'Ana', competencias, disponibilidade, 5000);

    expect(profissional.id).toBe('p1');
    expect(profissional.nome).toBe('Ana');
    expect(profissional.competencias).toEqual(competencias);
    expect(profissional.disponibilidade).toEqual(disponibilidade);
    expect(profissional.precoMedio).toBe(5000);
    expect(profissional.avaliacoes).toEqual([]);
  });

  it('deve permitir adicionar avaliações à lista', () => {
    const profissional = new Profissional('p1', 'Ana', [], disponibilidade, 5000);
    const avaliacao = new Avaliacao(5, 'Ótimo trabalho', new Date());

    profissional.avaliacoes.push(avaliacao);

    expect(profissional.avaliacoes).toHaveLength(1);
    expect(profissional.avaliacoes[0]).toBe(avaliacao);
  });

  it('deve delegar para o visitante através de aceita()', () => {
    const profissional = new Profissional('p1', 'Ana', [], disponibilidade, 5000);

    const visitanteFake: VisitanteProjeto = {
      visitarProjeto: () => 'projeto-visitado',
      visitarProfissional: (p) => `profissional-${p.id}-visitado`,
    };

    const resultado = profissional.aceita(visitanteFake);

    expect(resultado).toBe('profissional-p1-visitado');
  });
});