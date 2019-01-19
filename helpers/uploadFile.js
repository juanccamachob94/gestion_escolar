const fs = require('fs');
module.exports = (file,url) => {
  return new Promise((resolve,reject) => {
    fs.rename(file,url,function (err) {
      if(err) reject(new Error(err));
      else resolve(true);
    })
  });
}
