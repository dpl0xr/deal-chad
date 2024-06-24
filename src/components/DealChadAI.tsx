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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDealData(prevData => ({
      ...prevData,
      [name]: parseFloat(value) || 0
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
    setDealData(prevData => ({
      ...prevData,
      expenses: {
        ...prevData.expenses,
        [expense]: parseFloat(value) || 0
      }
    }));
  };

  const calculateDeal = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // ... (calculation logic remains the same)
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
          if (key !== 'expenses' && typeof value === 'number') {
            return (
              <div key={key}>
                <label className="block mb-2 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input 
                  type="number" 
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                type="number" 
                value={dealData.expenses[expense] || ''}
                onChange={(e) => handleExpenseChange(expense, e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
          {/* ... (result display logic remains the same) ... */}
        </div>
      )}
    </div>
  );
};

export default DealChadAI;
