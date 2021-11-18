import moment from 'moment';

const isToday = date => moment(0, 'HH').diff(date, 'days') === 0;

export default isToday;
