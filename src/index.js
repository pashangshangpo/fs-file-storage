import path from 'path'
import { mkdir, writeJson, readJson, exists, deleteFile } from 'fs-promise'

export default dataPath => {
  const indexPath = path.join(dataPath, 'index.json')
  const contentsPath = path.join(dataPath, 'contents')

  /**
    * 初始文件目录
    */
  const init = async () => {
    if (!await exists(dataPath)) {
      await mkdir(dataPath)
    }

    if (!await exists(indexPath)) {
      writeJson(indexPath, [])
    }

    if (!await exists(contentsPath)) {
      mkdir(contentsPath)
    }
  }

  /**
    * 获取当前数据列表
    * @returns {Array} [] 返回获列表数据
    */
  const getList = () => readJson(indexPath)

  /**
    * 查找数据
    * @param {Object} json 索引数据json对象
    * @param {Object} infoJson 详情数据json对象
    */
  const search = async (data) => {
    let oldList = await getList()
    let newlist = []

    newlist = oldList.filter((item) => {
      for (let key in data) {
        if (data[key] !== item[key]) {
          return false
        }
      }

      return true
    })

    return newlist
  }


  /**
     * 获取单条数据
     * @param {string} path 索引数据json对象
     * @return {Object} infoJson 详情数据json对象
     */
  const get = async (path) => {
    return readJson(path);
  }


  /**
    * 添加数据
    * @param {Object} json 索引数据json对象
    * @param {Object} infoJson 详情数据json对象
    * @returns {number} index/-1 添加成功返回当前索引位置index，添加失败返回-1
    */
  const add = async (listjson, infoJson, index) => {

    let List = await getList()
    let _fileName = (Date.now().toString(16) + Math.random().toString(16).slice(2)).slice(0, 18)
    let _listJson = { ...{ '_id': _fileName }, ...listjson }
    let _returnRes;

    if (!!index || index == 0) {
      List.splice(List, 0, _listJson)
    } else {
      List.push(_listJson)
    }

    await writeJson(dataPath + '/index.json', List)
    await writeJson(dataPath + '/contents/' + _fileName + '.json', { ..._listJson, ...infoJson }).then(res => {
      if (res) {
        _returnRes = List.length
      } else {
        _returnRes = '-1'
      }
    }).catch(() => {
      _returnRes = '-1'
    })
    return _returnRes
  }


  /**
    * 数据修改
    * @param {Object}}  data 索引条件
    * @param {Object}} listjson 列表json 
    * @param {Object}} infojson 修改主体json 
    * @param {boolean}} bool 是否替换原内容 
    * @returns {JSON}} {} 修改完成后的json 数据
    */
  const set = async (data, listjson, infoJson, Bool) => {

    let findJsons = await search(data);
    let thisJson = {}
    if (findJsons.length > 0) {
      thisJson = findJsons[0]
    } else {
      return false
    }

    let List = await getList()
    let _index = List.findIndex((item) => {
      return item._id == thisJson._id
    })

    let _fileName = List[_index]._id
    let _Infojson = await get(dataPath + '/contents/' + _fileName + '.json')

    let new_infoJson = {}
    let _writeJson = {}

    if (Bool == true) {

      const _tjson = { ...{ _id: _fileName }, ...listjson }
      List[_index] = _tjson
      _writeJson = { ...listjson, ...infoJson }

    } else {

      let new_listjson = { ...List[_index], ...listjson }
      List[_index] = new_listjson

      new_infoJson = { ...new_listjson, ...infoJson }
      _writeJson = { ..._Infojson, ...new_infoJson }

    }
    console.log('_fileName:', _fileName);
    writeJson(dataPath + '/index.json', List);
    writeJson(dataPath + '/contents/' + _fileName + '.json', _writeJson)

    return _writeJson
  }


  /**
    * 数据插入
    * @param {Number}} index 数据插入位置
    * @param {json}} listjson 列表json 
    * @param {json}} infojson 修改主体json  
    * @returns {JSON}} {}
    */
  const insert = async (index, listjson, infoJson) => {

    let addfile = await add(listjson, infoJson, index)
    let list = await getList()

    return list
  }

  /**
   * 数据排序
   * @param {Function} fun 传递一个函数，对数据进行排序
   * @returns {Array} 排序后的数组
   */
  const sort = async (fun) => {
    let list = await getList()

    return list.sort(fun)
  }

  /**
   * 删除数据
   * @param {Object} filterKey 删除符合条件的数据
   * @returns {Number} -1|index
   */
  const remove = async (filterKey) => {
    let List = await getList()
    let newlist = []
    let deleteArr = [];

    newlist = List.filter((item, index) => {
      for (let key in filterKey) {
        console.log(filterKey[key], item[key])
        console.log(filterKey[key] == item[key])
        if (filterKey[key] == item[key]) {

          deleteArr.push(index)
          deleteFile(dataPath + '/contents/' + item._id + '.json')
          return false
        }
      }
      return true
    })
    writeJson(dataPath + '/index.json', newlist);

    return deleteArr
  }

  init()

  return {
    getList,
    search,
    get,
    add,
    set,
    insert,
    sort,
    remove,
  }
}
