const Storage = require('../dist/fs-file-storage')
const storage = Storage('blog')

// storage.add(
//   {
//     name: 'Hello World'
//   },
//   {
//     content: 'content.....'
//   }
// )

// storage.add(
//   {
//     name: 'Hello World 3'
//   }
// )

// storage.getList().then(list => {
//   // storage.get(list[1]._id).then(console.log)
//   storage.get({
//     name: 'Hello World 3'
//   }).then(console.log)
// })

// storage.search(item => item.name.includes('Hello World 3') || item.name.includes('Hello World 2')).then(console.log)

// storage.remove('1759314c3c8d65f49d').then(console.log)
// storage.remove({
//   name: 'Hello World 3'
// }).then(console.log)

// storage.set(
//   '17593784a6fa29b0c5',
//   {
//     content: 'hello11',
//     content2: 'world11'
//   },
//   // {
//   //   infoJson: {
//   //     content3: '555'
//   //   },
//   //   replace: true
//   // }
// )

// storage.insert(
//   0,
//   {
//     name: '张三'
//   }
// )

// storage.insert(
//   0,
//   {
//     name: '李四'
//   },
//   {
//     content: 'hhhh'
//   }
// )

// storage.insert(
//   1,
//   {
//     name: '王武'
//   }
// )

// storage.insert(
//   '175938e57136a56bb3',
//   {
//     name: '666'
//   }
// )
