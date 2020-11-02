import path, { join } from 'path'
import { mkdir, writeJson, readJson, exists, deleteFile } from 'fs-promise'

export default dataPath => {
  const indexPath = path.join(dataPath, 'index.json')
  const contentsPath = path.join(dataPath, 'contents')

  /**
   * 初始文件目录
   */
  const init = async () => {
    if (!(await exists(dataPath))) {
      await mkdir(dataPath)
    }

    if (!(await exists(indexPath))) {
      writeJson(indexPath, [])
    }

    if (!(await exists(contentsPath))) {
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
  const search = async data => {
    let list = await getList()

    return list.filter(item => {
      for (let key in data) {
        if (data[key] !== item[key]) {
          return false
        }
      }

      return true
    })
  }

  /**
   * 获取单条数据
   * @param {string} path 索引数据json对象
   * @return {Object} infoJson 详情数据json对象
   */
  const get = async filterData => {
    let list = await getList()

    return readJson(path)
  }

  /**
   * 添加数据
   * @param {Object} json 索引数据json对象
   * @param {Object} infoJson 详情数据json对象
   * @returns {number} index/-1 添加成功返回当前索引位置index，添加失败返回-1
   */
  const add = async (listjson, infoJson) => {
    let jsonlist = await getList()
    let fileName = getfilename()

    let _listJson = { ...{ _id: fileName }, ...listjson }
    jsonlist.push(_listJson)

    console.log(indexPath)
    writeJson(indexPath, jsonlist)

    writeJson(join(contentsPath, fileName + '.json'), {
      ..._listJson,
      ...infoJson,
    })
    console.log(indexPath)

    return jsonlist.length
  }

  /**
   * 数据修改
   * @param {Object}}  data 索引条件
   * @param {Object}} listjson 列表json
   * @param {Object}} infojson 修改主体json
   * @param {boolean}} bool 是否替换原内容
   * @returns {JSON}} {} 修改完成后的json 数据
   */
  const set = async (filterData, listjson, infoJson, bool) => {
    let findJsons = await search(filterData)
    let thisJson = {}

    if (findJsons.length > 0) {
      thisJson = findJsons[0]
    } else {
      return false
    }

    let List = await getList()
    let _index = List.findIndex(item => {
      return item._id == thisJson._id
    })

    let _fileName = List[_index]._id
    let _Infojson = await readJson(contentsPath + _fileName + '.json')

    let _writeJson = {}

    if (bool) {
      List[_index] = { ...{ _id: _fileName }, ...listjson }
      _writeJson = { ...listjson, ...infoJson }
    } else {
      List[_index] = { ...List[_index], ...listjson }
      _writeJson = { ...List[_index], ..._Infojson, ...infoJson }
    }

    writeJson(indexPath, List)
    writeJson(join(contentsPath, _fileName + '.json'), _writeJson)

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
    let jsonlist = await getList()
    const _id = getfilename()

    let _listJson = { ...{ _id: _id }, ...listjson }
    jsonlist.splice(index, 0, _listJson)
    const writejson = { ..._listJson, ...infoJson }

    console.log(jsonlist)

    writeJson(indexPath, jsonlist)
    writeJson(join(contentsPath, _id + '.json'), writejson)

    return jsonlist
  }

  /**
   * 数据排序
   * @param {Function} fun 传递一个函数，对数据进行排序
   * @returns {Array} 排序后的数组
   */
  const sort = async fun => {
    let list = await getList()

    return list.sort(fun)
  }

  /**
   * 删除数据
   * @param {Object} filterKey 删除符合条件的数据
   * @returns {Array} []
   */
  const remove = async filterKey => {
    let List = await getList()
    let newlist = []
    let deleteArr = []

    newlist = List.filter(item => {
      for (let key in filterKey) {
        if (filterKey[key] !== item[key]) {
          return true
        }
      }

      deleteArr.push(item)
      deleteFile(contentsPath + item._id + '.json')

      return false
    })

    writeJson(indexPath, newlist)

    return deleteArr
  }

  /**
   * 添加新文件
   * @param {Object} filterKey 删除符合条件的数据
   * @returns {Array} []
   */

  const getfilename = () => {
    let _fileName = (
      Date.now().toString(16) +
      Math.random()
        .toString(16)
        .slice(2)
    ).slice(0, 18)

    return _fileName
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
