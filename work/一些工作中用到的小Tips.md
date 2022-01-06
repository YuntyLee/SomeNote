### 小tips

> 开发过程中解决问题的一些小方法

#### useRef 用法

> 手动触发hook中，grid组件的resetColumns方法用来控制列的重新渲染，避免出现列名空白的情况

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

#### 对象数组去重方法

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

#### 递归获取上一个id

版本一：当递归到最上层无数据时，会报错：Maximum call stack size exceeded（ 超出最大调用堆栈大小）

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

版本二：新增容错处理，解决了版本一可能会报错问题

```js
let map = {3:"2515"}; 
// 可能存在上一轮次没有的情况，因此需要单独获取最近的上一轮次 
const lastTendCounts = (map, tendCounts) => {
  let temp = tendCounts - 1;
  let res = map[temp];
  if (!res) {
  // 未找到上一轮，不继续找
    return temp > 0 ? lastTendCounts(map, temp) : null;
  } else {
    return res;
  }
}

let id = lastTendCounts(map, tendCounts) || map[tendCounts];
```

#### sessionStorage 使用

> 可用来保存浏览器的查询条件，浏览器关闭时自动销毁

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

#### 下拉框互斥选中事件

> 选择适用所有后不可选其他选项，反之亦然

```js
let flag = '';
if (!supplierList.length) {
    // 没有可选供应商时，适用所有供应商不可选
    flag = 'other';
}
if (_text.length) {
    if (_text.includes('all')) {//手动选择适用所有供应商,其他供应商不能选择
      flag = 'all';
    } else { //手工选择了其他供应商，适用所有供应商选项不能选择
      flag = 'other';
    }
}
<Select
	style={{ width: 300, maxHeight: 30 }}
    value={_text || []}
    multiple={true}
    placeholder={lang.template("YS_FED_PROJECT_L_00050731") /* "请选择" */}
    onSelect={(value, item) => onChangeData(value, item, record)}
    onDeselect={(value) => onDeselect(value, record)}
    maxTagCount={1}
    noWarp={true}
>
    <Select.Option
		key="all"
        value="all"
        disabled={['', 'all'].includes(flag) ? false : true}
     >
        {lang.template("HAND_SOURCING_0000961") /* "适用所有供应商" */}
     </Select.Option>
     {_supplierList.length && _supplierList.map((item) => {
         return <Select.Option
         	key={item.supplierId}
            disabled={['', 'other'].includes(flag) ? false : true}
            value={item.supplierNo}
            item={item}
			>
              {item.supplierName}
            </Select.Option>
          }
      )}
</Select>
```

#### 数组的容错处理

> arr && arr.map() 可优化成 arr?.map，该处理方式对forEach等方法也生效

##### 可选链操作符

> 说到链式调用，就有必要说一下`JavaScript`的可选链操作符，属于`ES2020`新特性运算符`?.`、`??`、`??=`，可选链操作符`?.`允许读取位于连接对象链深处的属性的值，而不必明确验证链中的每个引用是否有效。`?.`操作符的功能类似于`.`链式操作符，不同之处在于在引用为空`nullish`即`null`或者`undefined`的情况下不会引起错误，该表达式短路返回值是`undefined`。与函数调用一起使用时，如果给定的函数不存在，则返回`undefined`。当尝试访问可能不存在的对象属性时，可选链操作符将会使表达式更短更简明。在探索一个对象的内容时，如果不能确定哪些属性必定存在，可选链操作符也是很有帮助的。

##### 语法

```js
obj?.prop
obj?.[expr]
arr?.[index]
func?.(args)
```

#### 组件-表单中的上传附件

#####  index.js

