# lingzi-project

## 机房监控系统 · 小机房

根据 Figma 源设计制作的 HTML 监控页面，包含独立素材、可编辑源码和离线单文件版本。

- [下载完整 HTML 源码 ZIP](https://github.com/lingzixiaojiejie/lingzi-project/raw/refs/heads/main/output/small-room-source.zip)
- [查看 output 文件夹](output/)
- [使用说明](output/使用说明.md)

下载 ZIP 并解压后，双击 `机房监控系统-小机房.html` 即可离线打开；也可用编辑器修改 `index.html`、`styles.css`、`app.js`。

页面宽高随浏览器自适应，导航保持固定尺寸；桌面两侧面板各宽 400px，均分可见高度，内容溢出时独立滚动。实时告警使用可拖动的原生滚动条。包含设备详情、告警确认、导航收起、全屏等基础交互；当前为示例数据，尚未连接后台。

修改源码后，运行 `python scripts/build.py` 可重新生成单文件 HTML 和 ZIP。
