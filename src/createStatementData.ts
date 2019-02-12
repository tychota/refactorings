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
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
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

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5);
    return result;
  }
}
