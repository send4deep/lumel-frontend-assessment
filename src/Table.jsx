import { useState } from "react";
import DummyData from "./utils/DummyData.json";
import Row from "./Row";

const calculateParentValues = (rows) => {
  return rows.map((row) => {
    if (row.children) {
      const updatedChildren = calculateParentValues(row.children);
      const sum = updatedChildren.reduce(
        (acc, curr) => acc + parseFloat(curr.value),
        0
      );
      return {
        ...row,
        children: updatedChildren,
        value: parseFloat(sum.toFixed(4)),
      };
    }
    return row;
  });
};

const updateChildrenFromParent = (row, newValue) => {
  const oldTotal = row.children.reduce((sum, child) => sum + child.value, 0);
  return row.children.map((child) => {
    const proportion = child.value / oldTotal;
    const newChildValue = parseFloat((proportion * newValue).toFixed(4));
    return {
      ...child,
      value: newChildValue,
    };
  });
};

const Table = () => {
  const [data, setData] = useState(DummyData);
  const handleUpdate = (id, newValue, isAbs = false) => {
    const updateRows = (rows) => {
      return rows.map((row) => {
        if (row.id === id) {
          if (row.children && isAbs) {
            const updatedChildren = updateChildrenFromParent(row, newValue);
            return {
              ...row,
              value: newValue,
              children: updatedChildren,
            };
          }
          return { ...row, value: newValue };
        } else if (row.children) {
          return { ...row, children: updateRows(row.children) };
        }
        return row;
      });
    };
    const updatedData = calculateParentValues(updateRows(data));
    setData(updatedData);
  };
  return (
    <table>
      <thead>
        <tr>
          <th>Label</th>
          <th className="val">Value</th>
          <th>Input</th>
          <th>Allocation %</th>
          <th>Allocation Val</th>
          <th>Variance %</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((item) => {
          return <Row key={item.id} row={item} onUpdate={handleUpdate} />;
        })}
      </tbody>
    </table>
  );
};

export default Table;
