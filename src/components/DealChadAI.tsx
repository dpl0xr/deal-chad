import React, { useState, ChangeEvent } from 'react';

const expenseCategories = [
  'Taxes', 'Insurance', 'Trash', 'Gas/Electric', 'Internet', 'HOA',
  'Water/Sewer', 'Heat', 'Lawn/Snow', 'Phone Bill', 'Extra'
];

interface DealData {
  purchasePrice: number;
  downPaymentPercent: number;
  closingCostsPercent: number;
  estimateRepairs: number;
  afterRepairValue: number;
  monthsUntilFlip: number;
  interestRate: number;
  loanTerm: number;
  expenses: Record<string, number>;
  downPayment?: number;
  mortgage?: number;
  closingCosts?: number;
  totalCapitalNeeded?: number;
  monthlyMortgage?: number;
  expensesDuringHolding?: number;
  anticipatedProfit?: number;
  seventyPercentARV?: number;
  maxOffer?: number;
  returnOnInvestment?: number;
}

const DealChadAI: React.FC = () => {
  const [dealData, setDealData] = useState<DealData>({
    purchasePrice: 150000,
    downPaymentPercent: 20,
    closingCostsPercent: 2,
    estimateRepairs: 20000,
    afterRepairValue: 200000,
    monthsUntilFlip: 3,
    interestRate: 6,
    loanTerm: 30,
    expenses: {}
  });
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let numericValue: number;

    if (['monthsUntilFlip', 'loanTerm'].includes(name)) {
      numericValue = parseInt(value, 10);
    } else {
      numericValue = parseFloat(value.replace(/,/g, ''));
    }

    setDealData(prevData => ({
      ...prevData,
      [name]: isNaN(numericValue) ? 0 : numericValue
    }));
  };

  const handleExpenseSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const expense = e.target.value;
    if (!selectedExpenses.includes(expense)) {
      setSelectedExpenses(prev => [...prev, expense]);
      setDealData(prevData => ({
        ...prevData,
        expenses: {
          ...prevData.expenses,
          [expense]: 0
        }
      }));
    }
  };

  const handleExpenseChange = (expense: string, value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));
    setDealData(prevData => ({
      ...prevData,
      expenses: {
        ...prevData.expenses,
        [expense]: isNaN(numericValue) ? 0 : numericValue
      }
    }));
  };

  const calculateDeal = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const downPayment = dealData.purchasePrice * (dealData.downPaymentPercent / 100);
      const mortgage = dealData.purchasePrice - downPayment;
      const closingCosts = dealData.purchasePrice * (dealData.closingCostsPercent / 100);
      const totalCapitalNeeded = downPayment + closingCosts + dealData.estimateRepairs;

      const monthlyMortgage = calculateMortgage(mortgage, dealData.interestRate, dealData.loanTerm);
      const totalMonthlyExpenses = Object.values(dealData.expenses).reduce((sum, expense) => sum + expense, 0) + monthlyMortgage;

      const expensesDuringHolding = totalMonthlyExpenses * dealData.monthsUntilFlip;
      const anticipatedProfit = dealData.afterRepairValue - dealData.purchasePrice - dealData.estimateRepairs - closingCosts - expensesDuringHolding;
      const seventyPercentARV = dealData.afterRepairValue * 0.7;
      const maxOffer = seventyPercentARV - dealData.estimateRepairs - closingCosts;
      const returnOnInvestment = (anticipatedProfit / totalCapitalNeeded) * 100;

      setDealData(prevData => ({
        ...prevData,
        downPayment,
        mortgage,
        closingCosts,
        totalCapitalNeeded,
        monthlyMortgage,
        expensesDuringHolding,
        anticipatedProfit,
        seventyPercentARV,
        maxOffer,
        returnOnInvestment
      }));

      setShowResult(true);
      setIsAnalyzing(false);
    }, 1500);
  };

  const calculateMortgage = (principal: number, interestRate: number, years: number): number => {
    const r = interestRate / 100 / 12;
    const n = years * 12;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Deal Chad AI</h1>
      
      <div className="space-y-4 mb-6">
        {Object.entries(dealData).map(([key, value]) => {
          if (key !== 'expenses' && typeof value === 'number' && !['downPayment', 'mortgage', 'closingCosts', 'totalCapitalNeeded', 'monthlyMortgage', 'expensesDuringHolding', 'anticipatedProfit', 'seventyPercentARV', 'maxOffer', 'returnOnInvestment'].includes(key)) {
            return (
              <div key={key}>
                <label className="block mb-2 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                <input 
                  type="text"
                  name={key}
                  value={value.toString()}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {!['monthsUntilFlip', 'loanTerm', 'downPaymentPercent', 'closingCostsPercent', 'interestRate'].includes(key) && (
                  <div className="text-sm text-gray-500 mt-1">
                    Formatted: {formatCurrency(value)}
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Monthly Expenses</h2>
        <p className="mb-2 text-sm text-gray-600">Add your monthly expenses to analyze your deal.</p>
        <select 
          onChange={handleExpenseSelection} 
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select an expense</option>
          {expenseCategories.map(expense => (
            <option key={expense} value={expense}>{expense}</option>
          ))}
        </select>
      </div>

      {selectedExpenses.length > 0 && (
        <div className="space-y-4 mb-6">
          {selectedExpenses.map(expense => (
            <div key={expense}>
              <label className="block mb-1 font-semibold">{expense} ($)</label>
              <input 
                type="text" 
                value={dealData.expenses[expense]?.toString() || ''}
                onChange={(e) => handleExpenseChange(expense, e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-500 mt-1">
                Formatted: {formatCurrency(dealData.expenses[expense] || 0)}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={calculateDeal} 
        className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 mb-6"
        disabled={isAnalyzing}
      >
        {isAnalyzing ? '🧠 Analyzing...' : 'Analyze Deal'}
      </button>
      
      {showResult && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Deal Summary</h2>
          <p className="mb-2"><strong>Downpayment:</strong> {formatCurrency(dealData.downPayment || 0)}</p>
          <p className="mb-2"><strong>Mortgage:</strong> {formatCurrency(dealData.mortgage || 0)}</p>
          <p className="mb-2"><strong>Closing Costs:</strong> {formatCurrency(dealData.closingCosts || 0)}</p>
          <p className="mb-2"><strong>Total Capital Needed:</strong> {formatCurrency(dealData.totalCapitalNeeded || 0)}</p>
          <p className="mb-2"><strong>Monthly Mortgage Payment:</strong> {formatCurrency(dealData.monthlyMortgage || 0)}</p>
          <p className="mb-2"><strong>Expenses during holding:</strong> {formatCurrency(dealData.expensesDuringHolding || 0)}</p>
          <p className="mb-2"><strong>Anticipated Profit:</strong> {formatCurrency(dealData.anticipatedProfit || 0)}</p>
          <p className="mb-2"><strong>70% of ARV:</strong> {formatCurrency(dealData.seventyPercentARV || 0)}</p>
          <p className="mb-2"><strong>Max Offer for Home:</strong> {formatCurrency(dealData.maxOffer || 0)}</p>
          <p className="mb-4"><strong>Return on Investment:</strong> {dealData.returnOnInvestment?.toFixed(2)}%</p>
          
          <div className="mt-6 text-center">
            {dealData.returnOnInvestment && dealData.returnOnInvestment > 20 ? (
              <div>
                <img src="/api/placeholder/300/300" alt="Chad Meme" className="mx-auto mb-4 rounded-lg shadow-md" />
                <p className="text-lg font-semibold text-green-600">Great deal! 👍 The ROI is above 20%, which is considered excellent for a fix and flip.</p>
              </div>
            ) : (
              <div>
                <img src="/api/placeholder/300/300" alt="Crying Wojak Meme" className="mx-auto mb-4 rounded-lg shadow-md" />
                <p className="text-lg font-semibold text-red-600">Not a great deal. 👎 The ROI is below 20%, which is considered risky for a fix and flip.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealChadAI;
