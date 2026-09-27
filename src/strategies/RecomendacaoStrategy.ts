import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';
import { Papel } from '../domain/enums/Papel.js';

export interface RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]>;
}