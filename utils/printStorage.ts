import type { ResumeData } from "@/types/resume";
import localforage from "localforage";

type PrintPayload = {
  title: string;
  content: ResumeData;
};

const STORAGE_KEY = "pinresume:print-data";

// 初始化 localForage 实例
const printStorage = localforage.createInstance({
  name: "pinresume-print",
  storeName: "print-data",
});

/**
 * 保存打印数据到 localForage
 * @param payload 打印数据负载
 * @returns Promise<boolean> 保存成功返回 true，失败返回 false
 */
export async function savePrintData(payload: PrintPayload): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    await printStorage.setItem(STORAGE_KEY, payload);
    return true;
  } catch (err) {
    console.error("保存打印数据失败", err);
    return false;
  }
}

/**
 * 从 localForage 加载打印数据
 * @returns Promise<PrintPayload | null> 成功返回打印数据，失败或不存在返回 null
 */
export async function loadPrintData(): Promise<PrintPayload | null> {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const parsed = await printStorage.getItem<PrintPayload>(STORAGE_KEY);
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
    console.error("读取打印数据失败", err);
    return null;
  }
}

/**
 * 清理 localForage 中的打印数据
 * @returns Promise<void>
 */
export async function clearPrintData(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }
  try {
    await printStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("清理打印数据失败", err);
  }
}
