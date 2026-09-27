import { VisitanteProjeto } from './VisitanteProjeto.js';
import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';

export class ValidadorConsistencia implements VisitanteProjeto {
  // INTERPRETAÇÃO: o enunciado descreve esta validação como "verificar se todos os papéis
  // obrigatórios estão preenchidos e se o orçamento é suficiente" — o que exigiria acesso à
  // Equipe formada. Como Projeto não referencia Equipe (decisão de manter fiel ao diagrama),
  // esta validação fica restrita aos próprios atributos do Projeto: orçamento positivo e
  // existência de ao menos um papel obrigatório definido.
  visitarProjeto(projeto: Projeto): boolean {
    return projeto.orcamento > 0 && projeto.papeisObrigatorios.length > 0;
  }

  // INTERPRETAÇÃO: sem acesso a avaliações mínimas exigidas ou regras de negócio adicionais,
  // a validação fica restrita a um preço médio positivo, o único atributo com sentido de
  // "consistência" disponível diretamente em Profissional.
  visitarProfissional(profissional: Profissional): boolean {
    return profissional.precoMedio > 0;
  }
}