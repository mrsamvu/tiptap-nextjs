// // file: components/ColorPicker.js

// "use client";

// import { useState } from "react";
// import { TwitterPicker } from "react-color";

// // The default color palette for the TwitterPicker
// const defaultColors = [
//   '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', 
//   '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'
// ];

// export default function ColorPicker() {
//   const [color, setColor] = useState("#40DCA5");

//   return (
//     <div className="flex flex-col items-center gap-4 p-6">
//       <h2 className="text-xl font-semibold">Twitter Color Picker Demo</h2>
      
//       <div
//         className="w-24 h-24 rounded-lg shadow-md border"
//         style={{ backgroundColor: color }}
//       />

//       <TwitterPicker
//         color={color}
//         onChange={(c) => setColor(c.hex)}
//         triangle="hide"
//         colors={defaultColors}
//         width="276px"
//       />
      
//       <p className="text-sm text-gray-600">Selected: {color}</p>
//     </div>
//   );
// }