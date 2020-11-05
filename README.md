# fs-file-storage

> Fs File Storage

## Use

1、npm i --save https://github.com/pashangshangpo/fs-file-storage.git

2、const Storage = require('fs-file-storage')

## Demo

```js
const Storage = require('fs-file-storage')
const storage = Storage('blog')

storage.add(
  {
    name: 'Hello World'
  },
  {
    content: 'content.....'
  }
)
```

