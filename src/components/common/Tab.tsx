import React from 'react';

export default function Tab(props: any) {
  const { name, active, onClick: click } = props;
  return (
    <div className={`nav-item ${active ? 'selected' : ''}`} onClick={click}>
      {name}
      <div className="bottom-line" />
    </div>
  );
}
