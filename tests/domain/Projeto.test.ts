import { describe, it, expect } from 'vitest';
import { Projeto } from '../../src/domain/entities/Projeto.js';
import { VisitanteProjeto } from '../../src/visitors/VisitanteProjeto.js';
import { Papel } from '../../src/domain/enums/Papel.js';
import { Profissional } from '../../src/domain/entities/Profissional.js';
import { Intervalo } from '../../src/domain/entities/Intervalo.js';

describe('Projeto', () => {
  function criarProjeto(): Projeto {
    return new Projeto('proj1', 'Ficção', 120, 50000, new Date('2026-12-01'), [Papel.DIRETOR]);
  }

  it('deve armazenar os atributos corretamente', () => {
    const projeto = criarProjeto();

    expect(projeto.id).toBe('proj1');
    expect(projeto.genero).toBe('Ficção');
    expect(projeto.duracao).toBe(120);
    expect(projeto.orcamento).toBe(50000);
    expect(projeto.prazo).toEqual(new Date('2026-12-01'));
    expect(projeto.papeisObrigatorios).toEqual([Papel.DIRETOR]);
  });

  it('deve delegar para o visitante através de aceita()', () => {
    const projeto = criarProjeto();

    const visitanteFake: VisitanteProjeto = {
      visitarProjeto: (p) => `projeto-${p.id}-visitado`,
      visitarProfissional: () => 'profissional-visitado',
    };

    const resultado = projeto.aceita(visitanteFake);

    expect(resultado).toBe('projeto-proj1-visitado');
  });

  it('aceitarRecomendacao ainda não implementado deve lançar erro', () => {
    const projeto = criarProjeto();
    const disponibilidade: Intervalo = { inicio: new Date(), fim: new Date('2027-01-01') };
    const profissional = new Profissional('p1', 'Ana', [], disponibilidade, 5000);

    expect(() => projeto.aceitarRecomendacao(Papel.DIRETOR, profissional)).toThrow();
  });

  it('substituirMembro ainda não implementado deve lançar erro', () => {
    const projeto = criarProjeto();
    const disponibilidade: Intervalo = { inicio: new Date(), fim: new Date('2027-01-01') };
    const profissional = new Profissional('p1', 'Ana', [], disponibilidade, 5000);

    expect(() => projeto.substituirMembro(Papel.DIRETOR, profissional)).toThrow();
  });

  it('solicitarReavaliacao ainda não implementado deve lançar erro', () => {
    const projeto = criarProjeto();

    expect(() => projeto.solicitarReavaliacao()).toThrow();
  });
});