const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatArs(value: number) {
  return arsFormatter.format(Math.round(value));
}

export function formatUsd(value: number) {
  return usdFormatter.format(value).replace("US$", "USD ");
}

/** Redondeo comercial: a los $100 más cercanos hacia arriba, terminando en 900 para precios altos. */
export function commercialRound(value: number) {
  if (value < 10000) return Math.ceil(value / 100) * 100;
  if (value < 100000) return Math.ceil(value / 500) * 500;
  return Math.ceil(value / 1000) * 1000;
}

export function usdToArs(priceUsd: number, rate: number) {
  return commercialRound(priceUsd * rate);
}

export function installmentAmount(totalArs: number, installments: number) {
  return Math.round(totalArs / installments);
}

export function formatInstallments(totalArs: number, installments: number) {
  return `${installments} cuotas sin interés de ${formatArs(installmentAmount(totalArs, installments))}`;
}

export function discountPercent(priceUsd: number, compareAtUsd: number) {
  if (!compareAtUsd || compareAtUsd <= priceUsd) return 0;
  return Math.round(((compareAtUsd - priceUsd) / compareAtUsd) * 100);
}
