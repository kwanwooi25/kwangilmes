export const exportCSV = (filename, headers, data) => {
  const keys = headers.map(({ key }) => key);
  const headerCSV = headers.map(({ name }) => name).join(',');

  // generate body csv from data
  const bodyCSV = data
    .map(account => {
      return keys
        .map(key => {
          if (
            account[key] === undefined ||
            account[key] === null ||
            account[key] === false
          ) {
            return '""';
          } else if (account[key] === true) {
            return '"Y"';
          } else if (isDate(account[key])) {
            const date = account[key].substring(0, 10);
            return '"t"'.replace('t', date);
          } else {
            return '"t"'.replace('t', account[key]);
          }
        })
        .join(',');
    })
    .join('\r\n');

  // ** must add '\ueff' to prevent broken korean font
  const blob = new Blob(['\ufeff' + headerCSV + '\r\n' + bodyCSV], {
    type: 'text/csv;charset=utf-8;'
  });

  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    downloadAnchor(URL.createObjectURL(blob), filename);
  }
};

// check if the value is date
const isDate = value => /^([0-9]{4})-([0-1][0-9])-([0-3][0-9])T/.test(value);

// function to generate download anchor
const downloadAnchor = (content, filename) => {
  const anchor = document.createElement('a');
  anchor.style = 'display:none !important';
  anchor.id = 'downloadanchor';
  document.body.appendChild(anchor);

  if ('download' in anchor) {
    anchor.download = filename;
  }
  anchor.href = content;
  anchor.click();
  anchor.remove();
};
