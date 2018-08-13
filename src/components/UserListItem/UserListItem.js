import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import './UserListItem.css';

const UserListItem = ({
	user,
	current_user,
	onListItemPasswordChangeClick,
	onListItemEditClick,
	onListItemDeleteClick
}) => {
	const { id, display_name, user_department, user_position, user_phone, permission_id, user_memo } = user;
	const user_permission =
		permission_id === 1 ? '최종관리자' : permission_id === 2 ? '관리자' : permission_id === 3 ? '사용자' : '';
	return (
		<li key={id} className="list-body__item">
			<Grid container className="list-body__item-details">
				<Grid item xs={12}>
					{display_name}
				</Grid>
				<Grid item xs={12}>
					{user_department && <span>{user_department}</span>}
				</Grid>
				<Grid item xs={12}>
					{user_position && <span>{user_position}</span>}
				</Grid>
				<Grid item xs={12}>
					{user_phone && <span>{user_phone}</span>}
				</Grid>
				<Grid item xs={12}>
					{user_permission && <span>{user_permission}</span>}
				</Grid>
				<Grid item xs={12}>
					{user_memo && <span>{user_memo}</span>}
				</Grid>
			</Grid>
			{current_user.can_write_users && (
				<div className="list-body__item-buttons">
					<Tooltip title="비밀변호 변경">
						<IconButton
							color="primary"
							aria-label="change password"
							onClick={() => {
								onListItemPasswordChangeClick(id);
							}}
						>
							<Icon>vpn_key</Icon>
						</IconButton>
					</Tooltip>
					<Tooltip title="수정">
						<IconButton
							color="primary"
							aria-label="edit"
							onClick={() => {
								onListItemEditClick(id);
							}}
						>
							<Icon>edit</Icon>
						</IconButton>
					</Tooltip>
					<Tooltip title="삭제">
						<IconButton
							aria-label="delete"
							disabled={user.permission_id === 1}
							onClick={() => {
								onListItemDeleteClick(id);
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

export default UserListItem;
