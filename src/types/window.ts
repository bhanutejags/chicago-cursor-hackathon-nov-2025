export type WindowType =
  | "terminal"
  | "file-explorer"
  | "text-editor"
  | "settings";

export type WindowState = "normal" | "minimized" | "maximized";

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface Window {
  id: string;
  type: WindowType;
  title: string;
  icon: string;
  position: WindowPosition;
  size: WindowSize;
  state: WindowState;
  zIndex: number;
  minimumSize: WindowSize;
  maximumSize?: WindowSize;
  resizable: boolean;
  draggable: boolean;
  data?: Record<string, unknown>;
}

export interface WindowConfig {
  type: WindowType;
  title?: string;
  icon?: string;
  position?: WindowPosition;
  size?: WindowSize;
  data?: Record<string, unknown>;
}
