/**
 * 使用方法请参考 wiki 文档
 * https://github.com/Qihoo360/wayne/wiki/Wayne-dev-i18n
 */
const fs = require('fs');
const path = require('path');

const defaultValue = require('./src/assets/i18n/zh-Hans.json');
// merge field comman: node lang.js fill;
if (process.argv[2] === 'fill') {
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
      value = JSON.stringify(fill(value, defaultValue), null, 2);
      fs.writeFile(filePath, value, 'utf8', err => {
        if (err) throw error(err);
        console.log('done');
      })
    } else {
      throw error(`${file}.json not found`)
    }
  }
}

// format command: node lang.js format <lang-file-name>.
if (process.argv[2] === 'format') {
  if (process.argv[3] === undefined) {
    console.warn('warn: please add file name to format!')
  }
  if (process.argv[3] === 'zh-Hans') {
    const filePath = path.resolve(__dirname, 'src/assets/i18n', 'zh-Hans.json');
    const enSet = new Set([]);
    const zhSet = new Set([]);
    const matchSet = new Set(['CPU使用']);
    const result = JSON.stringify(defaultValue, null, 2).replace(/([\u4e00-\u9fa5]+)([a-zA-Z]+)/g, function (match, $1, $2) {
      if (matchSet.has(match) || zhSet.has($1) || enSet.has($2)) {
        return match;
      }
      return $1 + ' ' + $2;
    }).replace(/([a-zA-Z]+)([\u4e00-\u9fa5]+)/g, function (match, $1, $2) {
      if (matchSet.has(match) || zhSet.has($2) || enSet.has($1)) {
        return match;
      }
      return $1 + ' ' + $2;
    });
    fs.writeFile(filePath, result, err => {
      if (err) throw error(err);
      console.log('done');
    })
  }
}

// sort
if (process.argv[2] === 'sort') {
  /**
   * {@param} value: Object
   * {@return} sortValue: Object 
   */
  function sort(value) {
    const obj = {};
    if (typeof value === 'object') {
      Object.keys(value).sort().forEach(item => {
        obj[item] = sort(value[item]);
      });
    } else {
      return value;
    }
    return obj;
  }
  const dirPath = path.resolve(__dirname, 'src/assets/i18n');
  if (process.argv[3] !== undefined) {
    const filePath = path.resolve(__dirname, 'src/assets/i18n', /\.json$/.test(process.argv[3]) ? process.argv[3] : process.argv[3] + '.json');
    if (fs.existsSync(filePath)) {
      fs.writeFile(filePath, JSON.stringify(sort(require(filePath)), null, 2), 'utf8', err => {
        if (err) throw error(err);
        console.log('done');
      })
    }
  } else {
    fs.readdir(dirPath, (error, files) => {
      if (error) {
        console.warn(error);
      } else {
        files.forEach(filePath => {
          fs.writeFile(path.resolve(dirPath, filePath), JSON.stringify(sort(require(path.resolve(dirPath, filePath))), null, 2), 'utf8', err => {
            if (err) throw error(err);
            console.log(filePath + ' done');
          })
        })
      }
    })
  }
}
