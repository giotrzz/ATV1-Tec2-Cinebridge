import { describe, it, expect } from 'vitest';
import { ValidadorConsistencia } from '../../src/visitors/ValidadorConsistencia.js';
import { CalculadorCompatibilidade } from '../../src/visitors/CalculadorCompatibilidade.js';
import { GeradorRelatorio } from '../../src/visitors/GeradorRelatorio.js';
import { Projeto } from '../../src/domain/entities/Projeto.js';
import { Profissional } from '../../src/domain/entities/Profissional.js';
import { Competencia } from '../../src/domain/entities/Competencia.js';
import { Intervalo } from '../../src/domain/entities/Intervalo.js';
import { Papel } from '../../src/domain/enums/Papel.js';

describe('Visitantes (Visitor)', () => {
  const disponibilidade: Intervalo = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

  function criarProjeto(): Projeto {
    return new Projeto('proj1', 'Ficção', 120, 10000, new Date('2026-12-01'), [Papel.DIRETOR]);
  }

  function criarProfissional(): Profissional {
    return new Profissional(
      'p1',
      'Ana',
      [new Competencia('Direção', 8), new Competencia('Liderança', 6)],
      disponibilidade,
      5000,
    );
  }

  it('cada visitante realiza uma operação distinta sobre o mesmo Projeto, via aceita()', () => {
    const projeto = criarProjeto();

    const consistente = projeto.aceita(new ValidadorConsistencia());
    const compatibilidade = projeto.aceita(new CalculadorCompatibilidade());
    const relatorio = projeto.aceita(new GeradorRelatorio());

    expect(consistente).toBe(true);
    expect(compatibilidade).toBe(10000);
    expect(typeof relatorio).toBe('string');
    expect(relatorio).toContain('proj1');
  });

  it('cada visitante realiza uma operação distinta sobre o mesmo Profissional, via aceita()', () => {
    const profissional = criarProfissional();

    const consistente = profissional.aceita(new ValidadorConsistencia());
    const compatibilidade = profissional.aceita(new CalculadorCompatibilidade());
    const relatorio = profissional.aceita(new GeradorRelatorio());

    expect(consistente).toBe(true);
    expect(compatibilidade).toBe(7); // média de (8 + 6) / 2
    expect(typeof relatorio).toBe('string');
    expect(relatorio).toContain('Ana');
  });

  it('ValidadorConsistencia deve reprovar um projeto sem papéis obrigatórios', () => {
    // Não é possível construir um Projeto sem papéis (o construtor exigiria ao menos um
    // elemento no array, mas o array vazio é tecnicamente aceito pelo tipo). Testamos
    // diretamente o visitante para garantir a cobertura da branch negativa.
    const projetoSemPapeis = new Projeto('proj2', 'Documentário', 60, 5000, new Date('2026-06-01'), []);
    const resultado = new ValidadorConsistencia().visitarProjeto(projetoSemPapeis);

    expect(resultado).toBe(false);
  });

  it('ValidadorConsistencia deve reprovar um profissional com preço médio zero', () => {
    const profissionalGratuito = new Profissional('p2', 'Bruno', [], disponibilidade, 0);
    const resultado = new ValidadorConsistencia().visitarProfissional(profissionalGratuito);

    expect(resultado).toBe(false);
  });

  it('CalculadorCompatibilidade deve retornar 0 quando não há competências', () => {
    const profissionalSemCompetencia = new Profissional('p3', 'Carla', [], disponibilidade, 3000);
    const resultado = new CalculadorCompatibilidade().visitarProfissional(profissionalSemCompetencia);

    expect(resultado).toBe(0);
  });

  it('Projeto e Profissional não possuem lógica própria de validação, compatibilidade ou relatório', () => {
    // Este teste documenta a intenção do padrão: as classes de domínio só repassam a chamada
    // (aceita), sem conhecer o que cada visitante faz internamente.
    const projeto = criarProjeto();
    expect(typeof projeto.aceita).toBe('function');
    expect((projeto as any).validarConsistencia).toBeUndefined();
    expect((projeto as any).calcularCompatibilidade).toBeUndefined();
    expect((projeto as any).gerarRelatorio).toBeUndefined();
  });
});