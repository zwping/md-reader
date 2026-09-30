# Markdown Reader

<img alt="Markdown Reader Logo" src="https://raw.githubusercontent.com/md-reader/md-reader/main/src//images/logo-stroke.svg" align="right" width="120">

English | [中文](./README-cn.md) | [한국어](./README-ko.md)

https://md-reader.github.io

[![](https://badgen.net/chrome-web-store/v/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) [![](https://badgen.net/chrome-web-store/stars/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) [![](https://badgen.net/chrome-web-store/users/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg)

Markdown Reader is a powerful browser extension that enables you to conveniently preview Markdown documents in your browser.

> 本仓库是 Markdown Reader 2.x 的持续维护分支。下方应用商店链接指向上游扩展；如需使用本仓库版本，请按本地构建步骤安装。

## 本分支的主要升级

- Mermaid 升级至 **11.17.0**，支持 ER 图和 Mermaid 子图语法。
- Mermaid 图表适配阅读器的浅色、深色和自动主题。
- 增加图表缩放、鼠标滚轮缩放、拖动平移、重置和全屏；全屏时支持键盘缩放（↑ / W / + 放大，↓ / S / - 缩小），退出全屏后恢复普通视图。

- **Document Formats**: Preview links in `file://`, `http://`, `https://` and files with `.md`, `.mkd`, `.mdx`, `.markdown` extensions:
  - `https://example.com/example.md` (online Markdown URL)
  - `file:///Users/my-project/readme.markdown` (local Markdown file, \*[requires specific permissions](#allowing-file-access-permission))
- **Syntax Plugins**: Emoji, superscripts/subscripts, checkboxes, math, flowcharts, Gantt charts, TOC, insertions, abbreviations, annotations, alerts.
- **Themes**: High quality light/dark themes and code highlighting.
- **Hot Reloading**: Real-time document changes and centered display for better reading.
- **Document Organization**: Sidebar directory, original content preview, and image media support.
- **Shortcuts**: Quick function invocation with web extension shortcuts.

![banner](./example/example-1.png)

The default theme styles are stored in https://github.com/md-reader/theme. If you’d like to view or customize the theme styles, feel free to visit the link and adjust the CSS files as needed.

## Installation

### A. Install from web extension Store

应用商店中的版本属于上游项目，并非本仓库版本。要使用本分支，请按「B. 本地构建」步骤安装。

<a href="https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg" target="_blank"><img src="./src/images/Chrome.png" style="width:50px"/></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/markdown-reader/djnplooklihmkcioemdjfcednfkpiodc" target="_blank"><img src="./src/images/Edge.png" style="width:50px"/></a>
<a href="https://addons.mozilla.org/firefox/addon/markdown-reader-ext/" target="_blank"><img src="./src/images/Firefox.png" style="width:50px"/></a>
<a href="https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg" target="_blank"><img src="./src/images/Arc.png" style="width:50px"/></a>

### B. 本地构建

以 Chrome 为例：

1. 克隆本仓库并构建扩展：

   ```bash
   # 克隆本仓库
   git clone https://github.com/zwping/md-reader.git && cd md-reader

   # 安装依赖
   pnpm install

   # 构建扩展
   pnpm build
   ```

2. 构建完成后，`extension` 文件夹中是可直接加载的扩展程序，`dist` 文件夹中会生成 ZIP 安装包。

3. 本地加载时，打开 `chrome://extensions`，启用右上角的「开发者模式」，点击「加载已解压的扩展程序」，选择 `extension` 文件夹。

## 在 Chrome 中继续使用本分支

- **首次使用**：运行 `pnpm install` 安装依赖，再运行 `pnpm build` 构建，并按上方步骤加载生成的 `extension` 文件夹。
- **更新代码后**：重新运行 `pnpm build`，打开 `chrome://extensions`，点击本扩展的重新加载按钮，再刷新 Markdown 文档标签页。
- **使用本地 Markdown 文件**：进入扩展的「详情」页面，开启「允许访问文件网址」。开启后刷新本地文档标签页。

## Usage

Example of Chrome:

After installation, Chrome is now able to preview online markdown documents. However, it is not able to preview local markdown documents by default and requires enabling file access permission for the Chrome extension.

### Allowing File Access Permission

> Due to security reasons, Chrome by default disables extension access to local files. Therefore, after installing the plugin, you need to manually enable the permission in order to preview local markdown files.

In the Chrome Extensions management page, locate the installed "Markdown Reader" extension, click on "Details", and find the option "Allow access to file URLs" in the details page. Switch it to the enabled state (Please rest assured that "Markdown Reader" only performs read and display operations on markdown files and will not modify or upload user file data).

### 打开 Markdown 文档

在 Chrome 中打开支持的 Markdown 网页链接或本地文件，也可以将 Markdown 文件拖入浏览器。本地文件需要先开启「允许访问文件网址」权限，开启后刷新文档标签页。

### 设置扩展

点击 Chrome 工具栏中的 Markdown Reader 图标打开设置弹窗。设置会自动保存：

- **启用**：开启或关闭 Markdown 渲染。
- **内容居中**：切换文档内容是否居中显示。
- **自动刷新**：源文件变更时自动重新载入渲染结果。
- **插件**：选择要启用的 Markdown 语法功能。
- **主题**：选择浅色、深色或自动主题。
- **语言**：切换扩展界面语言。

### 阅读文档

使用左侧目录跳转到对应标题。页面上的悬浮按钮可以显示或隐藏目录、切换渲染文档与原始 Markdown、返回页面顶部。

默认快捷键：**Alt+Shift+B**（切换目录）、**Alt+Shift+C**（切换居中）、**Alt+Shift+R**（切换自动刷新）、**Alt+Shift+T**（切换主题）。可在 `chrome://extensions/shortcuts` 查看或修改快捷键。

<br/>

Now all the work is done~!ヾ(◍°∇°◍)ﾉ

Try the effect by opening this online document: [Example Document](https://raw.githubusercontent.com/md-reader/md-reader/main/example/example.md); You can also try dragging a Markdown document directly into the browser!

Feel free to ask any questions or provide suggestions.

Giving a star to show your support is also an encouragement for me~!

## Join the WeChat Community

Scan the code to get the latest news and technical support:

<img src="./src/images/mp-qrcode.jpg" alt="" style="width:220px"/>

## License

License [MIT](https://github.com/md-reader/md-reader/blob/main/LICENSE)

© 2018-present, [Bener](https://github.com/Heroor)
