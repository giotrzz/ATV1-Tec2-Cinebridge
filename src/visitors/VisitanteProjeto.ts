import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';

export interface VisitanteProjeto {
  visitarProjeto(projeto: Projeto): unknown;
  visitarProfissional(profissional: Profissional): unknown;
}