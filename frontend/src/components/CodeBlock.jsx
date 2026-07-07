import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LANG_MAP = {
  CPP: 'cpp',
  JS: 'javascript',
  PYTHON: 'python',
  JAVA: 'java',
};

export default function CodeBlock({ code, language }) {
  return (
    <SyntaxHighlighter
      language={LANG_MAP[language] || 'text'}
      style={oneDark}
      customStyle={{
        borderRadius: '8px',
        fontSize: '0.85rem',
        padding: '1.25rem',
      }}
      wrapLongLines
    >
      {code}
    </SyntaxHighlighter>
  );
}
