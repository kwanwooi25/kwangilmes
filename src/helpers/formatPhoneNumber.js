export const formatPhoneNumber = number => {
  return number.replace(
    /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,
    '$1-$2-$3'
  );
};

export const informatPhoneNumber = number => {
  return number.replace(/-/g, '');
};
