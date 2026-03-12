export type DateInput = string | number | Date | null | undefined;

export const formatThaiDate = (
  isoString: DateInput,
  includeTime: boolean = true
): string => {
  if (!isoString) return '-';

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return 'Invalid Date';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = false;
  }

  return new Intl.DateTimeFormat('th-TH', options).format(date);
};