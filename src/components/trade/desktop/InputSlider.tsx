import React from 'react';

const clamp = (val: any, min: any, max: any) => Math.min(Math.max(val, min), max);

const lerp = (a: any, b: any, val: any) => a + val * (b - a);

export default function InputSlider(props: any) {
  const { min, max, step, defautValue, value, onChange, onAfterChange, marks, disabled } = props;

  function handleChange(event: any) {
    const val = event.target.value;
    if (onChange) onChange(val);
  }

  function handleAfterChange(event: any) {
    const val = event.target.value;
    if (onAfterChange) onAfterChange(val);
  }

  const alphaFill = clamp((value - min) / (max - min), 0, 1); // clamped 0~1
  const fill = alphaFill * 100; // 0~100%

  return (
    <div className="inputslider">
      <input
        disabled={disabled}
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={defautValue}
        value={value > max ? max : value}
        onChange={handleChange}
        onMouseUp={handleAfterChange}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      />
      <div
        className="track"
        style={{
          left: '0%',
          width: `${fill}%`,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      />

      {marks ? (
        <>
          <div className="steps">
            {Object.keys(marks).map(i => (
              <div
                key={`dot-${i}`}
                className="item"
                onClick={() => {
                  if (!disabled) onChange(i);
                }}
              />
            ))}
          </div>
          <div className="marks">
            {Object.keys(marks).map(i => {
              const mark = marks[i];
              return (
                <div
                  key={`mark-${i}`}
                  className="item"
                  onClick={() => {
                    if (!disabled) onChange(i);
                  }}>
                  {mark.label}
                </div>
              );
            })}
          </div>
        </>
      ) : null}
      <div
        className="handle"
        style={{
          left: `calc(${fill}% - ${lerp(3, 10, alphaFill)}px)`,
          // transform: 'translateX(-50%)',
          opacity: disabled ? '0.6' : '1'
        }}
      />
    </div>
  );
}
