/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': {
      src: string;
      alt: string;
      ref?: React.RefObject<any>;
      'camera-controls'?: boolean;
      'auto-rotate'?: boolean;
      'camera-orbit'?: string;
      'min-camera-orbit'?: string;
      'max-camera-orbit'?: string;
      style?: React.CSSProperties;
      'shadow-intensity'?: string;
      'environment-image'?: string;
      exposure?: string;
      ar?: boolean;
      'ar-modes'?: string;
      'field-of-view'?: string;
      'min-field-of-view'?: string;
      'max-field-of-view'?: string;
      'interaction-prompt'?: string;
      loading?: string;
      reveal?: string;
      'camera-target'?: string;
      'interpolation-decay'?: string;
      'touch-action'?: string;
      class?: string;
      children?: React.ReactNode;
    };
  }
}
