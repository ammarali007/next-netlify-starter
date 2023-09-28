import Head from 'next/head';

import { useState, useEffect } from 'react';


export default function Home() {
  const [currentSalary, setCurrentSalary] = useState('');
  const [newExchangeRate, setNewExchangeRate] = useState('');
  const [initialSalaryResult, setInitialSalaryResult] = useState('');
  const [adjustedSalaryResult, setAdjustedSalaryResult] = useState('');
  const [increaseInValueResult, setIncreaseInValueResult] = useState('');
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const currentMonth = new Date().getMonth() + 1;
  const [useLastMonthRate, setUseLastMonthRate] = useState(false);

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await fetch('api/exchangeRate');
        if (response.ok) {
          const data = await response.json();
          setExchangeRates(data);
          setLoading(false); // Set loading to false once data is fetched
        } else {
          setError('Failed to fetch exchange rates: ' + response.statusText);
        }
      } catch (error) {
        setError('An error occurred while fetching exchange rates: ' + error.message);
      }
    }

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    // Your custom logic here to set the newExchangeRate based on the current month
    // Example:
    if (currentMonth === 10) {
      // October, set the value for September
      setNewExchangeRate('1.25'); // Replace with your value for September
    } else if (currentMonth === 9) {
      // September, set the value for August
      setNewExchangeRate('294'); // Replace with your value for August
    } else {
      // For other months, you can set a default value or ask the user for a custom value
      // setNewExchangeRate(''); // You can set a default value here
    }
  }, [currentMonth]);

  useEffect(() => {
    if (useLastMonthRate) {
      // If the checkbox is checked, use the exchange rate of the previous month
      const previousMonthRate = getPreviousMonthRate();
      setNewExchangeRate(previousMonthRate);
    } else {
      // If the checkbox is not checked, use the value derived from exchangeRates.map
      // This will keep the custom value entered by the user when the checkbox is unchecked
      // For example, if the checkbox is unchecked, and the user enters a custom value of 1.30
      // It will use 1.30 as the exchange rate even if the checkbox is later checked
      // Because it will use the value from the state (newExchangeRate)
    }
  }, [useLastMonthRate]);

  // Function to get the exchange rate of the previous month
  const getPreviousMonthRate = () => {
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1; // Handle January
    const previousMonthRate = exchangeRates.find(rate => {
      const rateMonth = new Date(rate.date).getMonth() + 1;
      return rateMonth === previousMonth;
    });

    return previousMonthRate ? previousMonthRate.rate : '';
  };

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
    <div className="container-fluid mt-5" style={{ backgroundImage: `url("/dollar3.jpg")`, backgroundSize: '100% 100%' }}>
    <Head>
      <title>Salary Calculator</title>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <link rel="stylesheet" href="/styles/global.css" />
    </Head>

    <div className="row justify-content-center align-items-center min-vh-100">
      <div className="col-md-6">
        <h1 className="text-center text-white mb-4">Salary Calculator</h1>
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
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="useLastMonthRate"
              checked={useLastMonthRate}
              onChange={() => setUseLastMonthRate(!useLastMonthRate)}
            />
            <label className="form-check-label text-white" htmlFor="useLastMonthRate">
              Use Exchange Rate of Last Month
            </label>
          </div>
          {!useLastMonthRate && (
            <div className="form-group">
              <label htmlFor="newExchangeRate" className="text-white font-weight-bold">Custom Exchange Rate (1 USD to PKR):</label>
              <input
                type="number"
                className="form-control"
                id="newExchangeRate"
                placeholder="Enter custom exchange rate"
                value={newExchangeRate}
                onChange={(e) => setNewExchangeRate(e.target.value)}
              />
            </div>
          )}
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={calculateSalary}
          >
            Calculate
          </button>
        </form>
        <div className="result mt-4 rounded bg-light p-3">
          <p className="font-weight-bold text-primary">Results:</p>
          <p className="mb-1">
            Initial Salary in PKR: <span id="initialSalaryResult" className="font-weight-bold">{initialSalaryResult}</span>
          </p>
          <p className="mb-1">
            Adjusted Salary in PKR: <span id="adjustedSalaryResult" className="font-weight-bold">{adjustedSalaryResult}</span>
          </p>
          <p className="mb-1">
            Increase in Value in PKR: <span id="increaseInValueResult" className="font-weight-bold">{increaseInValueResult}</span>
          </p>
        </div>
        <div className="result mt-4 rounded">
          <p className="font-weight-bold text-primary">Average Exchange Rates:</p>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th className="bg-primary text-white">Months</th>
                <th className="bg-primary text-white">1 USD =</th>
              </tr>
            </thead>
            <tbody>
              {exchangeRates.map((rate, index) => (
                <tr
                  key={index}
                  className="table-hover"
                >
                  <td>{rate.date}</td>
                  <td>{rate.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="signatures mt-4 text-center text-white font-weight-bold">
          <p>Powered by Ammar and Awais </p>
        </div>
      </div>
    </div>
  </div>
);
}
