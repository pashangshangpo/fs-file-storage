import { mkdir } from 'fs-promise'

export default dataPath => {
  mkdir(dataPath)

  /**
   * 获取当前数据列表
   */
  const getList = () => {

  }

  const search = () => {

  }

  const get = () => {

  }

  /**
   * 添加数据
   * @param {Object} json 索引数据json对象
   * @param {Object} infoJson 详情数据json对象
   */
  const add = (json, infoJson) => {

  }

  const set = () => {

  }

  const insert = () => {

  }

  /**
   * 数据排序
   * @param {Function} fun 传递一个函数，对数据进行排序
   * @returns {Array} 排序后的数组
   */
  const sort = (fun) => {

  }

  /**
   * 删除数据
   * @param {Object} filterKey 删除符合条件的数据
   * @returns {Number} -1|index
   */
  const remove = filterKey => {

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
