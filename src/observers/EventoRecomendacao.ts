export class EventoRecomendacao {
  constructor(
    public readonly tipo: string,
    public readonly dados: Map<string, unknown>,
    public readonly origem: string,
  ) {}
}