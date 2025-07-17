import { useState } from "react";

const Row = ({ row, level = 0, onUpdate }) => {
  const [value, setValue] = useState("");
  const handlePercentClick = () => {
    const percent = parseFloat(value);
    const newValue = parseFloat(((1 + percent / 100) * row.value).toFixed(4));
    const isParent = !!row.children;
    onUpdate(row.id, newValue, isParent);
  };
  const handleValClick = () => {
    const val = parseFloat(value);
    onUpdate(row.id, val, true);
  };
  const variance = (
    ((row.value - row.originalValue) / row.originalValue) *
    100
  ).toFixed(2);

  return (
    <>
      <tr>
        <td style={{ paddingLeft: `${level * 20 + 10}px` }}>{row.label}</td>
        <td>{row.value}</td>
        <td>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></input>
        </td>
        <td>
          <button onClick={handlePercentClick}>%</button>
        </td>
        <td>
          <button onClick={handleValClick}>val</button>
        </td>
        <td>{variance ? `${variance}%` : "0%"}</td>
      </tr>
      {row?.children?.map((child) => {
        return (
          <Row
            key={child.id}
            row={child}
            level={level + 1}
            onUpdate={onUpdate}
          />
        );
      })}
    </>
  );
};
export default Row;
