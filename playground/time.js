const moment = require('moment');

// var date = new Date();
// console.log(date.getMonth());

// var date = moment();
// date.add(1, 'hours').subtract(15, 'minutes');
// console.log(date.format(`HH:mm:SS`));

var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 9234;
var date = moment(createdAt);
console.log(date.format('HH:mm'));
