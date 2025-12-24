"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "@heroui/react";

type AlertPayload = {
  title?: string;
  message: string;
};

type AlertModalContextValue = {
  showAlert: (payload: AlertPayload) => void;
  closeAlert: () => void;
};

const AlertModalContext = createContext<AlertModalContextValue | null>(null);

export function AlertModalProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<AlertPayload | null>(null);

  const closeAlert = useCallback(() => {
    setPayload(null);
  }, []);

  const showAlert = useCallback((next: AlertPayload) => {
    setPayload((prev) => {
      if (prev?.message === next.message && prev?.title === next.title) {
        return prev;
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      showAlert,
      closeAlert,
    }),
    [showAlert, closeAlert],
  );

  return (
    <AlertModalContext.Provider value={value}>
      {children}
      {payload ? (
        <AlertModal
          title={payload.title}
          message={payload.message}
          onClose={closeAlert}
        />
      ) : null}
    </AlertModalContext.Provider>
  );
}

export function useAlertModal() {
  const ctx = useContext(AlertModalContext);
  if (!ctx) {
    throw new Error("useAlertModal must be used within AlertModalProvider");
  }
  return ctx;
}

function AlertModal({
  title,
  message,
  onClose,
}: {
  title?: string;
  message: string;
  onClose: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all animate-in fade-in duration-200 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] bg-white/90 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-card p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-800">
            {title ?? "提示"}
          </h2>
          <p className="text-sm text-kawaii-text/70 leading-relaxed">{message}</p>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            color="primary"
            onPress={onClose}
            className="rounded-2xl bg-zinc-900 text-white shadow-lg hover:bg-zinc-800 font-medium"
          >
            确定
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

