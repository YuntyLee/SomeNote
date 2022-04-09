### GIT使用过程中常用的命令以及碰到的问题解决方式

#### 常用命令

```bash
git clone -b develop ssh://6081000108@gerritro.zte.com.cn:29418/ZXSCM/ISCP100/zte-scm-iscp-sourcing-fe
--- 拉取指定分支代码库
git pull					---本地与远程同步
git status 					---查看当前状态
git add 文件名(包括路径)		---暂存文件
git commit -m "init"		---提交并添加注释
git push origin HEAD:refs/for/develop%r=wang.kuimang@zte.com.cn		---提交远程库给予指定人员审批
git reset --soft HEAD~1 	---软回滚一次
git reset --hard origin/develop		---与指定远程分支保持一致
git reset 文件名(包括路径)		---回退指定文件状态
git stash					---暂存（更新代码时使用）
git stash pop				---暂存区取回
```

#### git stash pop碰到了一个问题

> 拉取代码冲突后，使用git stash 暂存了代码，git stash pop之后有一个文件被删除了，无法恢复到之前自己更改的版本；解决方案如下：

```bash
$ git fsck --unreachable  	              ---用命令找回并显示出所有不可访问的对象
$ git show   			   	              ---用这个命令找到删除掉的文件
$ git show ID > D:\recovery\backup.txt    ---将误删的文件转存至指定路径，id是通过show找到的id
```

#### git大小写敏感

>  git 不会识别文件夹或者文件名的大小写，所以大家如果对于已经提交的代码，要修改文件或者文件夹名字的，要通过命令配置下
```bash
执行如下命令  可以设置大小写敏感
git config core.ignorecase false
```

#### cherry pick

> 在git仓库直接cherry pick分支代码有冲突时，可以使用命令解决

```bash
先拿到commitID，左侧中部的commit对应的id，复制之后，再冲突的分支中执行
git cherry-pick -n commitID命令
```

