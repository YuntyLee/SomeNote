### CSS伪类和伪元素

> **层叠样式表** (Cascading Style Sheets，缩写为 **CSS**）

#### 伪类

> 伪类时添加到选择器的关键字，指定要选择**元素样式**的特定状态。

##### 常用的伪类元素有：

* **:active** ：匹配被用户激活的元素。用鼠标交互时，它代表的是按下按键和松开按键之间的时间
* **:first-child**：表示在一组兄弟元素中的第一个元素
* **:first-of-type**：表示在一组兄弟元素中其类型的第一个元素，如 p:fisrt-of-type 匹配的是第一个标签类型为<p>的元素
* **:has()**：代表一个元素，其给定的选择器参数（相对于该元素的）最适合匹配一个元素，如 a:has(> img) 匹配的是包含<img>子元素的<a>父元素
* :**hover**：适用于用户使用指示设备虚指一个元素（没有激活它）的情况，如鼠标滑过；:hover伪类可以在任何伪元素上使用；按照LVHA的循顺序声明:link－:visited－:hover－:active
* **:is()**：将选择器列表（如 p, a, i 此类包含逗号的选择器）作为参数，并选择该列表中任意一个选择器可以选择的元素，如 :is(header, main, footer) p:hover 表示选择header、main、footer里的任意一个悬浮状态的段落（p标签），相当于header p:hover, main p:hover, footer p:hover
* **:last-child**：表示父元素的最后一个元素
* **:last-of-type**：表示在（它父元素的）子元素列表中，最后一个给定类型的元素，如 p:last-of-type 匹配的是z最后一个标签类型为<p>的元素
* **:link**：用来选中元素当中的链接
* **:nth-child(an+b)**：首先找到所有当前元素的兄弟元素，然后根据位置先后顺序从1开始排序，选择结果为括号表达式(an+b)（a, b必须为整数）匹配的元素集合；an+b表示奇数时可用odd代替， 表示偶数时可用even表示
* **:visited**：表示用户已访问过的链接
* **:where()**：接受选择器列表作为参数，将会选择所有能被该选择器列表中任何一条规则选中的元素。与:is()的不同之处在于：:where()的优先级总是0，:is()的优先级是由它的选择器列表中优先级最高的选择器决定的

#### 伪元素

> 伪元素是一个附加至选择器末的关键词，允许你对被选择元素的**特定部分**修改样式

##### 常用的伪元素有：



```css
// 列定制图标及其他修改
.uf-grid:before {
    background: url('./ic_column.svg') no-repeat center;
 }

.uf-grid:hover::before {
    background: url('./ic_column_hover.svg') no-repeat center;
}

.uf-grid:active::before {
    background: url('./ic_column_active.svg') no-repeat center;
}

.uf-grid:before,
.uf-grid:hover::before,
.uf-grid:active::before {
    height: 32px;
    width: 32px;
    content: '';
    display: block;
    background-size: 22px 22px;
    box-sizing: content-box;
    margin-top: 3px;
}
```

