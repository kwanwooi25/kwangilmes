import React from 'react';
import './ListBody.css';

const ListBody = ({ children }) => {
  return (
    <ul className="list-body">
      {children}
    </ul>
  );
};

export default ListBody;
