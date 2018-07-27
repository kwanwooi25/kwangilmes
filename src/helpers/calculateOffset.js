export const calculateOffset = (change, offset, limit, count) => {
  switch (change) {
    case 'prev':
      offset -= limit;
      break;
    case 'next':
      offset += limit;
      break;
    case 'first':
      offset = 0;
      break;
    case 'last':
      if (count % limit === 0) {
        offset =
          (parseInt(count / limit, 10) - 1) * limit;
      } else {
        offset = parseInt(count / limit, 10) * limit;
      }
      break;
    default:
      break;
  }

  return offset;
}
