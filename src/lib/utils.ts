/**
 * Format a number as currency with commas and 2 decimal places
 */
export const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return '0.00';
  
  try {
    // Format with commas and 2 decimal places
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch (e) {
    return amount.toFixed(2);
  }
}; 