# Markdown Reader

<img alt="Markdown Reader Logo" src="https://raw.githubusercontent.com/md-reader/md-reader/main/src//images/logo-stroke.svg" align="right" width="120">

[English](./README.md) | 中文 | [한국어](./README-ko.md)

https://md-reader.github.io

[![](https://badgen.net/chrome-web-store/v/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) [![](https://badgen.net/chrome-web-store/stars/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) [![](https://badgen.net/chrome-web-store/users/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg)

Markdown Reader 是一款强大的浏览器扩展程序，能让你在浏览器中快捷的预览 Markdown 文档。

> 本仓库是 Markdown Reader 2.x 的持续维护分支。下方应用商店链接指向上游扩展；如需使用本仓库版本，请按「本地构建」步骤安装。

- **文档格式**: 支持预览 `file://`、`http://`、`https://` 协议以及 `.md`、`.mkd`、`.mdx`、`.markdown` 等扩展名的文件:
  - `https://example.com/example.md`（在线 Markdown 链接）
  - `file:///Users/my-project/readme.markdown`（本地 Markdown 文件，[\*需要开启特定权限](#允许本地文件访问权限)）
- **语法插件**: 支持表情符号、上标/下标、复选框、数学公式、流程图、甘特图、目录、插入内容、缩写、注释、提醒等。
- **Mermaid 图表**: 支持全屏查看、拖拽平移，以及通过滚轮、控制按钮或键盘缩放；全屏时按 ↑ / W / + 放大，按 ↓ / S / - 缩小。
- **主题**: 提供高质量的明暗主题和代码高亮功能。
- **实时刷新**: 支持实时文档变更和居中显示，提升阅读体验。
- **文档组织**: 包含侧边栏目录、原始内容预览和图像媒体预览。
- **快捷键**: 支持通过浏览器扩展快捷键快速调用功能。

![banner](./example/example-1.png)

默认的主题样式存储在 https://github.com/md-reader/theme 中。如果你想查看或自定义主题样式，可以访问该链接并根据需要调整 CSS 文件。

## 安装

### A. 在浏览器应用商店安装（需要机智上网）

应用商店中的版本属于上游项目，并非本仓库构建版本。要使用本分支，请按「本地构建」步骤加载。

<a href="https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg" target="_blank"><img src="./src/images/Chrome.png" style="width:50px"/></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/markdown-reader/djnplooklihmkcioemdjfcednfkpiodc" target="_blank"><img src="./src/images/Edge.png" style="width:50px"/></a>
<a href="https://addons.mozilla.org/firefox/addon/markdown-reader-ext/" target="_blank"><img src="./src/images/Firefox.png" style="width:50px"/></a>
<a href="https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg" target="_blank"><img src="./src/images/Arc.png" style="width:50px"/></a>

### B. 本地构建

以 Chrome 为例：

1. 克隆 `md-reader` 仓库到本地并编译:

   ```bash
   # 克隆本仓库
   git clone https://github.com/zwping/md-reader.git && cd md-reader

   # 安装依赖
   pnpm install

   # 构建扩展程序
   pnpm build
   ```

2. 构建成功后，`extension` 文件夹中是可直接加载的扩展程序，`dist` 文件夹中会生成 ZIP 安装包。

3. 本地加载时，打开 `chrome://extensions`，启用右上角的「开发者模式」，点击「加载已解压的扩展程序」，选择 `extension` 文件夹。

## 使用

以 Chrome 为例：

安装完成后，此时 Chrome 已经可以预览在线的 markdown 文档了，但是还不可以预览本地的 markdown 文档，需要开启 Chrome 扩展的文件访问权限。

### 允许本地文件访问权限

> 由于 Chrome 出于安全考虑，默认关闭了扩展程序对本地文件的访问权限，所以在安装完插件后需要手动开启权限，这样就可以正常预览本地 markdown 文件了。

在 Chrome 扩展程序管理页中，找到刚刚安装的 `Markdown Reader`，点击 `详细信息`，在详情页找到 `允许访问文件网址` 选项，然后切换为开启状态即可（请放心：`Markdown Reader` 只对 markdown 文件进行读取和展示的操作，不会修改和上传用户文件数据）。

### 打开 Markdown 文档

在 Chrome 中打开支持的 Markdown 网页链接或本地文件，也可以将 Markdown 文件拖入浏览器。本地文件需要先开启上面的「允许访问文件网址」权限，开启后刷新文档标签页。

### 设置扩展

点击 Chrome 工具栏中的 Markdown Reader 图标打开设置弹窗。设置会自动保存：

- **启用**：开启或关闭 Markdown 渲染。
- **内容居中**：切换文档内容是否居中显示。
- **自动刷新**：源文件变更时自动重新载入渲染结果。
- **插件**：选择要启用的 Markdown 语法功能。
- **主题**：选择浅色、深色或跟随系统。
- **语言**：切换扩展界面语言。

### 阅读文档

使用左侧目录跳转到对应标题。页面上的悬浮按钮可以显示或隐藏目录、切换渲染文档与原始 Markdown、返回页面顶部。

默认快捷键：**Alt+Shift+B**（切换目录）、**Alt+Shift+C**（切换居中）、**Alt+Shift+R**（切换自动刷新）、**Alt+Shift+T**（切换主题）。可在 `chrome://extensions/shortcuts` 查看或修改快捷键。

<br/>

现在所有工作都完成啦~！ヾ(◍°∇°◍)ﾉ

打开这个在线文档试一下效果吧：[示例文档](https://raw.githubusercontent.com/md-reader/md-reader/main/example/example.md)；你还可以试试直接将 Markdown 文档 **拖进浏览器**！

欢迎提出你的使用问题和建议。

点一颗星星（star）支持一下也是对我的鼓励哦~！

## Markdown Reader 官方微信公众号

扫码关注获取最新动态与技术支持：

<img src="./src/images/mp-qrcode.jpg" alt="" style="width:220px"/>

## 协议

License [MIT](https://github.com/md-reader/md-reader/blob/main/LICENSE)

© 2018-present, [Bener](https://github.com/Heroor)
