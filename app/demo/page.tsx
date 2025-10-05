"use client";
import React, { useState } from "react";
import Circle from "@uiw/react-color-circle";
import { readableColor } from "polished";

export default function Demo() {
  const [hex, setHex] = useState("#F44E3B");

  return (
    <div className="w-full h-screen bg-white">
      <Circle
        colors={
        //   [
        //   // 1. Nhóm ĐỎ & HỒNG
        //   "#FF4136", "#FF4500",
        //   "#FF9A8E", "#FF9A80",
        //   "#FF0072", "#FF80B9",

        //   // 2. Nhóm TÍM & XANH CHÀM
        //   "#8A2BE2", "#C599F5",
        //   "#663399", "#B399CC",
        //   "#4169E1", "#A8BDF0",

        //   // 3. Nhóm XANH DƯƠNG & TEAL
        //   "#007BFF", "#80BDFF",
        //   "#00BFFF", "#80DFFF",
        //   "#00CED1", "#80E7E8",
        //   "#008080", "#80C0C0",

        //   // 4. Nhóm XANH LÁ
        //   "#3CB371", "#9EDBB8",
        //   "#7CFC00", "#BEFE80",
        //   "#ADFF2F", "#D6FF8F",

        //   // 5. Nhóm VÀNG & CAM
        //   "#FFFF00", "#FFFF80",
        //   "#FFD700", "#FFEB80",
        //   "#FF8C00", "#FFB366",

        //   // 6. Nhóm Trung Tính
        //   "#8B4513", "#C59E89",
        //   "#C0C0C0", "#FFFFFF"
        // ]

        [
  // Đỏ & Hồng
  '#FF9A8E', // Đỏ Nhạt (Light of #FF4136)
  '#FF9A80', // Cam Đỏ Nhạt (Light of #FF4500)
  '#FF80B9', // Hồng Nhạt (Light of #FF0072)
  
  // Tím & Xanh Chàm
  '#C599F5', // Tím Nhạt (Light of #8A2BE2)
  '#B399CC', // Tím Sâu Nhạt (Light of #663399)
  '#A8BDF0', // Xanh Chàm Nhạt (Light of #4169E1)
  
  // Xanh Dương & Teal
  '#80BDFF', // Xanh Dương Nhạt (Light of #007BFF)
  '#80DFFF', // Xanh Da Trời Nhạt (Light of #00BFFF)
  '#80E7E8', // Xanh Cyan Nhạt (Light of #00CED1)
  '#80C0C0', // Xanh Teal Nhạt (Light of #008080)
  
  // Xanh Lá
  '#9EDBB8', // Xanh Lá Trung Tính Nhạt (Light of #3CB371)
  '#BEFE80', // Xanh Lá Tươi Nhạt (Light of #7CFC00)
  '#D6FF8F', // Vàng Chanh Nhạt (Light of #ADFF2F)
  
  // Vàng & Cam
  '#FFFF80', // Vàng Nhạt (Light of #FFFF00)
  '#FFEB80', // Vàng Ánh Kim Nhạt (Light of #FFD700)
  '#FFB366', // Cam Đậm Nhạt (Light of #FF8C00)
  
  // Trung Tính
  '#C59E89', // Nâu Nhạt (Light of #8B4513)
  '#FFFFFF'  // Trắng (Light of #FFFFFF)
]
      }
        color={hex}
        style={{
          gap: 5,
          maxWidth: "300px",
          display: "flex",
          flexWrap: "wrap",
        }}
        rectProps={{
          style: {
            background: "#555555",
            borderRadius: 2,
            width: 18,
            height: 18,
          },
        }}
        pointProps={{
          style: {
            width: 26,
            height: 26,
            borderRadius: 5,
          },
        }}
        onChange={(color) => {
          setHex(color.hex);
        }}
      />
      <div
        style={{
          marginTop: 10,
          padding: "6px 10px",
          background: hex,
          color: readableColor(hex), // Tự động chọn trắng/đen tương phản
          borderRadius: 4,
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        {hex}
      </div>
    </div>
  );
}
