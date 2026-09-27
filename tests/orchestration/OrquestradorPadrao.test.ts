import { describe, it, expect } from 'vitest';
import { OrquestradorPadrao } from '../../src/orchestration/OrquestradorPadrao.js';
import { Projeto } from '../../src/domain/entities/Projeto.js';
import { Profissional } from '../../src/domain/entities/Profissional.js';
import { Intervalo } from '../../src/domain/entities/Intervalo.js';
import { Papel } from '../../src/domain/enums/Papel.js';

describe('OrquestradorPadrao', () => {
  const disponibilidade: Intervalo = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

  it('normalizarDados deve remover profissionais duplicados por id', () => {
    const orquestrador = new OrquestradorPadrao() as any;
    const projeto = new Projeto('proj1', 'Ficção', 120, 10000, new Date('2026-12-01'), [Papel.DIRETOR]);

    const prof1 = new Profissional('p1', 'Ana', [], disponibilidade, 5000);
    const prof1Duplicado = new Profissional('p1', 'Ana (duplicado)', [], disponibilidade, 5000);
    const prof2 = new Profissional('p2', 'Bruno', [], disponibilidade, 4000);

    const resultado = orquestrador.normalizarDados(projeto, [prof1, prof1Duplicado, prof2]);

    expect(resultado).toHaveLength(2);
    expect(resultado.map((p: Profissional) => p.id)).toEqual(['p1', 'p2']);
  });

  it('posProcessar deve remover papéis sem nenhum candidato', () => {
    const orquestrador = new OrquestradorPadrao() as any;

    const recomendacoes = new Map<Papel, Profissional[]>([
      [Papel.DIRETOR, [new Profissional('p1', 'Ana', [], disponibilidade, 5000)]],
      [Papel.EDITOR, []],
    ]);

    const resultado = orquestrador.posProcessar(recomendacoes);

    expect(resultado.has(Papel.DIRETOR)).toBe(true);
    expect(resultado.has(Papel.EDITOR)).toBe(false);
  });
});