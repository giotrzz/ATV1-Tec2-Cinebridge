// INTERPRETAÇÃO: o diagrama não define os atributos de "Intervalo", apenas o usa como
// tipo do atributo "disponibilidade" em Profissional. Esta é a versão mínima possível.
export interface Intervalo {
  inicio: Date;
  fim: Date;
}