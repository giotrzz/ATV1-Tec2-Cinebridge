import { describe, it, expect } from 'vitest';
import { criarApp } from '../../src/index.js';

describe('POST /recomendacoes (integração)', () => {
  function corpoValido() {
    return {
      projeto: {
        id: 'proj1',
        genero: 'Ficção',
        duracao: 120,
        orcamento: 10000,
        prazo: '2026-12-01T00:00:00.000Z',
        papeisObrigatorios: ['DIRETOR'],
      },
      profissionais: [
        {
          id: 'p1',
          nome: 'Ana',
          competencias: [],
          disponibilidade: { inicio: '2026-01-01T00:00:00.000Z', fim: '2026-12-31T00:00:00.000Z' },
          precoMedio: 5000,
        },
      ],
    };
  }

  it('deve retornar 200 e a equipe recomendada para uma requisição válida', async () => {
    const app = criarApp();

    const resposta = await app.inject({
      method: 'POST',
      url: '/recomendacoes',
      payload: corpoValido(),
    });

    expect(resposta.statusCode).toBe(200);
    const corpo = resposta.json();
    expect(corpo.membros).toHaveLength(1);
    expect(corpo.membros[0].papel).toBe('DIRETOR');
    expect(corpo.membros[0].profissionalId).toBe('p1');
  });

  it('deve retornar 400 quando o papel obrigatório é inválido', async () => {
    const app = criarApp();
    const corpo = corpoValido();
    corpo.projeto.papeisObrigatorios = ['PAPEL_INEXISTENTE'];

    const resposta = await app.inject({
      method: 'POST',
      url: '/recomendacoes',
      payload: corpo,
    });

    expect(resposta.statusCode).toBe(400);
    expect(resposta.json().erro).toContain('Papel inválido');
  });

  it('deve retornar 400 quando o projeto não atende às restrições (orçamento zero)', async () => {
    const app = criarApp();
    const corpo = corpoValido();
    corpo.projeto.orcamento = 0;

    const resposta = await app.inject({
      method: 'POST',
      url: '/recomendacoes',
      payload: corpo,
    });

    expect(resposta.statusCode).toBe(400);
  });
});