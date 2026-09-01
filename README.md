# Arrow Party EN — 部署说明（Deploy Notes）

本文件夹是游戏的**干净部署构建**，只含运行必需的静态文件：

`index.html` · `vercel.json` · 根级 `.js`/`.css` · `assets/` · `apistub/` · 图片

开发记录、需求文档、本地脚本都在源仓库 `arrowparty_en`，这里不带。

## 部署（git push）

本仓库默认**没有配置远程**，第一次部署时手动指定推去哪个项目即可：

```bash
cd E:\hzw\game\arrowparty_en_deploy
git remote add origin <arrowparty-en 项目的 git 地址>
git push -u origin master
```

`git remote add` 的 URL 决定推去哪，完全由你控制。源项目 `arrowparty_en` 的
GitHub 远程（`hzw2006101/arrowparty_en.git`）与本仓库是两个独立的 `.git`，
互不影响、不会互相推送。

## 压缩与性能

- 静态资源（含 7.7MB 的 `assets/gameScript/index.fc3c9.js`）由 **Vercel 边缘自动做
  brotli/gzip 压缩**，玩家浏览器实际收到的传输量约为原始的 1/4（~2MB）。
- 源文件在磁盘上始终是 7.7MB —— 压缩只生成独立的 `.br` 兄弟文件、不缩小源文件本身，
  本地直接打开看到 7.7MB 属正常，线上已压缩传输。
- 预压缩 `.br`/`.gz` 已写入 `.gitignore`，不需要提交。

## 备注

- `.git` 是本仓库的 git 元数据，**不会被部署到线上站点**（Vercel 只发布游戏文件），
  仅占本地磁盘。
- 游戏逻辑如需改动：改源仓库 `arrowparty_en` → 同步到本文件夹 → `git push`。
