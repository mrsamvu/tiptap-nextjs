import React, { useEffect, useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { ReactNodeViewProps } from '@tiptap/react'; // Import kiểu dữ liệu
import { Copy, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SHIKI_LANGUAGES, SHIKI_THEMES } from './config';
import './style.css';
import { highlighterPromise } from './plugin';
import { TokensResult } from 'shiki';



// Nhận vào một đối tượng props duy nhất với kiểu chính xác
export const CodeBlockShikiComponent = (props: ReactNodeViewProps) => {
  const { node, extension, editor, updateAttributes } = props;
  const [copied, setCopied] = useState(false);
  const { isEditable } = props.editor;
  const [shikiTokens, setShikiTokens] = useState<TokensResult>();

  // sử lý render view mode
  useEffect(() => {
    if (isEditable) return;

    (async () => {
      const highlighter = await highlighterPromise;
      // Lấy tokens
      const tokens = highlighter.codeToTokens(node.textContent, {
        lang: node.attrs.language,
        theme: node.attrs.theme,
      });
      setShikiTokens(tokens);
    })();
  }, [isEditable])

  const copyToClipboard = () => {
    // Lấy nội dung trực tiếp từ node, an toàn và chính xác hơn
    if (navigator.clipboard && node.textContent) {
      navigator.clipboard.writeText(node.textContent).then(() => {
        setCopied(true);
        // Reset trạng thái sau 2 giây
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      });
    }
  };

  return (
    <NodeViewWrapper className="code-block-wrapper relative">
      {/* Nút sao chép */}
      <div className="absolute top-2 right-2" contentEditable="false" suppressContentEditableWarning>
        <button
          onClick={copyToClipboard}
          className="rounded bg-[#262626] p-2 text-white transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>

      <div className='absolute top-2 left-2 flex gap-2' contentEditable="false" suppressContentEditableWarning>
        {
          isEditable &&
            <Select value={(SHIKI_LANGUAGES.includes(node.attrs.language)) ? node.attrs.language : 'javascript'} onValueChange={(value) => { 
              const pos = props.getPos?.();
              if (typeof pos === 'number') {
                editor
                  .chain()
                  .focus()
                  .setNodeSelection(pos) // focus vào node hiện tại
                  .updateAttributes(node.type.name, { language: value })
                  .run();
              }
            }}>
              <SelectTrigger className="w-fit !pl-2 !pr-1 !text-sm !h-[26px] bg-[#262626] text-white focus:ring-0 outline-none border-none">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {
                  SHIKI_LANGUAGES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)
                }
              </SelectContent>
            </Select>
        }
        {
          !isEditable && <div className='rounded bg-[#262626] px-2 py-1 text-white text-sm'>{node.attrs.language}</div>
        }

        {
          isEditable && 
            <Select value={node.attrs.theme} onValueChange={(value) => {
              const pos = props.getPos?.();
              if (typeof pos === 'number') {
                editor
                  .chain()
                  .focus()
                  .setNodeSelection(pos) // focus vào node hiện tại
                  .updateAttributes(node.type.name, { theme: value })
                  .run();
              }
            }}>
              <SelectTrigger className="w-fit !pl-2 !pr-1 !text-sm !h-[26px] text-white bg-[#262626] focus:ring-0 outline-none border-none">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {
                  SHIKI_THEMES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)
                }
              </SelectContent>
            </Select>
        }
      </div>

      {/* Phần hiển thị code */}
      <pre className={`code-block`} style={{ background: isEditable ? '' : shikiTokens?.bg }}>
        <div className='w-full overflow-x-auto pl-[1rem]'>
          <code data-language={node.attrs.language} data-theme={node.attrs.theme}>
            {/* sử lý render view mode */}
            { !isEditable && shikiTokens && 
                shikiTokens.tokens.map((line, i) => (
                  <div key={i} className="line">
                    {line.map((token, j) => (
                      <span key={j} style={{ color: token.color || "inherit" }}>
                        {token.content}
                      </span>
                    ))}
                  </div>
                ))
            }
            {/* edit mode */}
            { isEditable && <NodeViewContent /> }
          </code>
        </div>
      </pre>
    </NodeViewWrapper>
  );
};