import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { useState } from 'react';
import mypic from '../public/dollar.jpg'

export default function Home() {
  const [currentSalary, setCurrentSalary] = useState('');
  const [newExchangeRate, setNewExchangeRate] = useState('');
  const [initialSalaryResult, setInitialSalaryResult] = useState('');
  const [adjustedSalaryResult, setAdjustedSalaryResult] = useState('');
  const [increaseInValueResult, setIncreaseInValueResult] = useState('');

  const calculateSalary = () => {
    try {
      const initialSalaryInPKR = parseFloat(currentSalary);
      const exchangeRate = parseFloat(newExchangeRate);

      const salaryInUSD = initialSalaryInPKR / 275;
      let remainingSalaryInUSD = salaryInUSD;

      const fixedRate = new Map();
      fixedRate.set(100000, 1.0);
      fixedRate.set(200000, 0.9);
      fixedRate.set(300000, 0.8);
      fixedRate.set(400000, 0.7);
      fixedRate.set(500000, 0.65);
      fixedRate.set(750000, 0.55);
      fixedRate.set(1000000, 0.5);

      let adjustedSalaryInPKR = 0;

      for (const [bracket, rate] of fixedRate) {
        if (remainingSalaryInUSD > 0) {
          const amountInBracket = Math.min(remainingSalaryInUSD, bracket);
          adjustedSalaryInPKR += amountInBracket * rate * exchangeRate;
          remainingSalaryInUSD -= amountInBracket;
        }
      }

      const increaseInValue = adjustedSalaryInPKR - initialSalaryInPKR;

      setInitialSalaryResult(initialSalaryInPKR.toFixed(2));
      setAdjustedSalaryResult(adjustedSalaryInPKR.toFixed(2));
      setIncreaseInValueResult(increaseInValue.toFixed(2));
    } catch (ex) {
      setInitialSalaryResult('Please enter valid numeric values.');
      setAdjustedSalaryResult('');
      setIncreaseInValueResult('');
    }
  };

  return (
    <div className="container-fluid mt-5" style={{ backgroundImage: `url("/dollar.jpg")`, backgroundSize: 'cover' }}>
    <Head>
      <title>Salary Calculator</title>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <link rel="stylesheet" href="styles.css" />
    </Head>

    <h1 className="text-center text-white mb-4">Salary Calculator</h1>
    <div className="row justify-content-center">
      <div className="col-md-6">
        <form>
          <div className="form-group">
            <label htmlFor="currentSalary" className="text-white font-weight-bold">Current Salary (PKR):</label>
            <input
              type="number"
              className="form-control"
              id="currentSalary"
              placeholder="Enter current salary"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newExchangeRate" className="text-white font-weight-bold">New Exchange Rate (1 USD to PKR):</label>
            <input
              type="number"
              className="form-control"
              id="newExchangeRate"
              placeholder="Enter new exchange rate"
              value={newExchangeRate}
              onChange={(e) => setNewExchangeRate(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={calculateSalary}
          >
            Calculate
          </button>
        </form>
        <div className="result mt-4 p-3 rounded bg-light">
          <p className="font-weight-bold">Results:</p>
          <p>
            Initial Salary in PKR: <span id="initialSalaryResult">{initialSalaryResult}</span>
          </p>
          <p>
            Adjusted Salary in PKR: <span id="adjustedSalaryResult">{adjustedSalaryResult}</span>
          </p>
          <p>
            Increase in Value in PKR: <span id="increaseInValueResult">{increaseInValueResult}</span>
          </p>
        </div>
        <div className="signatures mt-4 text-right">
          <p>Powered by Ammar and Awais</p>
        </div>
      </div>
    </div>
  </div>
  );
}
