import { statement } from "../src/statement";

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

test("statement should output", () => {
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
