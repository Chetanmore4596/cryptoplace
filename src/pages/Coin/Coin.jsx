import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'CG-LNNV9Rs2xh4DMrw4BGBkjqVF',
        },
      });
      const data = await res.json();
      setCoinData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-LNNV9Rs2xh4DMrw4BGBkjqVF',
          },
        }
      );
      const data = await res.json();
      setHistoricalData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency, coinId]);

  if (coinData && historicalData) {
    return (
      <div className='coin'>
        <div className="coin-name">
          <img src={coinData.image?.large} alt={coinData.name} />
          <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
        </div>
        <div className="coin-chart">
          <LineChart historicalData={historicalData} />
        </div>

          <div className="coin-info">
            <ul>
              <li>Crypto market Rank</li>
              <li>{coinData.market_cap_rank}</li>
            </ul>
            <ul>
              <li>Crypto Price</li>
              <li>{currency.Symbol}{coinData.market_data.current_price[currency.name].toLocaleString()}</li>
            </ul>
            <ul>
              <li>market cap</li>
              <li>{currency.Symbol}{coinData.market_data.market_cap[currency.name].toLocaleString()}</li>
            </ul>
            <ul>
              <li>24 Hour high</li>
              <li>{currency.Symbol}{coinData.market_data.high_24h[currency.name].toLocaleString()}</li>
            </ul>
            <ul>
              <li>24 Hour low</li>
              <li>{currency.Symbol}{coinData.market_data.low_24h[currency.name].toLocaleString()}</li>
            </ul>
          </div>


      </div>
    );
  } else {
    return (
      <div className='spiner'>
        <div className="spin"></div>
      </div>
    );
  }
};

export default Coin;
