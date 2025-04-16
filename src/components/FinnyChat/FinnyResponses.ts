
interface FinnyResponseData {
  [key: string]: string;
}

export const FINNY_RESPONSES: FinnyResponseData = {
  "what's an emergency fund": "An emergency fund is money you set aside to cover unexpected expenses or financial emergencies. Think of it as a financial safety net! I recommend starting with a goal of $1,000, then building up to 3-6 months of essential expenses. Even saving just $10 per week is a great start!",
  
  "should i pay off debt or save first": "Great question! For most people, a balanced approach works best: First, build a small emergency fund ($1,000) for immediate emergencies. Then, focus on paying off high-interest debt (like credit cards) while making minimum payments on lower-interest debt. Once high-interest debt is gone, you can build up your full emergency fund while making minimum payments on remaining debts. Remember: everyone's situation is unique!",
  
  "how do i start budgeting": "Starting a budget is easier than you might think! Begin by tracking your income and spending for a month (apps can help with this). Then create categories for your expenses and set spending limits for each. The popular 50/30/20 rule suggests 50% for needs, 30% for wants, and 20% for savings/debt. The key is to find a system that works for you and stick with it. Would you like me to explain more about specific budgeting methods?",
  
  "what's a 401k": "A 401(k) is a retirement savings plan sponsored by employers. It lets you save and invest a portion of your paycheck before taxes are taken out. Many employers will match a percentage of what you contribute – that's basically free money! The money grows tax-deferred until you withdraw it in retirement. Starting early, even with small amounts, can make a huge difference thanks to compound interest.",
  
  "how much should i save": "A good rule of thumb is to save at least 20% of your income, but don't worry if that seems impossible right now! Start with whatever percentage you can manage consistently, even if it's just 1-2%. As your income grows or expenses decrease, try to gradually increase your savings rate. Remember that saving something is always better than saving nothing, and consistency matters more than the amount when you're just getting started.",
  
  "how do i improve my credit score": "To improve your credit score: 1) Pay all bills on time, every time - this is the biggest factor! 2) Keep your credit card balances low (aim for using less than 30% of your available credit). 3) Don't close old credit accounts, as length of credit history matters. 4) Limit applications for new credit. 5) Check your credit report annually for errors and dispute any you find. Improvement takes time, but these steps will help boost your score steadily!",
  
  "how much debt is too much": "A helpful guideline is the debt-to-income (DTI) ratio. Add up all monthly debt payments and divide by your gross monthly income. A DTI under 30% is considered healthy, 30-40% is manageable but concerning, and over 40% suggests you may be overextended. However, not all debt is equal - a mortgage might be acceptable at a higher percentage than credit card debt. The key question is: does your debt prevent you from saving for your goals or cause you stress? If yes, it might be too much for you personally.",
  
  "should i buy or rent": "This depends on your personal situation! Buying makes sense if you plan to stay in one place for at least 5-7 years, have stable income, can afford the full costs of homeownership (not just the mortgage), and have savings for a down payment and emergencies. Renting offers flexibility, fewer maintenance responsibilities, and can be financially smarter in expensive housing markets or during transitional life phases. There's no universal right answer - it's about what aligns with your financial situation and life goals right now.",
  
  "what's compound interest": "Compound interest is like magic for your money! It's when you earn interest not just on your initial investment, but also on the interest you've already earned. For example, if you invest $1,000 with 5% annual interest, you'll have $1,050 after year one. In year two, you earn interest on $1,050, not just the original $1,000. Over time, this creates a snowball effect where your money grows faster and faster. This is why starting to save early, even with small amounts, can lead to significant growth over time!",
  
  "how to save for a home": "To save for a home: 1) Set a specific target for your down payment (typically 3-20% of home price) plus closing costs (2-5%). 2) Create a dedicated savings account for your home fund. 3) Set up automatic transfers to make saving consistent. 4) Look into first-time homebuyer programs that may require smaller down payments. 5) Consider temporarily cutting expenses or adding income streams to boost savings. 6) Research tax-advantaged accounts like a Roth IRA, which allows first-time homebuyers to withdraw contributions and up to $10,000 in earnings penalty-free."
};

export const getFinnyResponse = (query: string): string => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for exact matches first
  if (FINNY_RESPONSES[normalizedQuery]) {
    return FINNY_RESPONSES[normalizedQuery];
  }
  
  // Check for partial matches
  for (const key in FINNY_RESPONSES) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
      return FINNY_RESPONSES[key];
    }
  }
  
  // Default response if no match found
  return "I'm not sure about that specific question, but I'm here to help with common financial questions about budgeting, saving, debt management, and more. Could you try rephrasing or asking about one of these topics?";
};
