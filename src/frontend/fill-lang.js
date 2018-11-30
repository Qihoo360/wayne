const fs = require('fs');
const path = require('path');

const defaultValue = require('./src/assets/i18n/zh-Hans.json');
// 添加语言后请在下边数组添加文件名
const files = ['en'];
function fill(target, source) {
  if (target === undefined) target = {};
  for(let key in source) {
    if (typeof source[key] === 'object') {
      target[key] = fill(target[key], source[key]);
    } else {
      if (!target[key]) {
        target[key] = source[key];
      }
    }
  }
  return target;
}
for(let file of files) {
  const filePath = path.resolve(__dirname, 'src/assets/i18n', file +'.json');
  if (fs.existsSync(filePath)) {
    let value = require(filePath);
    if (typeof value !== 'object') {
      value = {};
    }
    value = JSON.stringify(fill(value, defaultValue), null, 4);
    fs.writeFile(filePath, value, 'utf8', err => {
      if (err) throw error(err);
      console.log('done');
    })
  } else {
    throw error(`${file}.json不存在`)
  }
}