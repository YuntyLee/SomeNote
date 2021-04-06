# BFC

BFC（block formatting context），块级格式化上下文，它是指一个独立的块级渲染区域，只有Block-level box参与，该区域拥有一套渲染规则来约束块级盒子的布局，且与区域外部无关。

Block-level box：display 属性为block，list-item，table的元素，会生成block-level box

# 一个案例

* 一个盒子不设置height，当内容元素都浮动时，无法撑起自身

```js
/* 此时的父元素高度为0，加上overflow:hidden样式后，高度撑起 */
<style>
  .father{
    width: 200px;
    background-color: burlywood;
    overflow: hidden;
  }
  .son{
    width: 100px;
    height: 100px;
    float: left;
    background-color: cadetblue;
  }
</style>
  <div class="father">
    <div class="son"></div>
    <div class="son"></div>
  </div>
```

* 此时这个盒子没有形成BFC



# BFC的形成

* float的值不为none

* position的值不是static或者relative

* overflow的值不为visible/overflow:hidden

* display的值是inline-block、flex或者inline-flex

  最佳使用：overflow:hidden

# BFC的作用

* BFC可以取消盒子margin塌陷
* BFC可以阻止元素被浮动元素覆盖



一个小tips：

盒子margin塌陷：

```js
 <style>
    /* 只给子元素设置margin值时，父元素会跟随该margin值一起变化，这就是margin塌陷，塌陷仅存在于上下外边距 */
    /* 解决方案：给父元素设置一个overflow:hidden的样式 */
    .father {
      height: 200px;
      width: 300px;
      background-color: blueviolet;
      overflow: hidden;
    }
    .son {
      height: 100px;
      width: 100px;
      background-color: burlywood;
      margin-top: 20px;
    }
 </style>
 <div class="father">
    <div class="son"></div>
 </div>
```

添加overflow:hidden样式前

![BFC-before](..\images\css\BFC-before.png)

添加overflow:hidden样式后

![BFC-after](..\images\css\BFC-after.png)