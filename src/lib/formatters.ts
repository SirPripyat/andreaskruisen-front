const numberFormatter = new Intl.NumberFormat('pt-BR');
const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });
const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
});
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const formatNumber = (value: number) => numberFormatter.format(value);

export const formatDecimal = (value: number) => decimalFormatter.format(value);

export const formatDate = (value: string | number | Date) =>
  dateFormatter.format(new Date(value));

export const formatShortDate = (value: string | number | Date) =>
  shortDateFormatter.format(new Date(value));

export const formatDateTime = (value: string | number | Date) =>
  dateTimeFormatter.format(new Date(value));
