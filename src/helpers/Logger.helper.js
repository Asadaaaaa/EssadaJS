export default (text) => {
  const date = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}));
  const currentDate = '[' + 
    date.getDate() + '/' +
    (date.getMonth() + 1) + '/' +
    date.getHours() + ':' +
    date.getMinutes() + ':' +
    date.getSeconds() +
  ']';

  console.log('\n' + currentDate + ' (' + process.pid + '): ' + text);
}