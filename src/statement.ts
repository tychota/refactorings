import { Data } from "./types";
import { createStatementData } from "./createStatementData";

export function statement(invoice: Invoice, plays: PlaysMap) {
  return renderPlainText(createStatementData(invoice, plays));
}
function renderPlainText(data: Data) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits \n`;
  return result;
}
export function htmlStatement(invoice: Invoice, plays: PlaysMap) {
  return renderHtml(createStatementData(invoice, plays));
}
function renderHtml(data: Data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += `<table>`;
  result += `<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td><td>${usd(perf.audience)}</td><td>${perf.amount}<td>\n`;
  }
  result += `</table>\n`;
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}
function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber / 100);
}
