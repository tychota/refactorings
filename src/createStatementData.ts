import { Data, EnrichedPerfomance } from "./types";

export function createStatementData(invoice: Invoice, plays: PlaysMap) {
  const statementData: Partial<Data> = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData as Data);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData as Data);
  return statementData as Data;

  function enrichPerformance(aPerformance: Perfomance): EnrichedPerfomance {
    const calculator = createPerfomanceCalculator(aPerformance, playFor(aPerformance as EnrichedPerfomance));
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

function createPerfomanceCalculator(aPerformance: Perfomance, aPlay: Play) {
  switch (aPlay.type) {
    case "comedy":
      return new ComedyCalculator(aPerformance, aPlay);
    case "tragedy":
      return new TragedyCalculator(aPerformance, aPlay);
  }
}
abstract class PerformanceCalculator {
  constructor(private _performance: Perfomance, private _play: Play) {}

  public get play() {
    return this._play;
  }

  public get performance() {
    return this._performance;
  }

  public abstract get amount(): number;

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  public get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator {
  public get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
  public get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}
