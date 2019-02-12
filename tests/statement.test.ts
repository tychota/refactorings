import { statement, htmlStatement } from "../src/statement";

const plays: PlaysMap = {
  hamlet: {
    name: "Hamlet",
    type: "tragedy"
  },
  "as-like": {
    name: "As You Like It",
    type: "comedy"
  },
  othello: {
    name: "Othello",
    type: "tragedy"
  }
};

const invoices: Invoice[] = [
  {
    customer: "BigCo",
    performances: [
      { playID: "hamlet", audience: 55 },
      { playID: "as-like", audience: 35 },
      { playID: "othello", audience: 40 }
    ]
  }
];

test("statement should output text", () => {
  // given
  const invoice = invoices[0];

  // when
  const text = statement(invoice, plays);

  // then
  const expectedTest = `Statement for BigCo
  Hamlet: $650.00 (55 seats)
  As You Like It: $580.00 (35 seats)
  Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits 
`;
  expect(text).toBe(expectedTest);
});

test("htmlStatement should output html", () => {
  // given
  const invoice = invoices[0];

  // when
  const text = htmlStatement(invoice, plays);

  // then
  const expectedTest = `<h1>Statement for BigCo</h1>
<table><tr><th>play</th><th>seats</th><th>cost</th></tr><tr><td>Hamlet</td><td>$0.55</td><td>65000<td>
<tr><td>As You Like It</td><td>$0.35</td><td>58000<td>
<tr><td>Othello</td><td>$0.40</td><td>50000<td>
</table>
<p>Amount owed is <em>$1,730.00</em></p>
<p>You earned <em>47</em> credits</p>
`;
  expect(text).toBe(expectedTest);
});
