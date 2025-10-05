import React, { useState } from 'react';

interface TableSizePickerProps {
    maxRows?: number;
    maxCols?: number;
    onSelect: (rows: number, cols: number) => void;
}

const TableSizePicker: React.FC<TableSizePickerProps> = ({
    maxRows = 10,
    maxCols = 10,
    onSelect,
}) => {
    const [hoverRow, setHoverRow] = useState(0);
    const [hoverCol, setHoverCol] = useState(0);

    return (
        <div className="inline-block">
            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${maxCols}, 20px)`,
                }}
            >
                {Array.from({ length: maxRows * maxCols }).map((_, index) => {
                    const row = Math.floor(index / maxCols) + 1;
                    const col = (index % maxCols) + 1;
                    const active = row <= hoverRow && col <= hoverCol;

                    return (
                        <div
                            key={index}
                            onMouseEnter={() => {
                                setHoverRow(row);
                                setHoverCol(col);
                            }}
                            onClick={() => onSelect(row, col)}
                            className={`w-5 h-5 border border-gray-300 cursor-pointer ${active ? 'bg-blue-500' : 'bg-white'
                                }`}
                        />
                    );
                })}
            </div>
            <div className="text-center mt-1 text-sm text-gray-600">
                {hoverRow} x {hoverCol}
            </div>
        </div>
    );
};

export default TableSizePicker;
