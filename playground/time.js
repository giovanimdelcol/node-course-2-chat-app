var moment = require('moment');

var someTimestamp = moment().valueOf();
console.log(someTimestamp);
var createdAt = someTimestamp;
var date = moment(createdAt).locale('pt-br');

console.log(date.format('Do MMM YYYY h:mm a'))