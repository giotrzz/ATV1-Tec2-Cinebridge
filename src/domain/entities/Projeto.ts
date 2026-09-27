import { Papel } from '../enums/Papel.js';
import { Profissional } from './Profissional.js';
import { VisitanteProjeto } from '../../visitors/VisitanteProjeto.js';

export class Projeto {
  constructor(
    public readonly id: string,
    public readonly genero: string,
    public readonly duracao: number,
    public readonly orcamento: number,
    public readonly prazo: Date,
    // INTERPRETAÇÃO: o diagrama não lista este atributo na caixa de Projeto, mas o texto do
    // enunciado exige "uma lista de papéis técnicos obrigatórios" e o método recomendar()
    // das estratégias (Strategy) não tem como saber quais papéis processar sem esta informação.
    public readonly papeisObrigatorios: Papel[],
  ) {}

  aceitarRecomendacao(papel: Papel, profissional: Profissional): void {
    throw new Error('Não implementado — depende do Orquestrador (Passo 3).');
  }

  substituirMembro(papel: Papel, profissional: Profissional): void {
    throw new Error('Não implementado — depende da Strategy (Passo 2/3).');
  }

  solicitarReavaliacao(): void {
    throw new Error('Não implementado — depende do Template Method (Passo 3).');
  }

  aceita(visitante: VisitanteProjeto): unknown {
    return visitante.visitarProjeto(this);
  }
}