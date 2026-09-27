import { describe, it, expect } from 'vitest';
import { SistemaRecomendacao } from '../../src/observers/SistemaRecomendacao.js';
import { NotificadorEmail } from '../../src/observers/NotificadorEmail.js';
import { NotificadorInterno } from '../../src/observers/NotificadorInterno.js';
import { AuditoriaRecomendacao } from '../../src/observers/AuditoriaRecomendacao.js';
import { Observador } from '../../src/observers/Observador.js';
import { EventoRecomendacao } from '../../src/observers/EventoRecomendacao.js';
import { OrquestradorPadrao } from '../../src/orchestration/OrquestradorPadrao.js';
import { RegrasOrcamento } from '../../src/strategies/RegrasOrcamento.js';
import { Projeto } from '../../src/domain/entities/Projeto.js';
import { Profissional } from '../../src/domain/entities/Profissional.js';
import { Intervalo } from '../../src/domain/entities/Intervalo.js';
import { Papel } from '../../src/domain/enums/Papel.js';

describe('SistemaRecomendacao (Observer)', () => {
  const disponibilidade: Intervalo = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

  function criarSistema(): SistemaRecomendacao {
    return new SistemaRecomendacao(new OrquestradorPadrao(), new RegrasOrcamento());
  }

  function criarProjeto(): Projeto {
    return new Projeto('proj1', 'Ficção', 120, 10000, new Date('2026-12-01'), [Papel.DIRETOR]);
  }

  it('deve notificar múltiplos observadores de forma independente ao gerar uma recomendação', () => {
    const sistema = criarSistema();
    const notificadorEmail = new NotificadorEmail();
    const notificadorInterno = new NotificadorInterno();
    const auditoria = new AuditoriaRecomendacao();

    sistema.adicionarObservador(notificadorEmail);
    sistema.adicionarObservador(notificadorInterno);
    sistema.adicionarObservador(auditoria);

    const projeto = criarProjeto();
    const profissional = new Profissional('p1', 'Ana', [], disponibilidade, 5000);

    sistema.executarRecomendacao(projeto, [profissional]);

    expect(notificadorEmail.eventosRecebidos).toHaveLength(1);
    expect(notificadorInterno.eventosRecebidos).toHaveLength(1);
    expect(auditoria.eventosRecebidos).toHaveLength(1);
    expect(notificadorEmail.eventosRecebidos[0]?.tipo).toBe('RECOMENDACAO_GERADA');
  });

  it('um observador que falha não deve impedir os demais de serem notificados', () => {
    const sistema = criarSistema();

    const observadorQuebrado: Observador = {
      atualizar: () => {
        throw new Error('Falha simulada no observador');
      },
    };
    const observadorSaudavel = new AuditoriaRecomendacao();

    sistema.adicionarObservador(observadorQuebrado);
    sistema.adicionarObservador(observadorSaudavel);

    const projeto = criarProjeto();
    const profissional = new Profissional('p1', 'Ana', [], disponibilidade, 5000);

    expect(() => sistema.executarRecomendacao(projeto, [profissional])).not.toThrow();
    expect(observadorSaudavel.eventosRecebidos).toHaveLength(1);
  });

  it('deve permitir trocar a estratégia em runtime através do SistemaRecomendacao', () => {
    const sistema = criarSistema();
    const projeto = criarProjeto();
    const barato = new Profissional('p1', 'Barato', [], disponibilidade, 100);

    const equipeComOrcamento = sistema.executarRecomendacao(projeto, [barato]);
    expect(equipeComOrcamento.membros).toHaveLength(1);

    sistema.definirEstrategia({
      recomendar: () => new Map(),
    });

    const equipeSemCandidatos = sistema.executarRecomendacao(projeto, [barato]);
    expect(equipeSemCandidatos.membros).toHaveLength(0);
  });

  it('notificarObservadores deve poder ser chamado diretamente com um evento arbitrário', () => {
    const sistema = criarSistema();
    const notificador = new NotificadorEmail();
    sistema.adicionarObservador(notificador);

    const eventoManual = new EventoRecomendacao('TESTE', new Map(), 'origem-teste');
    sistema.notificarObservadores(eventoManual);

    expect(notificador.eventosRecebidos[0]).toBe(eventoManual);
  });
});