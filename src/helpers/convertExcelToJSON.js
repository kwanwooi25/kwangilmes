export const convertExcelToJSON = (rows, CSV_HEADERS) => {
  // header row
  const header = rows[0].map(
    column => CSV_HEADERS.find(({ name }) => name === column).key
  );

  // body rows
  rows.shift();

  return rows.map(row => {
    const json = JSON.parse(
      `{ ${row
        .map((column, index) => {
          const value = column !== null ? column : '';
          return `"${header[index]}": "${value}"`;
        })
        .join(',')} }`
    );

    Object.keys(json).forEach(key => {
      // modify values to match type
      const type = CSV_HEADERS.find(entry => entry.key === key).type;
      switch (type) {
        case 'integer':
        case 'float':
          json[key] = Number(json[key]);
          break;

        case 'boolean':
          json[key] = json[key] === 'Y';
          break;

        default:
          break;
      }
    });

    return json;
  });
};
