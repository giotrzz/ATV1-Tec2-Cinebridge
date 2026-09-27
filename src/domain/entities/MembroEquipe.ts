import { Papel } from '../enums/Papel.js';
import { Profissional } from './Profissional.js';

export class MembroEquipe {
  constructor(
    public readonly papel: Papel,
    public readonly profissional: Profissional,
    public confirmado: boolean = false,
  ) {}
}