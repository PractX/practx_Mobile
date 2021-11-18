import moment from 'moment';

const datesGroupByComponent = (dates, token) => {
  return dates.reduce(function (val, obj) {
    let comp = moment(obj.createdAt, 'YYYY/MM/DD').format(token);
    console.log('DATE TIME', comp);
    (val[comp] = val[comp] || []).reverse().push(obj);
    return val;
  }, {});
};

export default datesGroupByComponent;
