import { VisitanteProjeto } from './VisitanteProjeto.js';
import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';

export class CalculadorCompatibilidade implements VisitanteProjeto {
  // INTERPRETAÇÃO: o enunciado descreve esta métrica como "compatibilidade geral da equipe",
  // que exigiria acesso à Equipe formada. Sem essa referência em Projeto, a métrica calculada
  // aqui é uma aproximação baseada na razão entre orçamento e número de papéis obrigatórios
  // (quanto maior o orçamento por papel, maior o "espaço" para compatibilidade).
  visitarProjeto(projeto: Projeto): number {
    if (projeto.papeisObrigatorios.length === 0) return 0;
    return projeto.orcamento / projeto.papeisObrigatorios.length;
  }

  // INTERPRETAÇÃO: sem uma equipe ou papel específico para comparar, a métrica de
  // compatibilidade do profissional isolado é a média de nível das suas próprias competências.
  visitarProfissional(profissional: Profissional): number {
    if (profissional.competencias.length === 0) return 0;
    const soma = profissional.competencias.reduce((acc, c) => acc + c.nivel, 0);
    return soma / profissional.competencias.length;
  }
}