import { Data, EnrichedPerfomance } from "./types";

export function createStatementData(invoice: Invoice, plays: PlaysMap) {
  const statementData: Partial<Data> = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData as Data);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData as Data);
  return statementData as Data;

  function enrichPerformance(aPerformance: Perfomance): EnrichedPerfomance {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance as EnrichedPerfomance));
    const result: Partial<EnrichedPerfomance> = { ...aPerformance };
    result.play = calculator.play;
    result.amount = amountFor(result as EnrichedPerfomance);
    result.volumeCredits = volumeCreditsFor(result as EnrichedPerfomance);
    return result as EnrichedPerfomance;
  }
  function totalAmount(data: Data) {
    return data.performances.reduce((total, perf) => total + perf.amount, 0);
  }
  function totalVolumeCredits(data: Data) {
    return data.performances.reduce((total, perf) => total + perf.volumeCredits, 0);
  }
  function playFor(aPerformance: EnrichedPerfomance) {
    return plays[aPerformance.playID];
  }
  function amountFor(aPerformance: EnrichedPerfomance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
  }
  function volumeCreditsFor(aPerformance: EnrichedPerfomance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
    return result;
  }
}
class PerformanceCalculator {
  constructor(private _performance: Perfomance, private _play: Play) {}

  public get play() {
    return this._play;
  }

  public get performance() {
    return this._performance;
  }

  public get amount() {
    let result = 0;

    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return result;
  }
}
