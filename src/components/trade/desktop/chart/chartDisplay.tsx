/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, forwardRef, useState, useImperativeHandle } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { formatDateTime } from '@/utils/date';

function ChartDisplay(props: any, ref: any) {
  const {
    // isStartLoadingChart,
    selectedTimeIndex,
    // minY,
    // maxY,
    // actualMinY,
    // actualMaxY,
    // isChangingCollection,
    lineChartData,
    isProShow,
    chartProContainerRef
  } = props;
  const chartContainerRef: any = useRef();
  const [myChart, setMyChart] = useState();

  const colors = {
    // backgroundColor: 'rgb(23, 24, 51)',
    backgroundColor: 'transparent',
    lineColor: 'rgb(165, 92, 171)',
    textColor: 'rgba(168, 203, 255, 0.75)',
    areaTopColor: 'rgba(185, 15, 127, 0.45)',
    areaBottomColor: 'rgba(185, 15, 127, 0.05)'
  };
  useImperativeHandle(ref, () => ({
    reset() {
      // setLineChartData([]);
    },
    setGraphValue(/* data: any */) {
      // let min = Number.MAX_SAFE_INTEGER;
      // let max = Number.MIN_SAFE_INTEGER;
      // setLineChartData(data);
      // data.forEach(({ y }) => {
      //   min = parseFloat(y) < parseFloat(min.toString()) ? y : min;
      //   max = parseFloat(y) > parseFloat(max.toString()) ? y : max;
      // });
      // setActualMaxYAndMinY({ max, min });
      // setMaxYAndMinY({ max: max * 1.01, min: min * 0.99 });
    }
  }));

  useEffect(() => {
    const newChartData: any = [];
    if (lineChartData) {
      lineChartData.map((item: any) => newChartData.push({ time: item.time, value: Number(item.value) }));
    }
    const chart: any = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(46, 48, 100, 0.5)' }
      },
      width: chartContainerRef.current.clientWidth,
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
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
        vertTouchDrag: false
      },
      handleScale: {
        axisPressedMouseMove: false,
        mouseWheel: false,
        pinch: false
      }
    });
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        rightPriceScale: {
          scaleMargins: {
            top: 0.1,
            bottom: 0.1
          }
        }
      });
    };
    const newSeries = chart.addAreaSeries({
      lineColor: colors.lineColor,
      topColor: colors.areaTopColor,
      bottomColor: colors.areaBottomColor,
      lineWidth: 1
    });
    newSeries.setData(newChartData);
    chart.timeScale().fitContent();
    setMyChart(chart);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [lineChartData]);

  useEffect(() => {
    if (myChart) {
      const fullW = chartProContainerRef.current.clientWidth - 24; // minus padding
      const w = fullW - 261;
      const newChart: any = myChart;
      newChart.applyOptions({
        width: isProShow ? w : fullW,
        rightPriceScale: {
          scaleMargins: {
            top: 0.1,
            bottom: 0.1
          }
        }
      });
      newChart.timeScale().fitContent();
    }
  }, [myChart, isProShow, chartProContainerRef]);

  return (
    <div>
      <div ref={chartContainerRef} />
    </div>
  );
}

export default forwardRef(ChartDisplay);
