export const exportCSV = (filename, headers, target, search, userToken) => {
  fetch(`http://localhost:3000/${target}-for-xls`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'post',
    body: JSON.stringify(search)
  })
    .then(response => response.json())
    .then(({ success, data }) => {
      const keys = headers.map(({ key }) => key);
      const headerCSV = headers.map(({ name }) => name).join(',');

      // generate body csv from data
      const bodyCSV = data[target]
        .map(item => {
          return keys
            .map(key => {
              if (
                item[key] === undefined ||
                item[key] === null ||
                item[key] === false
              ) {
                return '""';
              } else if (item[key] === true) {
                return '"Y"';
              } else if (isDate(item[key])) {
                const date = item[key].substring(0, 10);
                return '"t"'.replace('t', date);
              } else {
                return '"t"'.replace('t', item[key]);
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
    });
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
