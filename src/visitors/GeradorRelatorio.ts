import { VisitanteProjeto } from './VisitanteProjeto.js';
import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';

export class GeradorRelatorio implements VisitanteProjeto {
  visitarProjeto(projeto: Projeto): string {
    return `Projeto ${projeto.id} (${projeto.genero}): orçamento R$${projeto.orcamento}, prazo ${projeto.prazo.toISOString()}, ${projeto.papeisObrigatorios.length} papel(éis) obrigatório(s).`;
  }

  visitarProfissional(profissional: Profissional): string {
    return `Profissional ${profissional.nome} (${profissional.id}): preço médio R$${profissional.precoMedio}, ${profissional.competencias.length} competência(s), ${profissional.avaliacoes.length} avaliação(ões).`;
  }
}