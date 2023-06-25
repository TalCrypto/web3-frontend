/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, WhitespaceData, Time } from 'lightweight-charts';
import { formatDateTime } from '@/utils/date';
import { useStore as useNanostore } from '@nanostores/react';
import { useChartData } from '@/hooks/collection';
import { $selectedTimeIndex } from '@/stores/trading';

function ChartDisplay() {
  const { graphData } = useChartData();
  const chartContainerRef: any = useRef();
  const selectedTimeIndex = useNanostore($selectedTimeIndex);

  const colors = {
    backgroundColor: 'transparent',
    lineColor: 'rgb(165, 92, 171)',
    textColor: 'rgba(168, 203, 255, 0.75)',
    areaTopColor: 'rgba(185, 15, 127, 0.45)',
    areaBottomColor: 'rgba(185, 15, 127, 0.05)'
  };

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor,
        fontFamily: 'Montserrat'
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(46, 48, 100, 0.5)' }
      },
      // height: 450,
      height: 220,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        lockVisibleTimeRangeOnResize: false,
        tickMarkFormatter: (time: any /* , tickMarkType, locale */) => {
          const timeFormat = selectedTimeIndex === 0 ? 'HH:mm' : 'DD/MM HH:mm';
          return formatDateTime(time, timeFormat);
        }
      },
      localization: {
        timeFormatter: (time: any) => {
          const timeFormat = 'DD/MM HH:mm';
          return formatDateTime(time, timeFormat);
        }
      }
      // handleScroll: {
      //   mouseWheel: false,
      //   pressedMouseMove: false,
      //   horzTouchDrag: false,
      //   vertTouchDrag: false
      // },
      // handleScale: {
      //   axisPressedMouseMove: false,
      //   mouseWheel: false,
      //   pinch: false
      // }
    });
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    // const newSeries = chart.addAreaSeries({
    //   lineColor: colors.lineColor,
    //   topColor: colors.areaTopColor,
    //   bottomColor: colors.areaBottomColor,
    //   lineWidth: 1
    // });

    const newSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350'
    });

    newSeries.setData(graphData);

    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [graphData]);

  return (
    <div>
      <div ref={chartContainerRef} />
    </div>
  );
}

export default ChartDisplay;
