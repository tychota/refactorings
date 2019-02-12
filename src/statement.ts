interface EnrichedPerfomance extends Perfomance {
  play: Play;
  amount: number;
  volumeCredits: number;
}
type Data = {
  customer: Invoice["customer"];
  performances: EnrichedPerfomance[];
  totalAmount: number;
  totalVolumeCredits: number;
};
export function statement(invoice: Invoice, plays: PlaysMap) {
  const statementData: Partial<Data> = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData as Data);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData as Data);
  return renderPlainText(statementData as Data, plays);

  function enrichPerformance(aPerformance: Perfomance): EnrichedPerfomance {
    const result: Partial<EnrichedPerfomance> = { ...aPerformance };
    result.play = playFor(result as EnrichedPerfomance);
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
    let result = 0;

    switch (aPerformance.play.type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${aPerformance.play.type}`);
    }
    return result;
  }
  function volumeCreditsFor(aPerformance: EnrichedPerfomance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
    return result;
  }
}

function renderPlainText(data: Data, plays: PlaysMap) {
  let result = `Statement for ${data.customer} \n`;
  for (let perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits \n`;
  return result;

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber / 100);
  }
}
