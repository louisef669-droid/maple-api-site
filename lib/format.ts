export function formatNumber(value: unknown) {
  const num = Number(String(value).replace(/,/g, ""));

  if (isNaN(num)) {
    return String(value);
  }

  return num.toLocaleString();
}
