export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateRange(departure: string, returnDate?: string): string {
  if (!departure) return '';
  const dep = new Date(departure);
  const depStr = dep.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  
  if (!returnDate) return depStr;
  const ret = new Date(returnDate);
  const retStr = ret.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  
  return `${depStr} – ${retStr}`;
}
