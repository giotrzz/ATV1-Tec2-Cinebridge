import { describe, it, expect } from 'vitest';
import { FiltragemColaborativa } from '../../src/strategies/FiltragemColaborativa.js';
import { Projeto } from '../../src/domain/entities/Projeto.js';
import { Profissional } from '../../src/domain/entities/Profissional.js';
import { Avaliacao } from '../../src/domain/entities/Avaliacao.js';
import { Intervalo } from '../../src/domain/entities/Intervalo.js';
import { Papel } from '../../src/domain/enums/Papel.js';

describe('FiltragemColaborativa', () => {
  const disponibilidade: Intervalo = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };
  const projeto = new Projeto('proj1', 'Ficção', 120, 50000, new Date('2026-12-01'), [Papel.DIRETOR]);

  it('deve retornar lista vazia quando nenhum profissional tem avaliações', () => {
    const semAvaliacao = new Profissional('p1', 'Ana', [], disponibilidade, 5000);

    const estrategia = new FiltragemColaborativa();
    const resultado = estrategia.recomendar(projeto, [semAvaliacao]);

    expect(resultado.get(Papel.DIRETOR)).toEqual([]);
  });

  it('deve ordenar profissionais pela média de avaliações, do maior para o menor', () => {
    const mediaAlta = new Profissional('p1', 'Ana', [], disponibilidade, 5000);
    mediaAlta.avaliacoes.push(new Avaliacao(5, 'Ótimo', new Date()), new Avaliacao(4, 'Muito bom', new Date()));

    const mediaBaixa = new Profissional('p2', 'Bruno', [], disponibilidade, 5000);
    mediaBaixa.avaliacoes.push(new Avaliacao(2, 'Regular', new Date()));

    const estrategia = new FiltragemColaborativa();
    const resultado = estrategia.recomendar(projeto, [mediaBaixa, mediaAlta]);

    expect(resultado.get(Papel.DIRETOR)?.map((p) => p.id)).toEqual(['p1', 'p2']);
  });
});