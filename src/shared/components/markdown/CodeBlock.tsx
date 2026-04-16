import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  dracula,
  atomDark,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CodeBlockStyle, CodeTheme } from '@/shared/lib/stores/settingsStore';
import { useSettingsStore } from '@/shared/lib/stores';

interface CodeBlockProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  style?: CodeBlockStyle;
}

const langColors: Record<string, string> = {
  javascript: '#f7df1e',
  js: '#f7df1e',
  typescript: '#3178c6',
  ts: '#3178c6',
  html: '#e34c26',
  css: '#264de4',
  python: '#3776ab',
  py: '#3776ab',
  rust: '#dea584',
  go: '#00add8',
  java: '#b07219',
  sql: '#e38c00',
  bash: '#4eaa25',
  shell: '#4eaa25',
  sh: '#4eaa25',
  json: '#40a070',
  markdown: '#083fa1',
  md: '#083fa1',
  yaml: '#cb171e',
  yml: '#cb171e',
  php: '#777bb4',
  ruby: '#cc342d',
  c: '#555555',
  cpp: '#f34b7d',
  csharp: '#178600',
  cs: '#178600',
  plaintext: '#888888',
  text: '#888888',
};

const languageMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
  md: 'markdown',
  yml: 'yaml',
  cs: 'csharp',
};

const codeThemeMap: Record<CodeTheme, typeof oneDark> = {
  github: atomDark,
  dracula: dracula,
  monokai: oneDark,
  nord: dracula,
};

export function CodeBlock({ children, language = '', showLineNumbers = false, style = 'default' }: CodeBlockProps) {
  const { codeTheme, showLineNumbers: globalShowLineNumbers } = useSettingsStore();
  const [copied, setCopied] = useState(false);

  const normalizedLang = languageMap[language.toLowerCase()] || language.toLowerCase();
  const langColor = langColors[normalizedLang] || langColors.plaintext;

  const syntaxTheme = codeThemeMap[codeTheme] || dracula;

  const code = children.endsWith('\n') ? children.slice(0, -1) : children;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const customStyle = {
    margin: 0,
    padding: '0.75rem 1rem',
    background: 'transparent',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  };

  const getContainerClass = () => {
    const base = 'code-block not-prose my-6 overflow-hidden rounded-lg';
    switch (style) {
      case 'minimal':
        return `${base} border border-border`;
      case 'bordered':
        return `${base} border-2 border-primary/30`;
      default:
        return `${base} border border-border`;
    }
  };

  const getHeaderClass = () => {
    const base = 'code-block-header';
    switch (style) {
      case 'minimal':
        return `${base} border-b border-border`;
      case 'bordered':
        return `${base} border-b-2 border-primary/50`;
      default:
        return `${base} border-b`;
    }
  };

  return (
    <div className={getContainerClass()}>
      <div className={getHeaderClass()}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: langColor }} />
          <span className="text-xs font-mono uppercase tracking-wide">{normalizedLang || 'code'}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`copy-button flex items-center gap-1 ${copied ? 'copied' : ''}`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Скопировано
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Копировать
            </>
          )}
        </button>
      </div>
      <div className="code-block-content">
        <SyntaxHighlighter
          language={normalizedLang || 'plaintext'}
          style={syntaxTheme}
          showLineNumbers={showLineNumbers || globalShowLineNumbers}
          customStyle={customStyle}
          wrapLines={true}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: '#888',
            opacity: 0.6,
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
