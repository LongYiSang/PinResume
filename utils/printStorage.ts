import type { ResumeData } from "@/types/resume";

type PrintPayload = {
  title: string;
  content: ResumeData;
};

const STORAGE_KEY = "pinresume:print-data";

export function savePrintData(payload: PrintPayload): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn("保存打印数据失败", err);
    return false;
  }
}

export function loadPrintData(): PrintPayload | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as PrintPayload;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    if (!parsed.content) {
      return null;
    }
    return {
      title: typeof parsed.title === "string" ? parsed.title : "",
      content: parsed.content,
    };
  } catch (err) {
    console.warn("读取打印数据失败", err);
    return null;
  }
}

export function clearPrintData() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("清理打印数据失败", err);
  }
}
