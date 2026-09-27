import { MembroEquipe } from './MembroEquipe.js';

export class Equipe {
  public readonly membros: MembroEquipe[] = [];

  constructor(
    public readonly id: string,
    public readonly dataFormacao: Date,
    public status: string,
  ) {}
}
