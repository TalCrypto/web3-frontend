export const formatDateTime = (value: number, format = 'DD/MM/YY HH:mm'): any => {
  const date = new Date(value * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  if (format === 'HH:mm') {
    return `${hours}:${minutes}`;
  }
  if (format === 'DD/MM HH:mm') {
    return `${day}/${month} ${hours}:${minutes}`;
  }
  if (format === 'YYYY. DD. MMM HH:mm UTCZ') {
    return `${year}. ${day}. ${month}. ${hours}:${minutes} UTCZ`;
  }

  if (format === 'MM/YYYY') {
    return `${month}/${year}`;
  }

  if (format === 'L HH:mm') {
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatDateTimeFromString = (value: string) => {
  const timestamp = Date.parse(value) / 1000;
  return formatDateTime(timestamp);
};
