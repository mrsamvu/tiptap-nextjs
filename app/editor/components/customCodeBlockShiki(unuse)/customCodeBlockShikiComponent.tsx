// import React, { useState } from 'react';
// import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
// import type { ReactNodeViewProps } from '@tiptap/react'; // Import kiểu dữ liệu
// import { Copy, Check } from 'lucide-react';

// // Nhận vào một đối tượng props duy nhất với kiểu chính xác
// export const CustomCodeBlock = (props: ReactNodeViewProps) => {
//   const { node, extension, editor, updateAttributes } = props;
  
//   // editor.commands.updateAttributes(node.type.name, { language: 'text' })

//   const [copied, setCopied] = useState(false);
//   // console.log("node.content: ", node.attrs);


//   const copyToClipboard = () => {
//     // Lấy nội dung trực tiếp từ node, an toàn và chính xác hơn
//     if (navigator.clipboard && node.textContent) {
//       navigator.clipboard.writeText(node.textContent).then(() => {
//         setCopied(true);
//         // Reset trạng thái sau 2 giây
//         setTimeout(() => {
//           setCopied(false);
//         }, 2000);
//       });
//     }
//   };

//   return (
//     <NodeViewWrapper className="code-block-wrapper relative">
//       {/* Nút sao chép */}
//       {/* <div className="absolute top-2 left-2">
//         <button
//           onClick={() => editor.commands.updateAttributes(node.type.name, { language: 'python' })}
//           className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
//           aria-label="Copy code"
//         >
//           {copied ? <Check size={18} /> : <Copy size={18} />}
//         </button>
//       </div> */}
//       <div className="absolute top-2 right-2">
//         <button
//           onClick={copyToClipboard}
//           className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
//           aria-label="Copy code"
//         >
//           {copied ? <Check size={18} /> : <Copy size={18} />}
//         </button>
//       </div>

//       {/* Phần hiển thị code */}
//       <pre className="code-block">
//         <NodeViewContent as="code" />
//       </pre>
//     </NodeViewWrapper>
//   );
// };