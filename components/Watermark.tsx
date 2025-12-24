"use client";
import React, { useMemo } from "react";

export function Watermark() {
  const dataUrl = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    const scale = 2;
    const w = 120 * scale;
    const h = 20 * scale;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    ctx.clearRect(0, 0, w, h);
    
    // 1. 先设置字体（必须先设置，否则测量的宽度不准）
    ctx.font = `${12 * scale}px Quicksand, sans-serif`;
    ctx.textBaseline = "alphabetic";
    
    // 2. 定义文字的起始 X 坐标
    const textX = 56 * scale;
    const textY = 15 * scale;
    const textContent = "拼好历";
    
    // 3. 测量文字宽度
    const textWidth = ctx.measureText(textContent).width;

    // 4. 【关键修改】创建渐变：范围仅限于文字的左边到右边
    // 原来是 (0, 0, w, 0) -> 导致渐变被拉伸
    // 现在是 (textX, 0, textX + textWidth, 0) -> 渐变完美覆盖文字
    const grad = ctx.createLinearGradient(textX, 0, textX + textWidth, 0);
    grad.addColorStop(0, "#fb7185");
    grad.addColorStop(0.5, "#a78bfa");
    grad.addColorStop(1, "#60a5fa");

    ctx.fillStyle = grad;
    ctx.fillText(textContent, textX, textY);

    // 绘制剩下的 "Created by"
    ctx.font = `${10 * scale}px Nunito, sans-serif`;
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Created by", 0, 15 * scale);

    return canvas.toDataURL("image/png");
  }, []);

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none select-none z-50 print:bottom-4">
      <svg
        className="block print:hidden"
        width="120"
        height="20"
        viewBox="0 0 120 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wm-gradient" x1="56" y1="0" x2="92" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="1" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="1" />
          </linearGradient>
        </defs>
        <text x="0" y="15" fontFamily="Nunito" fontSize="10" fontWeight="600" fill="#cbd5e1">Created by</text>
        <text x="56" y="15" fontFamily="Quicksand" fontSize="12" fontWeight="800" fill="url(#wm-gradient)" letterSpacing="1">拼好历</text>
      </svg>
      {dataUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hidden print:block"
            src={dataUrl}
            width={120}
            height={20}
            alt="watermark"
            style={{ imageRendering: "auto" }}
          />
        </>
      ) : null}
    </div>
  );
}
