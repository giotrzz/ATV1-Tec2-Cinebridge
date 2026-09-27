import { VetorCompetencia } from './VetorCompetencia.js';
import { Intervalo } from './Intervalo.js';
import { Avaliacao } from './Avaliacao.js';
import { VisitanteProjeto } from '../../visitors/VisitanteProjeto.js';

export class Profissional {
  // INTERPRETAÇÃO: o diagrama não lista este atributo na caixa de Profissional, mas existe
  // a relação "recebe" (0..*) ligando Profissional a Avaliacao. Sem esta lista, a classe
  // Avaliacao fica sem uso e a estratégia FiltragemColaborativa não pode funcionar.
  public readonly avaliacoes: Avaliacao[] = [];

  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly competencias: VetorCompetencia,
    public readonly disponibilidade: Intervalo,
    public readonly precoMedio: number,
  ) {}

  aceita(visitante: VisitanteProjeto): unknown {
    return visitante.visitarProfissional(this);
  }
}