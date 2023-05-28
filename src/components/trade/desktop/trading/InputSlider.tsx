import React from 'react';

// const clamp = (val: any, min: any, max: any) => Math.min(Math.max(val, min), max);

// const lerp = (a: any, b: any, val: any) => a + val * (b - a);

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

  // const alphaFill = clamp((value - min) / (max - min), 0, 1); // clamped 0~1
  // const fill = alphaFill * 100; // 0~100%

  return (
    <div className="relative">
      <input
        className={`h-[4px] w-full rounded-[5px] bg-[#242652]
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        disabled={disabled}
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={defautValue}
        value={value > max ? max : value}
        onChange={handleChange}
        onMouseUp={handleAfterChange}
      />
      <div
        className={`absolute left-0 mt-[-11px] h-[4px] w-full rounded-[5px]
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      />

      {marks ? (
        <>
          <div className="absolute top-[11px] flex w-full justify-between">
            {Object.keys(marks).map(i => (
              <div
                key={`dot-${i}`}
                className="h-[8px] w-[8px] rounded-[4px] bg-[#a8cbff]/[.75]"
                onClick={() => {
                  if (!disabled) onChange(i);
                }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between">
            {Object.keys(marks).map(i => {
              const mark = marks[i];
              return (
                <div
                  key={`mark-${i}`}
                  className="h-[8px] w-[8px] cursor-pointer text-[14px] text-[#a3c2ff]/[.6]"
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
        className="absolute top-2 h-[14px] w-[14px] rounded-full
        border-[2px] border-[#04aefc] bg-white"
      />
    </div>
  );
}
