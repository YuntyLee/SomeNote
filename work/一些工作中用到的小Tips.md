* ### 小tips

* useRef 用法 --手动触发hook中，grid组件的resetColumns方法用来控制列的重新渲染，避免出现列名空白的情况

  ```js
  import React, { useState, useEffect, useRef } from 'react';
  const myRef = useRef(null);
  
  // 需要重新渲染列对应的方法中
  function() {
       if (myRef.current) {
       //grid 组件的resetColumns方法无返回值
       myRef.current.grid.resetColumns(columns);
      }
  }
  <Grid
      columns={columns}
      ref={myRef}
  />
  ```

* 对象数组去重方法

  * filter

  ```js
  function uniqueFunc(arr, key){
    const res = new Map();
    return arr.filter((item) => !res.has(item[key]) && 	res.set(item[key], 1));
  }
  ```
  * reduce

  ```js
  function uniqueFunc(uniqueArr, key) {
    let has = {};
    return uniqueArr.reduce(function (arr, item) {
      !has[item[key]] && (has[item[key]] = true && arr.push(item));
      return arr;
    }, []);
  }
  ```

  * 遍历

  ```js
  function uniqueFunc(arr, key){
    let obj = {}
    let tempArr = []
    for(var i = 0; i<arr.length; i++){
      if(!obj[arr[i][key]]){
        tempArr.push(arr[i])
        obj[arr[i][key]] = true
      }
    }
    return tempArr
  }
  ```

  * 递归获取上一个id
  
  ```js
  let map = {1:"2507",3:"2515"};
    // 可能存在上一轮次没有的情况，因此需要单独获取最近的上一轮次 
  const lastTendCounts = (map, tendCounts) => {
    let temp = tendCounts - 1;
    let res = map[temp];
    if (!res) {
      return lastTendCounts(map, temp);
    } else {
      return res;
    }
  }
  
  let id = lastTendCounts(map, tendCounts) || map[tendCounts];
  ```
  
* sessionStorage 使用：可用来保存浏览器的查询条件，浏览器关闭时自动销毁

    ```js
    // 创建
    sessionStorage.setItem("name", JSON.stringify(params));
    // 使用
    sessionStorage.getItem("name");
    // 删除
    sessionStorage.removeItem("name");
    // 手动销毁
    sessionStorage.clear();
    ```
    
    
    
    