```js
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Icon, ProgressBar, Button, Upload, Loading } from 'tinper-bee';
import successImg from './ic_file.svg';
import errorImg from './ic_file_error.svg';
import warningPng from './warning.png';
import { getType, Error } from 'utils'
import './index.less';

const noop = () => { };

const propTypes = {
  name: PropTypes.string,//文件名称
  data: PropTypes.object,//上传data
  maxSize: PropTypes.number,//最大值
  className: PropTypes.string,
  isDelete: PropTypes.bool, // 是否可删除，区分是否编辑态
  isShow: PropTypes.bool, //是否显示上传附件按钮
  beforeUpload: PropTypes.func,//上传之前的回调
  onSuccess: PropTypes.func,//上传成功的回调
  onError: PropTypes.func,//上传失败的回调
  onUploading: PropTypes.func,
  delFileClick: PropTypes.func,//删除的回调
  downLoadClick: PropTypes.func,//下载的回调
  action: PropTypes.string,//上传地址
  accept: PropTypes.string,//可接受文件类型
  showList: PropTypes.array,//文件展示的数据
}

const defaultProps = {
  downLoadClick: noop,
  delFileClick: noop,
  className: "",
  isDelete: true,
  isShow: true,
  showList: [],
  action: "/iuap-saas-filesystem-service/file/upload",
  accept: "",
  name: "files",
  data: {},
  maxSize: 10240000000,
  beforeUpload: noop,//上传之前的回调
  onSuccess: noop,//上传成功的回调
  onError: noop,
  onUploading: noop,
}
// 附件上传之后展示组件
const UploadedFile = (props) => {
  const { action, accept, name, data, maxSize, onUploading, className, disabled, isDelete, isShow,
    showList, multiple, showUploadList, defaultFileList, downLoadClick: _downLoadClick, delFileClick: _delFileClick,
    onSuccess: _onSuccess, onError: _onError, beforeUpload: _beforeUpload, reUpload: _reUpload, ...reset } = props;
  console.log(isShow, "isShow");
  console.log(showList, "showList");

  const [isEdit, setIsEdit] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [curIndex, setCurIndex] = useState(null);

  useEffect(() => {
    setIsEdit(isDelete);
  }, [isDelete])

  // 附件下载
  const downLoadClick = (data) => {
    _downLoadClick && _downLoadClick(data);
  }
  // 附件删除
  const delFileClick = (data) => {
    _delFileClick && _delFileClick(data);
  }
  // 文件上传前
  const beforeUpload = (file) => {
    let { fileMaxSize } = props;
    setShowLoading(true)
    //文件大小检查
    if (file.size > fileMaxSize * 1024 * 1024) {
      props.onFileSizeOver && props.onFileSizeOver(file);
      return false;
    }
    if (_beforeUpload) {
      let beforeUploadFunc = _beforeUpload(file);
      if (!beforeUploadFunc) {
        setShowLoading(false);
      }
      return beforeUploadFunc;
    }
    return true;
  }
  // 上传成功
  const onSuccess = (response, file) => {
    let { status, data, message, code } = response;
    if (status == 1 || (code && code.code === '0000')) {
      _onSuccess(data, file);
    }
    else {
      if (!_onError) {
        if (response && response.data === undefined) {
          Error(response.msg);
        } else {
          if (getType(message) === "array") {
            let mes = ""
            for (let i = 0, len = message.length; i < len; i++) {
              mes = mes + message[i].DefaultMessage + "，"
            }
            Error(mes);
          } else {
            Error(message);
          }
        }
      } else {
        _onError(message);
      }
    }
    setShowLoading(false);
  }
  // 重新上传
  const reUpload = (data) => {
    _reUpload && _reUpload(data);
  }
  const uploadProps = {
    ...reset,
    disabled: disabled,
    name: name,
    data: data,
    size: maxSize,
    multiple: multiple,
    showUploadList: showUploadList,
    action: action,
    accept: accept,
    defaultFileList: defaultFileList,
    beforeUpload: beforeUpload,
    onChange: (msg) => {
      if (msg.file.status === 'done') {
        // 区别于FileUpload组件, FileUpload组件此处传参为msg.file.response
        onSuccess && onSuccess(msg.file.response, msg.file);
      }
      if (msg.file.status === 'error') {
        _onError && _onError(msg.file);
        setShowLoading(false);
      }
      if (msg.file.status === 'uploading') {
        onUploading && onUploading(msg.file);
      }
      if (msg.file.status === 'removed') {
        onDelete && onDelete(msg.file);
      }
    },
  }
  return (
    <div className="uploaded-file">
      {isShow &&
        <React.Fragment>
          <Upload {...uploadProps}>
            <Button colors="primary" style={{ marginTop: '10px' }} shape="border">
              {/* <Icon type="uf-upload" /> */}
              {lang.template("YS_FED_PROJECT_L_00050479") /* "上传附件" */}
            </Button>
          </Upload>
          <Loading fullScreen={true} show={showLoading} loadingType="line" />
        </React.Fragment>
      }
      <div className="file-show-uploaded-file">
        {showList?.map((item, index) => {
          let { now, fileName, status } = item;
          let error = status === "error";
          return (
            <div className={(curIndex === index ? `${className} file-show file-onmouseover` : `${className} file-show`)}
              onMouseOver={() => setCurIndex(index)}
              onMouseOut={() => setCurIndex(null)}>
              <div className={isEdit ? (!error ? "uploadfile-panel" : "uploadfile-error-panel") : "uploadfile-detail-panel"} >
                <img src={!error ? successImg : errorImg} />
                <span onClick={!error ? () => downLoadClick(item) : noop}>
                  {fileName}
                </span>
                {error && <img src={warningPng} />}
                <div className="uploadfile-icon">
                  {isEdit && !error && <Icon className='del-file-mark' onClick={() => delFileClick(item)} type='uf-close' />}
                </div>
              </div>
              <div className="progressbar">
                {isEdit && now !== 100 && <div className={!error ? "uploadfile-progressbar" : "uploadfile-error-progressbar"}>
                  {/* 只在编辑态并且进度条不等于100时显示进度条 */}
                  <ProgressBar size="xs" active now={now} label={`${now}%`}></ProgressBar>
                </div>}
                {error && <span className="reupload-span" onClick={() => reUpload(item)}>{lang.template("HAND_SOURCING_0001159")/* 重新上传 */}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div >
  )

}

UploadedFile.propTypes = propTypes;
UploadedFile.defaultProps = defaultProps;
export default UploadedFile;
```

