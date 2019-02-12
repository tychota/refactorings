export interface EnrichedPerfomance extends Perfomance {
  play: Play;
  amount: number;
  volumeCredits: number;
}
export type Data = {
  customer: Invoice["customer"];
  performances: EnrichedPerfomance[];
  totalAmount: number;
  totalVolumeCredits: number;
};
