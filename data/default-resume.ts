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
      id: "name",
      type: "text",
      content: "<p><strong>你的名字</strong></p><p>求职意向 / 职位</p>",
      layout: { x: 0, y: 0, w: 24, h: 5 },
      style: {
        fontSize: "20pt",
        fontWeight: "700",
        lineHeight: 1.1,
      },
    },
    {
      id: "contact",
      type: "text",
      content: "<p>邮箱 · 电话 · 城市 · 个人网站</p>",
      layout: { x: 0, y: 5, w: 24, h: 3 },
      style: {
        fontSize: "10pt",
        color: "#4b5563",
        lineHeight: 1.4,
      },
    },
    {
      id: "edu-title",
      type: "section_title",
      content: "教育经历",
      layout: { x: 0, y: 9, w: 24, h: 3 },
      style: {
        fontSize: `${DEFAULT_LAYOUT_SETTINGS.font_size_pt + 2}pt`,
        backgroundColor: accent,
        color: "#ffffff",
        borderColor: accent,
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      },
    },
    {
      id: "edu",
      type: "text",
      content: "<p>学校 · 专业 · 学位</p><p>时间范围 · 亮点 / 成绩</p>",
      layout: { x: 0, y: 12, w: 24, h: 6 },
      style: {
        lineHeight: 1.4,
      },
    },
    {
      id: "work-title",
      type: "section_title",
      content: "工作经历",
      layout: { x: 0, y: 20, w: 24, h: 3 },
      style: {
        fontSize: `${DEFAULT_LAYOUT_SETTINGS.font_size_pt + 2}pt`,
        backgroundColor: accent,
        color: "#ffffff",
        borderColor: accent,
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      },
    },
    {
      id: "work",
      type: "text",
      content:
        "<p>公司 · 职位</p><p>时间范围 · 成就描述（STAR）</p><p>关键成果或量化指标</p>",
      layout: { x: 0, y: 23, w: 24, h: 10 },
      style: {
        lineHeight: 1.4,
      },
    },
    {
      id: "skill-title",
      type: "section_title",
      content: "技能清单",
      layout: { x: 0, y: 35, w: 24, h: 3 },
      style: {
        fontSize: `${DEFAULT_LAYOUT_SETTINGS.font_size_pt + 2}pt`,
        backgroundColor: accent,
        color: "#ffffff",
        borderColor: accent,
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      },
    },
    {
      id: "skill",
      type: "text",
      content: "<p>技能 1 · 技能 2 · 技能 3 · 技能 4</p>",
      layout: { x: 0, y: 38, w: 24, h: 4 },
      style: {
        lineHeight: 1.4,
      },
    },
  ],
};
