export const formatDateTime = (value: number, format = 'DD/MM/YY HH:mm'): any => {
  const tempDate = new Date(value * 1000);
  const tzOffsetHour = tempDate.getTimezoneOffset() / 60;
  const tzOffsetMin = tempDate.getTimezoneOffset() % 60;
  const strTzOffsetHour = `0${Math.abs(tzOffsetHour)}`.slice(-2);
  const strTzOffsetMin = `0${Math.abs(tzOffsetMin)}`.slice(-2);

  const strTzOffset =
    tzOffsetHour > 0 ? `-${strTzOffsetHour}:${strTzOffsetMin}` : tzOffsetHour < 0 ? `+${strTzOffsetHour}:${strTzOffsetMin}` : '';

  const date = new Date(tempDate.getTime());
  const year = date.getFullYear();
  const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const monthShort = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  if (format === 'DD MM') {
    return `${day} ${month}`;
  }

  if (format === 'HH:mm') {
    return `${hours}:${minutes}`;
  }
  if (format === 'DD/MM HH:mm') {
    return `${day}/${month} ${hours}:${minutes}`;
  }
  if (format === 'YYYY. DD. MMM HH:mm UTCZ') {
    return `${year}. ${day}. ${monthShort}. ${hours}:${minutes} UTC${strTzOffset}`;
  }

  if (format === 'MM/YYYY') {
    return `${month}/${year}`;
  }

  if (format === 'L HH:mm') {
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  if (format === 'MM/DD/YYYY HH:mm') {
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatDateTimeFromString = (value: string) => {
  const timestamp = Date.parse(value) / 1000;
  return formatDateTime(timestamp);
};

export const timeToLocal = (originalTime: number) => {
  const d = new Date(originalTime * 1000);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
};