##### index.less

```les
.uploaded-file {
  .file-show-uploaded-file {
    margin-top: 16px;
    flex-wrap: wrap;

    .file-show {
      display: inline-block;
      margin: 0 20px 8px 0;
      position: relative;

      .uploadfile-panel {
        width: 350px;
        height: 28px;
        display: inline-block;

        .uploadfile-icon {
          float: right;
          display: none;
          margin-right: 6px;

          .del-file-mark {
            width: 8px;
            height: 8px;
            font-size: 13px;
            color: #737373;
          }

          .del-file-mark:hover {
            cursor: pointer;
          }
        }

        span {
          color: #2196f3;
        }

        span:hover {
          cursor: pointer;
        }

        img {
          margin-right: 8px;
        }
      }

      // 附件详情
      .uploadfile-detail-panel {
        .uploadfile-icon {
          margin-right: 6px;
        }

        img {
          margin-right: 8px;
        }
      }

      // 上传错误
      .uploadfile-error-panel {
        color: #F04646;

        span {
          margin-right: 8px;
        }

        img:nth-child(3) {
          width: 16px;
          height: 16px;
        }
      }

      .progressbar {

        //进度条公共样式
        .uploadfile-progressbar,
        .uploadfile-error-progressbar {
          width: 232px;
          height: 18px;

          .u-progress.xs {
            width: 200px;
            margin: 1px 0 0 0;

            .u-progress-bar {
              border-radius: 1.5px;

              span {
                font-family: Alibaba-PuHuiTi-R;
                font-size: 12px;
                font-weight: 400;
                line-height: 18px;
                left: 208px;
              }
            }
          }
        }

        // 上传成功进度条
        .uploadfile-progressbar {
          .u-progress.xs {
            .u-progress-bar {
              background: #1993FF;
            }

            span {
              color: #4D4D4D;
            }
          }
        }

        // 上传失败进度条
        .uploadfile-error-progressbar {
          margin-right: 8px;

          .u-progress.xs {
            display: inline-block;

            .u-progress-bar {
              background: #F04646;
            }

            span {
              color: #F04646;
            }
          }
        }

        .reupload-span {
          width: 48px;
          height: 18px;
          font-family: Alibaba-PuHuiTi-R;
          font-size: 12px;
          color: #1993FF;
          text-align: center;
          line-height: 18px;
          font-weight: 400;
          margin-left: 8px;
        }

        span:hover {
          cursor: pointer;
        }
      }
    }

    .file-onmouseover {
      .uploadfile-panel {
        background: #E6F5FF;

        .uploadfile-icon {
          display: block;
        }
      }
    }
  }
}
```

##### ic_file.svg

