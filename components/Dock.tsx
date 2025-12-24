"use client";

import { Type, Image as ImageIcon, Minus, Heading, Settings } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

type DockProps = {
  onAddText: () => void;
  onAddSectionTitle: () => void;
  onAddImage: () => void;
  onAddDivider: () => void;
  onToggleWatermark: () => void;
  disabled?: boolean;
  watermarkEnabled?: boolean;
  isUploadingImage?: boolean;
};

export default function Dock({
  onAddText,
  onAddSectionTitle,
  onAddImage,
  onAddDivider,
  onToggleWatermark,
  disabled,
  watermarkEnabled,
  isUploadingImage,
}: DockProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[32px] shadow-soft px-3 py-6 flex flex-col gap-6 transition-all duration-300 hover:shadow-card z-50">
      <div className="w-12 h-12 bg-gradient-to-br from-kawaii-pink to-kawaii-purple rounded-2xl flex items-center justify-center shadow-lg shadow-kawaii-pink/30 mx-auto">
        <span className="text-white font-bold text-xl">Cv</span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-[10px] font-bold text-center text-kawaii-text/40 uppercase tracking-wider">
          Add
        </div>

        <Dropdown placement="right-start" offset={10}>
          <DropdownTrigger>
            <button
              type="button"
              disabled={disabled}
              className="group relative flex flex-col items-center justify-center w-14 h-14 mx-auto transition-all duration-200 active:scale-95 disabled:opacity-50 outline-none"
            >
              <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-md group-hover:scale-105">
                <span className="text-kawaii-blue">
                  <Type size={22} />
                </span>
              </div>
              <span className="pointer-events-none text-[9px] font-bold text-kawaii-text/70 mt-1 opacity-0 translate-y-1 scale-95 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                Text
              </span>
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Text Actions" className="p-2 bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl shadow-card w-[180px]">
            <DropdownItem
              key="text"
              startContent={<Type size={18} className="text-kawaii-blue" />}
              onPress={onAddText}
              className="rounded-lg data-[hover=true]:bg-kawaii-blue/10 data-[hover=true]:text-kawaii-blue"
            >
              普通文本
            </DropdownItem>
            <DropdownItem
              key="section_title"
              startContent={<Heading size={18} className="text-kawaii-purple" />}
              onPress={onAddSectionTitle}
              className="rounded-lg data-[hover=true]:bg-kawaii-purple/10 data-[hover=true]:text-kawaii-purple"
            >
              分节标题
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <DockButton
          icon={
            isUploadingImage ? (
              <span className="inline-flex h-5 w-5 items-center justify-center">
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-transparent"
                  style={{ borderColor: "var(--color-kawaii-mint)", borderTopColor: "transparent" }}
                />
              </span>
            ) : (
              <ImageIcon size={22} />
            )
          }
          label={isUploadingImage ? "Uploading" : "Image"}
          onClick={onAddImage}
          disabled={disabled || isUploadingImage}
          colorClass="text-kawaii-mint"
        />
        <DockButton
          icon={<Minus size={22} />}
          label="Line"
          onClick={onAddDivider}
          disabled={disabled}
          colorClass="text-kawaii-yellow"
        />
      </div>

      <div className="w-full h-px bg-kawaii-pinkLight" />

      <div className="flex flex-col gap-3">
        <div className="text-[10px] font-bold text-center text-kawaii-text/40 uppercase tracking-wider">
          Options
        </div>
        <DockButton
          icon={<Settings size={20} />}
          label="Watermark"
          onClick={onToggleWatermark}
          disabled={disabled}
          colorClass="text-kawaii-purple"
          isActive={Boolean(watermarkEnabled)}
        />
      </div>
    </div>
  );
}

function DockButton({
  icon,
  label,
  onClick,
  disabled,
  colorClass,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  colorClass: string;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={isActive}
      className="group relative flex flex-col items-center justify-center w-14 h-14 mx-auto transition-all duration-200 active:scale-95 disabled:opacity-50"
    >
      <div
        className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-md group-hover:scale-105 ${
          isActive ? "ring-2 ring-kawaii-purple/40" : ""
        }`}
      >
        <span className={colorClass}>{icon}</span>
      </div>
      <span className="pointer-events-none text-[9px] font-bold text-kawaii-text/70 mt-1 opacity-0 translate-y-1 scale-95 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
        {label}
      </span>
    </button>
  );
}
