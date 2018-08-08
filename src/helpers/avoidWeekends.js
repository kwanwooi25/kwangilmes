import moment from 'moment';

export const avoidWeekends = (date) => {
	if (moment(date).weekday() === 6) return moment(date).subtract(1, 'days');
	if (moment(date).weekday() === 0) return moment(date).add(1, 'days');
	return date;
};
