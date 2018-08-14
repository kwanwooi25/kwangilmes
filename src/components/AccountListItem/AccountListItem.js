import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import AccountName from '../AccountName/AccountName';
import './AccountListItem.css';

const AccountListItem = ({
	searchTerm,
	account,
	hasWritePermission,
	onListItemChecked,
	onListItemEditClick,
	onListItemDeleteClick
}) => {
	const { id, phone, checked } = account;
	return (
		<li key={id} className="list-body__item">
			{hasWritePermission && (
				<div>
					<Checkbox
						checked={checked}
						onChange={() => {
							onListItemChecked(id);
						}}
						color="primary"
					/>
				</div>
			)}
			<Grid container className="list-body__item-details">
				<Grid item xs={12} sm={6}>
					<AccountName account={account} searchTerm={searchTerm} />
				</Grid>
				<Grid item xs={12} sm={4}>
					{phone && <span>{phone}</span>}
				</Grid>
			</Grid>
			{hasWritePermission && (
				<div className="list-body__item-buttons">
					<Tooltip title="수정">
						<IconButton
							color="primary"
							aria-label="edit"
							onClick={() => {
								onListItemEditClick('edit', id);
							}}
						>
							<Icon>edit</Icon>
						</IconButton>
					</Tooltip>
					<Tooltip title="삭제">
						<IconButton
							aria-label="delete"
							onClick={() => {
								onListItemDeleteClick([ id ]);
							}}
						>
							<Icon>delete</Icon>
						</IconButton>
					</Tooltip>
				</div>
			)}
		</li>
	);
};

export default AccountListItem;
