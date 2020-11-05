import path, { join } from 'path'
import { writeJson, readJson, exists, deleteFile } from 'fs-promise'

const getUUID = () => {
  const time = Date.now().toString(16)
  const random = Math.random()
    .toString(16)
    .slice(2)

  return (time + random).slice(0, 18)
}

export default dataPath => {
  const indexPath = path.join(dataPath, 'indexs')
  const contentsPath = path.join(dataPath, 'contents')

  /**
   * 获取当前数据列表
   * @returns {Array} [] 返回获列表数据
   */
  const getList = async () => {
    if (await exists(indexPath)) {
      return readJson(indexPath)
    }

    return []
  }

  /**
   * 查找数据
   * @param {Object|Function} filterJson 索引数据json对象或过滤方法
   */
  const search = async filterJson => {
    let list = await getList()

    if (typeof filterJson === 'function') {
      return list.filter(filterJson)
    }

    return list.filter(item => {
      for (let key of Object.keys(filterJson)) {
        if (filterJson[key] !== item[key]) {
          return false
        }
      }

      return true
    })
  }

  /**
   * 获取单条数据
   * @param {Object|String} filterJson 过滤对象或id
   * @return {Object} infoJson 详情数据json对象
   */
  const get = async filterJson => {
    if (typeof filterJson === 'string') {
      return readJson(join(contentsPath, filterJson))
    }

    const list = await getList()

    const item = list.find(li => {
      for (let key of Object.keys(filterJson)) {
        if (li[key] !== filterJson[key]) {
          return false
        }
      }

      return true
    })

    if (!item) {
      return null
    }

    return readJson(join(contentsPath, item._id))
  }

  /**
   * 添加数据
   * @param {Object} json 索引数据json对象
   * @param {Object} infoJson 详情数据json对象
   * @returns {number} 返回数组长度
   */
  const add = async (json, infoJson) => {
    let list = await getList()
    let id = getUUID()

    let newJson = Object.assign(json, {
      _id: id,
    })

    list.push(newJson)

    await writeJson(indexPath, list)
    await writeJson(join(contentsPath, id), {
      ...newJson,
      ...infoJson,
    })

    return list.length
  }

  /**
   * 数据修改
   * @param {Object|String}  filterJson 过滤对象或ID
   * @param {Object} json 数据对象
   * @param {Object} 可选对象 { infojson = {}, replace = false }
   */
  const set = async (filterJson, json, { infoJson, replace } = {}) => {
    const item = await get(filterJson)
    const list = await getList()
    const id = item._id
    const index = list.findIndex(li => li._id === id)

    if (replace) {
      list.splice(index, 1, {
        ...json,
        _id: id,
      })

      writeJson(indexPath, list)
      writeJson(join(contentsPath, id), {
        ...json,
        ...infoJson,
        _id: id,
      })

      return
    }

    list.splice(index, 1, {
      ...list[index],
      ...json,
    })

    writeJson(indexPath, list)
    writeJson(join(contentsPath, id), {
      ...item,
      ...json,
      ...infoJson,
    })
  }

  /**
   * 数据插入到指定位置
   * @param {Number|String} index数据插入位置或Id
   * @param {Object} json 数据对象
   * @param {Object} infojson 修改主体json
   */
  const insert = async (index, json, infoJson) => {
    const list = await getList()
    const id = getUUID()
    const newJson = {
      ...json,
      _id: id,
    }

    if (typeof index === 'string') {
      index = list.findIndex(item => item._id === index)
    }

    list.splice(index, 0, newJson)

    writeJson(indexPath, list)
    writeJson(join(contentsPath, id), {
      ...newJson,
      ...infoJson,
    })

    return list.length
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
   * @param {Object|String} filterKey 删除符合条件的数据
   * @returns {Number} index 被删除的索引
   */
  const remove = async filterKey => {
    let list = await getList()
    let index = -1

    if (typeof filterKey === 'string') {
      index = list.findIndex(item => item._id === filterKey)
    } else {
      index = list.findIndex(item => {
        for (let key of Object.keys(filterKey)) {
          if (filterKey[key] !== item[key]) {
            return false
          }
        }

        return true
      })
    }

    if (index > -1) {
      const id = list[index]._id

      list.splice(index, 1)

      writeJson(indexPath, list)
      deleteFile(join(contentsPath, id))
    }

    return index
  }

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
