# 系统命令参考

> 本文档帮助 AGENT 在不同操作系统下选择正确的命令。在执行任何命令前，请先检测操作系统类型。

## 操作系统检测

> 建议使用 Node.js 方式检测，跨 Shell 兼容。

| 检测方式 | Linux                          | Windows                        |
| -------- | ------------------------------ | ------------------------------ |
| Node.js  | `process.platform === 'linux'` | `process.platform === 'win32'` |

**AGENT 应在执行系统命令前先检测 OS，然后选择对应命令。**

## 文件与目录操作（核心差异）

| 操作         | Linux               | Windows                                             | 参数差异说明                                             |
| ------------ | ------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| 列出文件     | `ls`                | `dir`                                               | 命令完全不同                                             |
| 列出所有文件 | `ls -a`             | `dir /a`                                            | `-a` ↔ `/a`                                              |
| 详细列表     | `ls -la`            | `dir /a`                                            | `/a` 显示所有属性文件（含隐藏），可加 `:d`/`:h` 限定类型 |
| 创建目录     | `mkdir <dir>`       | `mkdir <dir>`                                       |                                                          |
| 创建多级目录 | `mkdir -p a/b/c`    | `mkdir a/b/c` 或 `mkdir a\b\c`                      | Windows 不支持 `-p`，但支持路径分隔符创建多级目录        |
| 删除文件     | `rm <file>`         | `del <file>`                                        |                                                          |
| 强制删除文件 | `rm -f <file>`      | `del /f <file>`                                     | `-f` ↔ `/f`                                              |
| 删除目录     | `rm -r <dir>`       | `rmdir <dir>`                                       |                                                          |
| 强制删除目录 | `rm -rf <dir>`      | `rmdir /s /q <dir>`                                 | 参数完全不同                                             |
| 复制文件     | `cp <src> <dst>`    | `copy <src> <dst>`                                  |                                                          |
| 复制目录     | `cp -r <src> <dst>` | `xcopy <src> <dst> /s /e` 或 `robocopy <src> <dst>` | 参数完全不同                                             |
| 移动/重命名  | `mv <src> <dst>`    | `move <src> <dst>`                                  |                                                          |
| 查看文件内容 | `cat <file>`        | `type <file>`                                       |                                                          |
| 分页查看     | `less <file>`       | `more <file>`                                       | 交互操作不同                                             |
| 清屏         | `clear`             | `cls`                                               |                                                          |
| 树形目录结构 | `tree <dir>`        | `tree <dir>`                                        |                                                          |
|              | `tree -L 2` (深度2) | `tree /F` (显示文件)                                | `/F` 显示文件名，`/A` 使用 ASCII 字符                    |

## 系统信息命令

| 操作         | Linux       | Windows         | 参数差异说明 |
| ------------ | ----------- | --------------- | ------------ |
| 查看帮助     | `man <cmd>` | `<cmd> /?`      | 完全不同     |
| 查看当前目录 | `pwd`       | `cd` (无参数)   |              |
| 用户主目录   | `~`         | `%USERPROFILE%` |              |
| 环境变量引用 | `$VAR`      | `%VAR%`         |              |
| 查看环境变量 | `printenv`  | `set`           |              |

## 网络与系统状态

| 操作       | Linux              | Windows               | 参数差异说明 |
| ---------- | ------------------ | --------------------- | ------------ |
| 查看IP     | `ip addr`          | `ipconfig`            | 完全不同     |
| 测试连通性 | `ping -c 4 <host>` | `ping -n 4 <host>`    | `-c` ↔ `-n`  |
| 查看端口   | `netstat -tuln`    | `netstat -an`         | 参数不同     |
| 查看进程   | `ps aux`           | `tasklist`            | 完全不同     |
| 结束进程   | `kill <pid>`       | `taskkill /pid <pid>` | 完全不同     |

## 查找与搜索命令

| 操作         | Linux                 | Windows              | 参数差异说明                 |
| ------------ | --------------------- | -------------------- | ---------------------------- |
| 查找命令位置 | `which <cmd>`         | `where <cmd>`        |                              |
| 文本内容搜索 | `grep <pattern>`      | `findstr <pattern>`  | 参数不同，`findstr` 支持正则 |
| 文件搜索     | `find . -name "*.ts"` | `dir /s /b *.ts`     | 完全不同                     |
| 查找大文件   | `find . -size +100M`  | `dir /s /o:-s *.ps1` | 完全不同                     |

> **提示**：跨平台文件搜索推荐使用 `rg` (ripgrep)，命令一致。

## Git 操作（跨平台兼容）

| 操作     | 命令                  |
| -------- | --------------------- |
| 查看状态 | `git status`          |
| 查看差异 | `git diff`            |
| 查看日志 | `git log --oneline`   |
| 暂存文件 | `git add <file>`      |
| 提交     | `git commit -m "msg"` |

> **注意**：Git 官方客户端已实现跨平台兼容，命令一致。

## Node.js 项目命令（跨平台兼容）

| 操作        | 命令                           |
| ----------- | ------------------------------ |
| 启动开发    | `pnpm dev`                     |
| 运行测试    | `pnpm test`                    |
| 构建        | `pnpm build`                   |
| 代码检查    | `pnpm lint`                    |
| Prisma push | `tsx ./scripts/prisma.ts push` |

> **注意**：pnpm、tsx 等 Node.js 工具命令跨平台兼容，但**路径分隔符**可能需要根据系统调整。

## AGENT 命令执行流程

1. **检测操作系统**

   ```typescript
   const isWindows = process.platform === 'win32';
   ```

2. **根据任务选择命令**
   - 文件列表 → Windows: `dir`，Linux: `ls`
   - 查看文件 → Windows: `type`，Linux: `cat`
   - 创建目录 → Windows: `mkdir`，Linux: `mkdir -p`（多级）
   - 删除文件 → Windows: `del`，Linux: `rm`
   - 删除目录 → Windows: `rmdir /s /q`，Linux: `rm -rf`

3. **执行命令**
   使用 Bash 工具执行

## 常见错误对照

| 错误命令（Windows） | 正确命令（Windows） | 错误原因     |
| ------------------- | ------------------- | ------------ |
| `ls`                | `dir`               | Linux 命令   |
| `ls -a`             | `dir /a`            | 参数格式不同 |
| `rm file.txt`       | `del file.txt`      | Linux 命令   |
| `rm -rf dir`        | `rmdir /s /q dir`   | 参数完全不同 |
| `cat file.txt`      | `type file.txt`     | Linux 命令   |
| `clear`             | `cls`               | Linux 命令   |
| `man cmd`           | `cmd /?`            | 完全不同     |
