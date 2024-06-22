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
      {/* ... (rest of the JSX remains the same) ... */}
      
      {showResult && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Deal Summary</h2>
          <p className="mb-2"><strong>Downpayment:</strong> ${dealData.downPayment?.toFixed(2) || 'N/A'}</p>
          <p className="mb-2"><strong>Mortgage:</strong> ${dealData.mortgage?.toFixed(2) || 'N/A'}</p>
          <p className="mb-2"><strong>Closing Costs:</strong> ${dealData.closingCosts?.toFixed(2) || 'N/A'}</p>
          <p className="mb-2"><strong>Total Capital Needed:</strong> ${dealData.totalCapitalNeeded?.toFixed(2) || 'N/A'}</p>
          <p className="mb-2"><strong>Monthly Mortgage Payment:</strong> ${dealData.monthlyMortgage?.toFixed(2) || 'N/A'}</p>
          <p className="mb-2"><strong>Expenses during holding:</strong> ${dealData.expensesDuringHolding?.toFixed(2) || 'N/A'}</p>
          <p className="mb-2"><strong>Anticipated Profit:</strong> ${dealData.anticipatedProfit?.toFixed(2) || 'N/A'}</p>
          <p className="mb-2"><strong>70% of ARV:</strong> ${dealData.seventyPercentARV?.toFixed(2) || 'N/A'}</p>
          <p className="mb-2"><strong>Max Offer for Home:</strong> ${dealData.maxOffer?.toFixed(2) || 'N/A'}</p>
          <p className="mb-4"><strong>Return on Investment:</strong> {dealData.returnOnInvestment?.toFixed(2) || 'N/A'}%</p>
          
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
