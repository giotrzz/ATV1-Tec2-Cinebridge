import { describe, it, expect, vi } from 'vitest';
import { OrquestradorPadrao } from '../../src/orchestration/OrquestradorPadrao.js';
import { RegrasOrcamento } from '../../src/strategies/RegrasOrcamento.js';
import { Projeto } from '../../src/domain/entities/Projeto.js';
import { Profissional } from '../../src/domain/entities/Profissional.js';
import { Intervalo } from '../../src/domain/entities/Intervalo.js';
import { Papel } from '../../src/domain/enums/Papel.js';

describe('OrquestradorEquipe (Template Method)', () => {
  const disponibilidade: Intervalo = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

  function criarProjeto(): Projeto {
    return new Projeto('proj1', 'Ficção', 120, 10000, new Date('2026-12-01'), [Papel.DIRETOR]);
  }

  it('deve executar as etapas na ordem fixa: validar -> normalizar -> posProcessar', () => {
    const orquestrador = new OrquestradorPadrao();
    const chamadasEmOrdem: string[] = [];

    const spyValidar = vi.spyOn(orquestrador as any, 'validarRestricoes').mockImplementation((...args) => {
      chamadasEmOrdem.push('validarRestricoes');
      return true;
    });
    const spyNormalizar = vi.spyOn(orquestrador as any, 'normalizarDados').mockImplementation((_p, profs) => {
      chamadasEmOrdem.push('normalizarDados');
      return profs;
    });
    const spyPosProcessar = vi.spyOn(orquestrador as any, 'posProcessar').mockImplementation((rec) => {
      chamadasEmOrdem.push('posProcessar');
      return rec;
    });

    const projeto = criarProjeto();
    const profissional = new Profissional('p1', 'Ana', [], disponibilidade, 5000);

    orquestrador.orquestrar(projeto, new RegrasOrcamento(), [profissional]);

    expect(chamadasEmOrdem).toEqual(['validarRestricoes', 'normalizarDados', 'posProcessar']);

    spyValidar.mockRestore();
    spyNormalizar.mockRestore();
    spyPosProcessar.mockRestore();
  });

  it('deve lançar erro quando validarRestricoes retorna false, sem prosseguir no fluxo', () => {
    const orquestrador = new OrquestradorPadrao();
    const projetoInvalido = new Projeto('proj2', 'Ficção', 120, 0, new Date('2026-12-01'), [Papel.DIRETOR]);

    expect(() => orquestrador.orquestrar(projetoInvalido, new RegrasOrcamento(), [])).toThrow();
  });

  it('deve montar a Equipe com o melhor candidato de cada papel obrigatório', () => {
    const orquestrador = new OrquestradorPadrao();
    const projeto = criarProjeto();
    const profissionalBarato = new Profissional('p1', 'Barato', [], disponibilidade, 1000);

    const equipe = orquestrador.orquestrar(projeto, new RegrasOrcamento(), [profissionalBarato]);

    expect(equipe.membros).toHaveLength(1);
    expect(equipe.membros[0]?.papel).toBe(Papel.DIRETOR);
    expect(equipe.membros[0]?.profissional.id).toBe('p1');
  });

  it('a ordem do fluxo permanece a mesma independentemente da implementação dos hooks', () => {
    class OrquestradorAlternativo extends OrquestradorPadrao {
      protected normalizarDados(projeto: Projeto, profissionais: Profissional[]): Profissional[] {
        return [...profissionais].reverse();
      }
    }

    const projeto = criarProjeto();
    const profissional = new Profissional('p1', 'Ana', [], disponibilidade, 5000);

    const orquestradorPadrao = new OrquestradorPadrao();
    const orquestradorAlternativo = new OrquestradorAlternativo();

    const equipe1 = orquestradorPadrao.orquestrar(projeto, new RegrasOrcamento(), [profissional]);
    const equipe2 = orquestradorAlternativo.orquestrar(projeto, new RegrasOrcamento(), [profissional]);

    expect(equipe1.membros).toHaveLength(1);
    expect(equipe2.membros).toHaveLength(1);
  });

  it('não deve adicionar membro à equipe quando não há candidatos para o papel', () => {
    class OrquestradorSemCandidatos extends OrquestradorPadrao {
      protected posProcessar(): Map<Papel, Profissional[]> {
        return new Map();
      }
    }

    const orquestrador = new OrquestradorSemCandidatos();
    const projeto = criarProjeto();
    const profissional = new Profissional('p1', 'Ana', [], disponibilidade, 5000);

    const equipe = orquestrador.orquestrar(projeto, new RegrasOrcamento(), [profissional]);

    expect(equipe.membros).toHaveLength(0);
  });
});