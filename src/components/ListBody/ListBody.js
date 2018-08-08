import React from 'react';
import Spinner from '../../components/Spinner/Spinner';
import NoData from '../../components/NoData/NoData';
import './ListBody.css';

const ListBody = ({ className, isPending, hasData, children }) => {
	if (isPending) return <Spinner />;
	if (hasData === false) return <NoData />;
	else return <ul className={`list-body ${className}`}>{children}</ul>;
};

export default ListBody;
