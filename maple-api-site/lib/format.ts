export function formatNumber(value: any) {
  const num = Number(String(value).replace(/,/g, ""));

  if (isNaN(num)) {
    return value;
  }

  return num.toLocaleString();
}