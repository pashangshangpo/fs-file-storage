(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('fs'), require('path'), require('os')) :
  typeof define === 'function' && define.amd ? define(['fs', 'path', 'os'], factory) :
  (global.fsFileStorage = factory(global.fs,global.path,global.os));
}(this, (function (Fs,path,Os) {
  Fs = Fs && Fs.hasOwnProperty('default') ? Fs['default'] : Fs;
  var path__default = 'default' in path ? path['default'] : path;
  Os = Os && Os.hasOwnProperty('default') ? Os['default'] : Os;

  const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

  const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

  /**
   * 初始化目录
   * @param {String} path 目录路径
   */

  var initDir = function (path$$1) {
    try {
      var splitLine = Os.platform() === 'win32' ? '\\' : '/';
      var paths = path$$1.split(splitLine);
      paths.pop();
      var dir = paths.join(splitLine);

      var _temp2 = function () {
        if (dir) {
          return Promise.resolve(exists(dir)).then(function (isExists) {
            var _temp = function () {
              if (!isExists) {
                return Promise.resolve(mkdir(dir)).then(function () {});
              }
            }();

            if (_temp && _temp.then) { return _temp.then(function () {}); }
          });
        }
      }();

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * 判断文件路径是否存在
   * @param {String} path 文件路径
   */


  var exists = function (path$$1) {
    return new Promise(function (resolve) {
      Fs.access(path$$1, Fs.constants.F_OK, function (err) {
        resolve(err ? false : true);
      });
    });
  };
  /**
   * 写入JSON数据到文件
   * @param {String} path 文件路径
   * @param {Object} json JSON数据
   */


  var writeJson = function (path$$1, json) {
    try {
      return Promise.resolve(initDir(path$$1)).then(function () {
        return new Promise(function (resolve) {
          Fs.writeFile(path$$1, JSON.stringify(json), function (err) {
            resolve(err ? false : true);
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * 读取Json文件数据
   * @param {String} path 文件路径
   */


  var readJson = function (path$$1) {
    return new Promise(function (resolve) {
      Fs.readFile(path$$1, function (err, data) {
        data = data.toString() || null;

        if (data) {
          data = JSON.parse(data);
        }

        resolve(err ? null : data);
      });
    });
  };
  /**
   * 创建目录
   * @param {String} path 目录路径
   */


  var mkdir = function (path$$1) {
    try {
      return Promise.resolve(initDir(path$$1)).then(function () {
        return new Promise(function (resolve) {
          Fs.mkdir(path$$1, function () {
            try {
              return Promise.resolve(exists(path$$1)).then(function (_exists) {
                resolve(_exists);
              });
            } catch (e) {
              return Promise.reject(e);
            }
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * 删除文件
   * @param {String} path 文件路径
   */


  var deleteFile = function (path$$1) {
    return new Promise(function (resolve) {
      Fs.unlink(path$$1, function (err) {
        resolve(err ? false : true);
      });
    });
  };

  var getUUID = function () {
    var time = Date.now().toString(16);
    var random = Math.random().toString(16).slice(2);
    return (time + random).slice(0, 18);
  };

  var index = (function (dataPath) {
    var indexPath = path__default.join(dataPath, 'indexs');
    var contentsPath = path__default.join(dataPath, 'contents');
    /**
     * 获取当前数据列表
     * @returns {Array} [] 返回列表数据
     */

    var getList = function () {
      try {
        return Promise.resolve(exists(indexPath)).then(function (_exists) {
          if (_exists) {
            return readJson(indexPath);
          }

          return [];
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
    /**
     * 查找数据
     * @param {Object|Function} filterJson 索引数据json对象或过滤方法
     */


    var search = function (filterJson) {
      try {
        return Promise.resolve(getList()).then(function (list) {
          return typeof filterJson === 'function' ? list.filter(filterJson) : list.filter(function (item) {
            for (var i = 0, list = Object.keys(filterJson); i < list.length; i += 1) {
              var key = list[i];

              if (filterJson[key] !== item[key]) {
                return false;
              }
            }

            return true;
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
    /**
     * 获取单条数据
     * @param {Object|String} filterJson 过滤对象或id
     * @return {Object} infoJson 详情数据json对象
     */


    var get = function (filterJson) {
      try {
        if (typeof filterJson === 'string') {
          return Promise.resolve(readJson(path.join(contentsPath, filterJson)));
        }

        return Promise.resolve(getList()).then(function (list) {
          var item = list.find(function (li) {
            for (var i = 0, list = Object.keys(filterJson); i < list.length; i += 1) {
              var key = list[i];

              if (li[key] !== filterJson[key]) {
                return false;
              }
            }

            return true;
          });
          return item ? readJson(path.join(contentsPath, item._id)) : null;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
    /**
     * 添加数据
     * @param {Object} json 索引数据json对象
     * @param {Object} infoJson 详情数据json对象
     * @returns {number} 返回数组长度
     */


    var add = function (json, infoJson) {
      try {
        return Promise.resolve(getList()).then(function (list) {
          var id = getUUID();
          var newJson = Object.assign(json, {
            _id: id
          });
          list.push(newJson);
          return Promise.resolve(writeJson(indexPath, list)).then(function () {
            return Promise.resolve(writeJson(path.join(contentsPath, id), Object.assign({}, newJson,
              infoJson))).then(function () {
              return list.length;
            });
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
    /**
     * 数据修改
     * @param {Object|String}  filterJson 过滤对象或ID
     * @param {Object} json 数据对象
     * @param {Object} 可选对象 { infojson = {}, replace = false }
     */


    var set = function (filterJson, json, ref) {
      if ( ref === void 0 ) ref = {};
      var infoJson = ref.infoJson;
      var replace = ref.replace;

      try {
        return Promise.resolve(get(filterJson)).then(function (item) {
          return Promise.resolve(getList()).then(function (list) {
            var id = item._id;
            var index = list.findIndex(function (li) { return li._id === id; });

            if (replace) {
              list.splice(index, 1, Object.assign({}, json,
                {_id: id}));
              writeJson(indexPath, list);
              writeJson(path.join(contentsPath, id), Object.assign({}, json,
                infoJson,
                {_id: id}));
              return;
            }

            list.splice(index, 1, Object.assign({}, list[index],
              json));
            writeJson(indexPath, list);
            writeJson(path.join(contentsPath, id), Object.assign({}, item,
              json,
              infoJson));
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
    /**
     * 数据插入到指定位置
     * @param {Number|String} index数据插入位置或Id
     * @param {Object} json 数据对象
     * @param {Object} infojson 修改主体json
     */


    var insert = function (index, json, infoJson) {
      try {
        return Promise.resolve(getList()).then(function (list) {
          var id = getUUID();
          var newJson = Object.assign({}, json,
            {_id: id});

          if (typeof index === 'string') {
            index = list.findIndex(function (item) { return item._id === index; });
          }

          list.splice(index, 0, newJson);
          writeJson(indexPath, list);
          writeJson(path.join(contentsPath, id), Object.assign({}, newJson,
            infoJson));
          return list.length;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
    /**
     * 数据排序
     * @param {Function} fun 传递一个函数，对数据进行排序
     * @returns {Array} 排序后的数组
     */


    var sort = function (fun) {
      try {
        return Promise.resolve(getList()).then(function (list) {
          return list.sort(fun);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
    /**
     * 删除数据
     * @param {Object|String} filterKey 删除符合条件的数据
     * @returns {Number} index 被删除的索引
     */


    var remove = function (filterKey) {
      try {
        return Promise.resolve(getList()).then(function (list) {
          var index = -1;

          if (typeof filterKey === 'string') {
            index = list.findIndex(function (item) { return item._id === filterKey; });
          } else {
            index = list.findIndex(function (item) {
              for (var i = 0, list = Object.keys(filterKey); i < list.length; i += 1) {
                var key = list[i];

                if (filterKey[key] !== item[key]) {
                  return false;
                }
              }

              return true;
            });
          }

          if (index > -1) {
            var id = list[index]._id;
            list.splice(index, 1);
            writeJson(indexPath, list);
            deleteFile(path.join(contentsPath, id));
          }

          return index;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return {
      getList: getList,
      search: search,
      get: get,
      add: add,
      set: set,
      insert: insert,
      sort: sort,
      remove: remove
    };
  });

  return index;

})));
