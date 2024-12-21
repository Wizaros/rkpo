import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './DndPage.css';

const ItemType = 'CARD';

function DraggableCard({ item, index, moveCard, columnId, removeCard }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={drag}
      className="dnd-item"
      style={{ opacity }}
    >
      {item.content}
      <button onClick={() => removeCard(columnId, index)}>Удалить</button>
    </div>
  );
}

function DroppableColumn({ column, columnId, moveCard, removeCard }) {
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.columnId !== columnId) {
        moveCard(item.columnId, columnId, item.index, column.items.length);
        item.columnId = columnId;
      }
    },
  });

  return (
    <div ref={drop} className="dnd-column">
      <h2>{column.name}</h2>
      {column.items.map((item, itemIndex) => (
        <DraggableCard
          key={item.id}
          item={item}
          index={itemIndex}
          moveCard={moveCard}
          columnId={columnId}
          removeCard={removeCard}
        />
      ))}
    </div>
  );
}

function DndPage() {
  const [columns, setColumns] = useState({
    todo: {
      name: 'To Do',
      items: [
        { id: '1', content: 'Купить продукты' },
        { id: '2', content: 'Прочитать книгу' },
      ]
    },
    inProgress: {
      name: 'In Progress',
      items: [],
    },
    done: {
      name: 'Done',
      items: [],
    },
    blocked: {
      name: 'Blocked',
      items: [],
    },
  });

  const moveCard = (fromColumnId, toColumnId, dragIndex, dropIndex) => {
    const newColumns = { ...columns };
    const fromColumn = newColumns[fromColumnId];
    const toColumn = newColumns[toColumnId];

    const [movedItem] = fromColumn.items.splice(dragIndex, 1);
    toColumn.items.splice(dropIndex, 0, movedItem);

    setColumns(newColumns);
  };

  const removeCard = (columnId, cardIndex) => {
    const newColumns = { ...columns };
    newColumns[columnId].items.splice(cardIndex, 1);
    setColumns(newColumns);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dnd-container">
        {Object.entries(columns).map(([columnId, column]) => (
          <DroppableColumn
            key={columnId}
            column={column}
            columnId={columnId}
            moveCard={moveCard}
            removeCard={removeCard}
          />
        ))}
      </div>
    </DndProvider>
  );
}

export default DndPage;