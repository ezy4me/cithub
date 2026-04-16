declare module 'react-syntax-highlighter' {
  import { ComponentType, ReactNode } from 'react';
  
  interface SyntaxHighlighterProps {
    children: string;
    language: string;
    style?: Record<string, any>;
    customStyle?: React.CSSProperties;
    showLineNumbers?: boolean;
    lineNumberStyle?: React.CSSProperties;
    wrapLines?: boolean;
    wrapLongLines?: boolean;
    [key: string]: any;
  }

  export const Prism: ComponentType<SyntaxHighlighterProps>;
  export const Light: ComponentType<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const oneDark: Record<string, any>;
  export const oneLight: Record<string, any>;
  export const dracula: Record<string, any>;
  export const vs: Record<string, any>;
  export const vsDark: Record<string, any>;
  export const atomDark: Record<string, any>;
}
