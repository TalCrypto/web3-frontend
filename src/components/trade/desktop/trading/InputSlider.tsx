import React from 'react';

const clamp = (val: any, min: any, max: any) => Math.min(Math.max(val, min), max);

const lerp = (a: any, b: any, val: any) => a + val * (b - a);

export default function InputSlider(props: any) {
  const { min, max, step, defautValue, value, onChange, onAfterChange, onSlideMax, marks, disabled } = props;

  function handleChange(event: any) {
    const val = event.target.value;
    if (onChange) onChange(val);

    if (val === max) {
      if (onSlideMax) onSlideMax();
    }
  }

  function handleAfterChange(event: any) {
    const val = event.target.value;
    if (onAfterChange) onAfterChange(val);

    if (val === max) {
      if (onSlideMax) onSlideMax();
    }
  }

  const alphaFill = clamp((value - min) / (max - min), 0, 1); // clamped 0~1
  const fill = alphaFill * 100; // 0~100%

  return (
    <div className="relative">
      <input
        className={`ml-[2px] h-[4px] w-[calc(100%-10px)] appearance-none rounded-[5px] bg-mediumBlue
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
        className={`input-track input-track pointer-events-none absolute left-0
          mt-[-11px] h-[4px] w-full rounded-[5px] pr-[5px]
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        style={{ width: `${fill}%` }}
      />
      {marks ? (
        <>
          <div className="pointer-events-none absolute top-[11px] flex w-full justify-between pr-[5px]">
            {Object.keys(marks).map(i => (
              <div
                key={`dot-${i}`}
                className={`pointer-events-auto h-[8px] w-[8px] 
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  rounded-[4px] bg-mediumEmphasis
                  hover:bg-highEmphasis hover:outline-[3px] hover:outline-white/[.20]`}
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
                  className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    text-[14px] text-mediumEmphasis`}
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
        className={`input-slider pointer-events-none absolute top-2 flex h-[14px] w-[14px]
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          items-center justify-center rounded-full`}
        style={{
          left: `calc(${fill}% - ${lerp(0, 14, alphaFill)}px)`
        }}>
        <div className="h-[10px] w-[10px] rounded-full bg-white" />
      </div>
    </div>
  );
}
