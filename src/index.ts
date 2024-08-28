import ccxt, { int } from "ccxt";
import { RSI, SMA } from "trading-signals";

const exchange = new ccxt.mexc({
    'apiKey': process.env.MEXC_API,
    'secret': process.env.MEXC_SECRET,
    'options': {
        'defaultType': 'swap'
    }
});

const rsi = new RSI(14, SMA);

console.log(`Exchange: ${exchange.name}`);

async function getBidAsk(ticker: string) {
    let orderbook = await exchange.fetchOrderBook(ticker);
    let ask = orderbook.asks[0][0];
    let bid = orderbook.bids[0][0];
    
    if (ask && bid)
        console.log(`Ask: ${ask} Bid: ${bid} ${(ask - bid)}`);
}

async function ohlcv(ticker: string, length: int) {
    let ohlcv = await exchange.fetchOHLCV(ticker);
    return ohlcv.slice(ohlcv.length - 1 - length, ohlcv.length - 1);
}

async function addRSI(ticker: string)
{
    let data = await ohlcv(ticker, 100);
    
    for (let entry in data) {
        rsi.update(Number.parseFloat(entry[1]))
    }

    rsi.getResult()
}

getBidAsk('BTCUSDT');
addRSI('BTCUSDT');