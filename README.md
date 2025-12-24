PinResume
=========

中文
----
PinResume 是一个纯前端的简历编辑与打印工具，基于 Next.js 静态导出。无需后端，打开即用。

功能
- 可视化拖拽编辑（文本/分节标题/分割线/图片）
- 一键打印（浏览器打印 → 另存为 PDF）
- 导入/导出 JSON（本地保存与迁移）
- 单页 A4 布局，水印安全区

使用与调试
1) 安装依赖
```
npm install
```

2) 本地调试
```
npm run dev
```

工作流
1) 编辑简历 → “下载 JSON”可本地保存
2) “导入 JSON”可恢复内容
3) “打印 PDF”会打开 `/print/` 并自动触发打印

限制说明
- 纯前端：刷新页面后内容会丢失（请及时下载 JSON）
- 图片以 Base64 存在内存中，过大可能导致保存/打印失败
- 仅支持单页 A4，超出区域会被裁剪
- 打印颜色以浏览器为准（已尽量保持颜色一致）

部署（静态导出）
1) 构建导出静态资源
```
npm run build
```

2) 产物在 `out/`，可部署到任意静态托管
```
npx serve out
```

English
-------
PinResume is a pure front-end resume editor and print tool. It uses Next.js static export and requires no backend.

Features
- Drag-and-drop editing (text/section title/divider/image)
- One-click print (browser print → save as PDF)
- JSON import/export (local save & restore)
- Single-page A4 layout with watermark safe area

Development
1) Install dependencies
```
npm install
```

2) Run dev server
```
npm run dev
```

Workflow
1) Edit → “Download JSON” to save locally
2) “Import JSON” to restore
3) “Print PDF” opens `/print/` and triggers print

Limitations
- Front-end only: refresh will clear data (save JSON regularly)
- Images are stored as Base64 in memory; very large images may fail to save/print
- Single-page A4 only; overflow will be clipped
- Print colors depend on browser settings (color adjustment is applied)

Deployment (Static Export)
1) Build & export
```
npm run build
```

2) Deploy `out/` to any static host
```
npx serve out
```