```html
<?xml version="1.0" encoding="UTF-8"?>
<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>ic_file</title>
    <defs>
        <path d="M8.525,1.002 C8.533,1.002 8.54,1.004 8.548,1.004 L8.548,1.004 C8.67,1.015 8.778,1.07 8.858,1.152 L8.858,1.152 L12.85,5.142 C12.931,5.222 12.986,5.328 12.998,5.45 L12.998,5.45 L12.999,5.4635 L12.999,5.4635 L13,5.475 L13,5.475 L13,13.502 C13,13.779 12.777,14.002 12.5,14.002 L12.5,14.002 L2.5,14.002 C2.223,14.002 2,13.779 2,13.502 L2,13.502 L2,1.502 C2,1.225 2.223,1.002 2.5,1.002 L2.5,1.002 Z M8,2 L3,2 L3,13 L12,13 L12,6 L8.5,6 C8.223,6 8,5.777 8,5.5 L8,5.5 L8,2 Z M10.5,10 C10.777,10 11,10.223 11,10.5 C11,10.777 10.777,11 10.5,11 L10.5,11 L4.5,11 C4.223,11 4,10.777 4,10.5 C4,10.223 4.223,10 4.5,10 L4.5,10 Z M10.5,7 C10.777,7 11,7.223 11,7.5 C11,7.777 10.777,8 10.5,8 L10.5,8 L4.5,8 C4.223,8 4,7.777 4,7.5 C4,7.223 4.223,7 4.5,7 L4.5,7 Z M9,2.707 L9,5 L11.293,5 L9,2.707 Z" id="path-1"></path>
    </defs>
    <g id="ic_file" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <mask id="mask-2" fill="white">
            <use xlink:href="#path-1"></use>
        </mask>
        <use id="形状结合" fill="#737373" fill-rule="nonzero" xlink:href="#path-1"></use>
        <g id="编组" mask="url(#mask-2)" fill="#737373">
            <g id="Icon_Color/normal">
                <rect id="矩形" x="0" y="0" width="16" height="16"></rect>
            </g>
        </g>
    </g>
</svg>
```

##### ic_file_error.svg

```htm
<?xml version="1.0" encoding="UTF-8"?>
<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>ic_file</title>
    <defs>
        <path d="M8.525,1.002 C8.533,1.002 8.54,1.004 8.548,1.004 L8.548,1.004 C8.67,1.015 8.778,1.07 8.858,1.152 L8.858,1.152 L12.85,5.142 C12.931,5.222 12.986,5.328 12.998,5.45 L12.998,5.45 L12.999,5.4635 L12.999,5.4635 L13,5.475 L13,5.475 L13,13.502 C13,13.779 12.777,14.002 12.5,14.002 L12.5,14.002 L2.5,14.002 C2.223,14.002 2,13.779 2,13.502 L2,13.502 L2,1.502 C2,1.225 2.223,1.002 2.5,1.002 L2.5,1.002 Z M8,2 L3,2 L3,13 L12,13 L12,6 L8.5,6 C8.223,6 8,5.777 8,5.5 L8,5.5 L8,2 Z M10.5,10 C10.777,10 11,10.223 11,10.5 C11,10.777 10.777,11 10.5,11 L10.5,11 L4.5,11 C4.223,11 4,10.777 4,10.5 C4,10.223 4.223,10 4.5,10 L4.5,10 Z M10.5,7 C10.777,7 11,7.223 11,7.5 C11,7.777 10.777,8 10.5,8 L10.5,8 L4.5,8 C4.223,8 4,7.777 4,7.5 C4,7.223 4.223,7 4.5,7 L4.5,7 Z M9,2.707 L9,5 L11.293,5 L9,2.707 Z" id="path-1"></path>
    </defs>
    <g id="ic_file" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <mask id="mask-2" fill="white">
            <use xlink:href="#path-1"></use>
        </mask>
        <use id="形状结合" fill="#737373" fill-rule="nonzero" xlink:href="#path-1"></use>
        <g id="编组" mask="url(#mask-2)" fill="#F04646">
            <g id="Icon_Color/normal">
                <rect id="矩形" x="0" y="0" width="16" height="16"></rect>
            </g>
        </g>
    </g>
</svg>
```

##### warning.png

![](../images/tips/warning.png)

##### 最终效果图

上传成功样式

![](..\images\tips\edit_success.bmp)

上传失败样式

![](..\images\tips\edit_error.bmp)

详情展示样式

![](..\images\tips\detail.bmp)

#### 滑动至顶部

```js
const goToTop = () => window.scrollTo(0, 0);
goToTop();
```

