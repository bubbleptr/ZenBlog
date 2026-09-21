# 博客首图：莫兰迪静物

> 2026-09 确立。第一张落地：`gpt-image-2-5-prompting-guide`。用 Midjourney 生成。

站点的视觉中心是书桌：暖宣纸底、低饱和矿物色、东西少、光软。首图跟这张桌子走，不跟每篇文章的题材走科技插画或海报。

选定风格是 **乔治·莫兰迪静物**（Giorgio Morandi，20 世纪意大利博洛尼亚）。他反复画同一张桌子、同一面灰白墙、同一束北窗光，只换桌上的器物。整站首图共用这一套光和桌面，每篇文章只换器物，看起来就是同一批。

## 固定的部分

每篇提示词末尾接同一段，不要改光、墙、桌子和参数：

```text
Warm off-white plaster wall, soft north light, short shadows, chalky low-chroma paint, spare and quiet --ar 2:1 --stylize 80 --no text, letters, numbers, logo, watermark, neon, screen, gloss
```

- `--ar 2:1` 对齐文章页桌面首图（`sm:aspect-[2/1]`）。手机是 `16/10`，左右各裁掉约一成，器物放在画面中段，两边留墙和桌面。
- `--stylize` 放在 50 到 80。再高会发油，不像粉笔质的静物。
- 画面里不出现可读文字。标题在图外。
- 不写 `masterpiece`、`8k`、`epic lighting` 这类空话。风格靠画家名字、材质和光，不靠堆词。
- 一图只用一种封面色做器物上的一点颜色（赭石、藤黄、靛、黛、朱砂里选一个）。其余保持粉笔白和灰。青竹不进首图，它只做导向色。
- 不画屏幕、霓虹、logo、神经网络、发光 UI。

## 每篇只换的部分

一句英文，写桌上有什么。器物要少：一两件主物，加一张空白纸或一支铅笔这类安静的配角。主物之间要有可辨认的差别（高低、肩上的一点颜色），差别本身承担文章的意思。

提示词结构：

```text
A Giorgio Morandi still life on a pale wooden desk: <这一篇的器物>. <固定尾句>
```

## 已采用的一张

《GPT Image 2.5 提示词指南》用两只瓶子对照 Flare（小、快）和 Sunburst（画质）：小瓶粉笔白，高瓶肩上一点干赭石，旁边一张空白纸和一支铅笔。

```text
A Giorgio Morandi still life on a pale wooden desk: two matte ceramic bottles standing close, one small and chalk-white, one a little taller with a dusty ochre shoulder; beside them a blank sheet of warm paper and a single graphite pencil. Warm off-white plaster wall, soft north light, short shadows, chalky low-chroma paint, spare and quiet --ar 2:1 --stylize 80 --no text, letters, numbers, logo, watermark, neon, screen, gloss
```

四宫格里取左下（U3）。两只瓶子几乎一样高的那张不用。瓶子贴到右缘的那张不用，手机裁切会切到瓶身。桌沿那条深色是近处桌边，留下。

文件放在 `src/content/blog/images/<slug>-hero.jpg`。中英文文章的 `heroImage` 指向同一张。`astro.config.mjs` 忽略了 `src/content` 的变更，换图后要重启 dev server 才会看到新图。
