export const formatDateTime = (value: number) => {
  const date = new Date(value * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatDateTimeFromString = (value: string) => {
  const timestamp = Date.parse(value) / 1000;
  return formatDateTime(timestamp);
};
