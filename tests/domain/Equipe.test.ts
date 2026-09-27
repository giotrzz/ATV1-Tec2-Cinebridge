import { describe, it, expect } from 'vitest';
import { Equipe } from '../../src/domain/entities/Equipe.js';
import { MembroEquipe } from '../../src/domain/entities/MembroEquipe.js';
import { Profissional } from '../../src/domain/entities/Profissional.js';
import { Intervalo } from '../../src/domain/entities/Intervalo.js';
import { Papel } from '../../src/domain/enums/Papel.js';

describe('Equipe', () => {
  const disponibilidade: Intervalo = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

  it('deve armazenar os atributos corretamente', () => {
    const dataFormacao = new Date();
    const equipe = new Equipe('e1', dataFormacao, 'EM_FORMACAO');

    expect(equipe.id).toBe('e1');
    expect(equipe.dataFormacao).toBe(dataFormacao);
    expect(equipe.status).toBe('EM_FORMACAO');
    expect(equipe.membros).toEqual([]);
  });

  it('deve permitir adicionar membros diretamente na lista', () => {
    const equipe = new Equipe('e1', new Date(), 'EM_FORMACAO');
    const profissional = new Profissional('p1', 'Ana', [], disponibilidade, 5000);
    const membro = new MembroEquipe(Papel.DIRETOR, profissional);

    equipe.membros.push(membro);

    expect(equipe.membros).toHaveLength(1);
    expect(equipe.membros[0]?.papel).toBe(Papel.DIRETOR);
  });
});