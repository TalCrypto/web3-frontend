/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, IChartApi } from 'lightweight-charts';
import { formatDateTime } from '@/utils/date';
import { useStore as useNanostore } from '@nanostores/react';
import { useChartData } from '@/hooks/collection';
import { $selectedTimeIndex } from '@/stores/trading';

function ChartDisplay() {
  const { graphData } = useChartData();
  const chartContainerRef: any = useRef();
  const selectedTimeIndex = useNanostore($selectedTimeIndex);
  const [candleSeries, setCandleSeries] = useState<ISeriesApi<'Candlestick'> | undefined>();
  const [chart, setChart] = useState<IChartApi>();
  const colors = {
    backgroundColor: 'transparent',
    lineColor: 'rgb(165, 92, 171)',
    textColor: 'rgba(168, 203, 255, 0.75)',
    areaTopColor: 'rgba(185, 15, 127, 0.45)',
    areaBottomColor: 'rgba(185, 15, 127, 0.05)'
  };

  useEffect(() => {
    const newChart = createChart(chartContainerRef.current, {
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
      newChart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    // const newSeries = chart.addAreaSeries({
    //   lineColor: colors.lineColor,
    //   topColor: colors.areaTopColor,
    //   bottomColor: colors.areaBottomColor,
    //   lineWidth: 1
    // });

    const newSeries = newChart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350'
    });

    newChart.timeScale().fitContent();

    setCandleSeries(newSeries);
    setChart(newChart);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      newChart.remove();
    };
  }, []);

  useEffect(() => {
    if (candleSeries && chart) {
      candleSeries.setData(graphData);
      chart.timeScale().fitContent();
    }
  }, [graphData]);

  return <div ref={chartContainerRef} />;
}

export default ChartDisplay;
