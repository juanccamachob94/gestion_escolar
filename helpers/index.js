module.exports = {
  randomString: (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  },
  buildParams: (validParams,body) => {
    let params = {};
    validParams.forEach(attr => {
      if(Object.prototype.hasOwnProperty.call(body,attr))
        params[attr] = body[attr];
    });
    return params;
  },
  jsonToList: (json) => {
    let list = [];
    for(var attr in json) list.push(attr);
    return list;
  }
};
