import { describe, it, expect } from 'vitest';
import { RegrasOrcamento } from '../../src/strategies/RegrasOrcamento.js';
import { FiltragemColaborativa } from '../../src/strategies/FiltragemColaborativa.js';
import { Projeto } from '../../src/domain/entities/Projeto.js';
import { Profissional } from '../../src/domain/entities/Profissional.js';
import { Avaliacao } from '../../src/domain/entities/Avaliacao.js';
import { Intervalo } from '../../src/domain/entities/Intervalo.js';
import { Papel } from '../../src/domain/enums/Papel.js';

describe('Troca de estratégia de recomendação', () => {
  const disponibilidade: Intervalo = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

  const projeto = new Projeto('proj1', 'Ficção', 120, 10000, new Date('2026-12-01'), [Papel.DIRETOR]);

  const caroBemAvaliado = new Profissional('p1', 'Caro', [], disponibilidade, 9000);
  caroBemAvaliado.avaliacoes.push(new Avaliacao(5, 'Excelente', new Date()));

  const baratoSemAvaliacao = new Profissional('p2', 'Barato', [], disponibilidade, 1000);

  const profissionais = [caroBemAvaliado, baratoSemAvaliacao];

  it('RegrasOrcamento prioriza o profissional mais barato', () => {
    const estrategia = new RegrasOrcamento();
    const resultado = estrategia.recomendar(projeto, profissionais);

    expect(resultado.get(Papel.DIRETOR)?.[0]?.id).toBe('p2');
  });

  it('FiltragemColaborativa prioriza o profissional mais bem avaliado, mesmo sendo mais caro', () => {
    const estrategia = new FiltragemColaborativa();
    const resultado = estrategia.recomendar(projeto, profissionais);

    expect(resultado.get(Papel.DIRETOR)?.[0]?.id).toBe('p1');
  });

  it('a mesma entrada produz saídas diferentes dependendo da estratégia escolhida', () => {
    const resultadoOrcamento = new RegrasOrcamento().recomendar(projeto, profissionais);
    const resultadoColaborativo = new FiltragemColaborativa().recomendar(projeto, profissionais);

    expect(resultadoOrcamento.get(Papel.DIRETOR)?.[0]?.id).not.toBe(
      resultadoColaborativo.get(Papel.DIRETOR)?.[0]?.id,
    );
  });
});