npm : 无法加载文件 C:\Program Files\nodejs\npm.ps1，因为在此系统上禁止
运行脚本。

1、在 vscode 终端执行

输入：get-ExecutionPolicy
# 返回 Restricted 说明状态是禁止的
Restricted

2、更改状态
set-ExecutionPolicy RemoteSigned
如果提示需要管理员权限，可加参数运行

输入：Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
此时再输入 get-ExecutionPolicy ，显示 RemoteSigned 即可正常执行 npm 命令。