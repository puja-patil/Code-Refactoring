const invoice = require('./invoices.json');
const plays = require('./plays.json');

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", minimumFractionDigits: 2
    }).format;
    for (let perf of invoice.performances) {
        //const play = playFor(perf);
        let thisAmount = amountFor(perf);

        //add volume crredits
        volumeCredits += Math.max(perf.audience - 30, 0);
        //add extra credit for every 10 comedy attendees
        if ("comedy" === playFor(perf).type)
            volumeCredits += Math.floor(perf.audience / 5);

        //print line for this order
        result += `${playFor(perf).name}: ${format(thisAmount / 100)} ${perf.audience} seats\n`;
        totalAmount += thisAmount;

    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned Volume Credits : ${volumeCredits} volume Credits\n`;
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
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
            throw new Error(`Unknown play type : ${playFor(aPerformance).type}`)
    }
    return result;
}
console.log(statement(invoice, plays));