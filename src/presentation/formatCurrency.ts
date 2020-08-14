const formatCurrency = (value: number | undefined) =>
  value != null
    ? `${Math.sign(value) < 0 ? '- ' : ''}¥${Math.abs(value).toLocaleString()}`
    : '-';
export default formatCurrency;
