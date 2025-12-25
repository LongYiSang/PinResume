import type { ResumeData } from "@/types/resume";
import { DEFAULT_LAYOUT_SETTINGS } from "@/utils/resume";

const accent = DEFAULT_LAYOUT_SETTINGS.accent_color;

export const DEFAULT_RESUME_TITLE = "我的简历";

export const DEFAULT_RESUME_DATA: ResumeData = {
  layout_settings: {
    ...DEFAULT_LAYOUT_SETTINGS,
    enable_watermark: false,
  },
  items: [
      {
        "id": "name",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "20pt",
          "fontFamily": "var(--font-open-sans), \"Open Sans\", \"Helvetica Neue\", \"Noto Sans CJK SC\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 0,
          "w": 6,
          "h": 3
        },
        "content": "<p dir=\"ltr\"><b><strong>你的名字</strong></b></p>"
      },
      {
        "id": "phone",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "11pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1.2
        },
        "layout": {
          "x": 0,
          "y": 3,
          "w": 6,
          "h": 2
        },
        "content": "<p dir=\"ltr\"><span>电话:135****4231</span></p>"
      },
      {
        "id": "mail",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "11pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 5,
          "w": 8,
          "h": 1
        },
        "content": "<p dir=\"ltr\"><span>邮箱:alice@example.com</span></p>"
      },
      {
        "id": "edu",
        "type": "section_title",
        "style": {
          "color": "#3388ff",
          "fontSize": "14pt",
          "fontFamily": "var(--font-open-sans), \"Open Sans\", \"Helvetica Neue\", \"Noto Sans CJK SC\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif",
          "borderColor": "#3388ff",
          "backgroundColor": "transparent",
          "borderTopLeftRadius": 0,
          "borderTopRightRadius": 0,
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 76,
          "w": 24,
          "h": 1
        },
        "content": "<p dir=\"ltr\"><span>教育经历</span></p>"
      },
      {
        "id": "0ca93e41-b2c0-4c03-ab4c-a3ae5877c98d",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "14pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 78,
          "w": 6,
          "h": 3
        },
        "content": "<p dir=\"ltr\"><b><strong>XX大学</strong></b></p>"
      },
      {
        "id": "ffb5171e-bb68-49e4-b715-459f50d58e5c",
        "type": "text",
        "style": {
          "color": "#8c8c8c",
          "fontSize": "12pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 6,
          "y": 78,
          "w": 5,
          "h": 3
        },
        "content": "<p dir=\"ltr\"><span>XX专业 本科</span></p>"
      },
      {
        "id": "34954862-3b8b-4a29-8a8b-7c9f9bceaa73",
        "type": "text",
        "style": {
          "color": "#8c8c8c",
          "fontSize": "12pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 18,
          "y": 78,
          "w": 6,
          "h": 3
        },
        "content": "<p><span>2021-07 ~ 2025-08</span></p>"
      },
      {
        "id": "5ab76c33-d58f-4396-b73f-4679d0eef89f",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "10pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 81,
          "w": 17,
          "h": 3
        },
        "content": "<p dir=\"ltr\"><span>主修课程：计算机网络、操作系统、数据结构与算法...</span></p>"
      },
      {
        "id": "236e5d7d-6340-49ba-8668-bf81246bf324",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "10pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 17,
          "y": 81,
          "w": 7,
          "h": 3
        },
        "content": "<p dir=\"ltr\" style=\"text-align: right\"><span>GPA * /4(专业前*%)</span></p>"
      },
      {
        "id": "3de6e383-86b2-4af9-8a76-ae09417969b2",
        "type": "section_title",
        "style": {
          "color": "#3388ff",
          "fontSize": "14pt",
          "fontFamily": "var(--font-open-sans), \"Open Sans\", \"Helvetica Neue\", \"Noto Sans CJK SC\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif",
          "lineHeight": 1,
          "borderColor": "#3388ff",
          "backgroundColor": "transparent"
        },
        "layout": {
          "x": 0,
          "y": 85,
          "w": 24,
          "h": 1
        },
        "content": "<p dir=\"ltr\"><span>专业技能</span></p>"
      },
      {
        "id": "0f98d4a8-726c-4e12-bd3e-cc641707d460",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "11pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 87,
          "w": 24,
          "h": 5
        },
        "content": "<ul><li><span>熟悉...</span></li><li><span>掌握...</span></li></ul>"
      },
      {
        "id": "d65efc48-b31b-4a88-b734-4decc13be2d6",
        "type": "section_title",
        "style": {
          "color": "#3388ff",
          "fontSize": "14pt",
          "fontFamily": "var(--font-open-sans), \"Open Sans\", \"Helvetica Neue\", \"Noto Sans CJK SC\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif",
          "borderColor": "#3388ff",
          "backgroundColor": "transparent",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 12,
          "w": 24,
          "h": 1
        },
        "content": "<p dir=\"ltr\"><span>这是分节标题</span></p>"
      },
      {
        "id": "046d6cd2-0fd0-4b75-9684-b3e92a0d7b41",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "14pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif"
        },
        "layout": {
          "x": 0,
          "y": 15,
          "w": 7,
          "h": 4
        },
        "content": "<p dir=\"ltr\"><b><strong>拼好历-这是文本框</strong></b></p>"
      },
      {
        "id": "f2acbb51-7c03-41ef-941b-cd45d93dba17",
        "type": "text",
        "style": {
          "color": "#8c8c8c",
          "fontSize": "12pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 18,
          "y": 16,
          "w": 6,
          "h": 3
        },
        "content": "<p style=\"text-align: right\"><span>2025.* ~ 2025.*</span></p>"
      },
      {
        "id": "ecb2bf6a-e672-4457-b971-755bad7ac6c7",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "11pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 19,
          "w": 24,
          "h": 4
        },
        "content": "<p dir=\"ltr\"><b><strong>技术栈</strong></b><span>：Next.js</span></p>"
      },
      {
        "id": "dc890a5c-0b19-42e0-b7e2-a91e999ed6e2",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "11pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 23,
          "w": 24,
          "h": 2
        },
        "content": "<p dir=\"ltr\"><b><strong>项目描述</strong></b><span>：一个基于Go语言的“所见即所得”的简历制作平台</span></p>"
      },
      {
        "id": "1238d942-d2e3-4b67-a232-4918ad88adf5",
        "type": "text",
        "style": {
          "color": "#1800cc",
          "fontSize": "11pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 26,
          "w": 5,
          "h": 3
        },
        "content": "<p dir=\"ltr\"><b><strong>文本框使用说明:</strong></b></p>"
      },
      {
        "id": "639c8854-21f5-4698-8c53-77c5d8a5d15c",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "11pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 29,
          "w": 24,
          "h": 21
        },
        "content": "<ul><li><span>使用右侧工具栏中的List工具(往下拉)可以实现无序列表</span></li><li><span>选中一行后可以单独编辑该栏的列表形式</span></li></ul><ol><li><span>也可以使用有序列表</span></li><li style=\"text-align: center\"><span>编辑框重叠</span><b><strong>不影响</strong></b><span>实际打印效果</span></li><li style=\"text-align: right\"><span>每行可以单独设置行内对齐方式</span></li><li><span>字体/颜色单个文本框内一致</span></li><li><span>图片将被转为Base64格式存入JSON（</span><b><strong>很大，注意不要使用过大图片</strong></b><span>）</span></li><li><span>背景色在不同浏览器可能会存在不同的渲染问题，不建议使用</span></li><li><span>支持部分</span><b><strong>Markdown</strong></b><span>格式</span></li></ol>"
      },
      {
        "id": "431b2df9-f751-425c-a767-5e5a1ec72a54",
        "type": "divider",
        "style": {
          "margin": "8px 0",
          "borderTop": "2px solid #8c8c8c"
        },
        "layout": {
          "x": 0,
          "y": 51,
          "w": 24,
          "h": 1
        },
        "content": ""
      },
      {
        "id": "7cc68f21-ba00-47c0-afe5-7739a54ec4eb",
        "type": "section_title",
        "style": {
          "color": "#3388ff",
          "fontSize": "14pt",
          "fontFamily": "var(--font-open-sans), \"Open Sans\", \"Helvetica Neue\", \"Noto Sans CJK SC\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif",
          "lineHeight": 1.2,
          "borderColor": "#3388ff",
          "backgroundColor": "transparent",
          "borderTopLeftRadius": 0,
          "borderTopRightRadius": 0
        },
        "layout": {
          "x": 0,
          "y": 95,
          "w": 24,
          "h": 1
        },
        "content": "<p dir=\"ltr\"><span style=\"white-space: pre-wrap;\">荣誉奖项</span></p>"
      },
      {
        "id": "5eb5994d-16c7-44bb-9c49-2fba31f071a0",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "11pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 96,
          "w": 14,
          "h": 8
        },
        "content": "<p dir=\"ltr\"><span>英语六级</span></p><p><span>....</span></p>"
      },
      {
        "id": "35e87b81-f66d-443f-904e-c1e59dc0d662",
        "type": "text",
        "style": {
          "color": "#000000",
          "fontSize": "11pt",
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif",
          "lineHeight": 1
        },
        "layout": {
          "x": 0,
          "y": 7,
          "w": 10,
          "h": 1
        },
        "content": "<p dir=\"ltr\"><span>github:github.com/LongYiSang</span></p>"
      },
      {
        "id": "7a8fd2b2-6c18-4c79-81a4-fec142349a94",
        "type": "text",
        "content": "<p dir=\"ltr\"><b><strong>图片框使用说明：</strong></b></p>",
        "layout": {
          "x": 0,
          "y": 53,
          "w": 5,
          "h": 3
        },
        "style": {
          "fontSize": "11pt",
          "color": "#1800cc",
          "lineHeight": 1,
          "fontFamily": "var(--font-nunito), \"Nunito\", \"Open Sans\", \"Noto Sans CJK SC\", \"WenQuanYi Zen Hei\", sans-serif"
        }
      },
      {
        "id": "1dda9bf7-f550-4c70-8f1e-f547267b0230",
        "type": "text",
        "content": "<p dir=\"ltr\"><span>图片上传后会被放置在有空余的位置</span></p>",
        "layout": {
          "x": 0,
          "y": 56,
          "w": 9,
          "h": 3
        },
        "style": {
          "fontSize": "11pt",
          "color": "#000000"
        }
      },
      {
        "id": "ae01ed22-8893-465d-ad38-88e1b928ee0a",
        "type": "text",
        "content": "<p dir=\"ltr\"><span>点击右侧</span><b><strong>New</strong></b></p><p dir=\"ltr\"><span>从空白纸张开始</span></p>",
        "layout": {
          "x": 13,
          "y": 1,
          "w": 10,
          "h": 8
        },
        "style": {
          "fontSize": "18pt",
          "color": "#fe010e",
          "fontFamily": "var(--font-noto-sans-sc), \"Noto Sans CJK SC\", \"Noto Sans\", \"WenQuanYi Zen Hei\", \"Microsoft YaHei\", sans-serif"
        }
      },
      {
        "id": "b99f5e76-121c-472a-b129-91589e90ba60",
        "type": "divider",
        "content": "",
        "layout": {
          "x": 0,
          "y": 59,
          "w": 24,
          "h": 1
        },
        "style": {
          "borderTop": "2px solid #3388ff",
          "margin": "8px 0"
        }
      },
      {
        "id": "0fbb77e2-ae29-468f-8834-c4eb47cf01fc",
        "type": "text",
        "content": "<p dir=\"ltr\"><span>底部水印可以在左侧工具栏中取消显示</span></p>",
        "layout": {
          "x": 0,
          "y": 61,
          "w": 10,
          "h": 4
        },
        "style": {
          "fontSize": "11pt",
          "color": "#76863c",
          "fontFamily": "var(--font-open-sans), \"Open Sans\", \"Helvetica Neue\", \"Noto Sans CJK SC\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
        }
      }
    ],
};
