/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, IChartApi, SingleValueData, isUTCTimestamp } from 'lightweight-charts';
import { formatDateTime } from '@/utils/date';
import { useStore as useNanostore } from '@nanostores/react';
import { useChartData } from '@/hooks/collection';
import { $selectedTimeIndex } from '@/stores/trading';
import moment from 'moment';

function ChartDisplay() {
  const { graphData, graphVolData, graphTwoData } = useChartData();
  const chartContainerRef: any = useRef();
  const selectedTimeIndex = useNanostore($selectedTimeIndex);
  // const [candleSeries, setCandleSeries] = useState<ISeriesApi<'Candlestick'> | undefined>();
  const [areaSeries, setAreaSeries] = useState<ISeriesApi<'Area'> | undefined>();
  const [volumeSeries, setVolumeSeries] = useState<ISeriesApi<'Histogram'> | undefined>();
  const [oracleSeries, setOracleSeries] = useState<ISeriesApi<'Area'> | undefined>();
  const [chart, setChart] = useState<IChartApi>();

  const colors = {
    backgroundColor: 'transparent',
    lineColor: 'rgb(165, 92, 171)',
    lineTwoColor: 'rgba(98, 134, 227, 1)',
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
      newChart.applyOptions({ width: chartContainerRef.current.clientWidth });
      newChart.timeScale().fitContent();
    };

    const newSeries = newChart.addAreaSeries({
      lineColor: colors.lineColor,
      topColor: colors.areaTopColor,
      bottomColor: colors.areaBottomColor,
      lineWidth: 1
    });

    // const newSeries = newChart.addCandlestickSeries({
    //   upColor: '#26a69a',
    //   downColor: '#ef5350',
    //   borderVisible: false,
    //   wickUpColor: '#26a69a',
    //   wickDownColor: '#ef5350'
    // });

    const volSeries = newChart.addHistogramSeries({
      priceFormat: {
        type: 'volume'
      },
      priceScaleId: ''
    });

    volSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0
      }
    });

    const orclSeries = newChart.addAreaSeries({
      lineColor: colors.lineTwoColor,
      topColor: 'transparent',
      bottomColor: 'transparent',
      lineWidth: 1
    });

    newChart.timeScale().fitContent();

    // tooltip
    const toolTipWidth = 100;
    const toolTipHeight = 80;
    const toolTipMargin = 20;

    // Create and style the tooltip html element
    const toolTip = document.createElement('div');
    toolTip.setAttribute(
      'style',
      `width: 100px; height: 80px; position: absolute; display: none; 
      padding: 8px 12px 8px 12px; box-sizing: border-box; font-size: 12px; text-align: left; 
      z-index: 100; top: 0; left: 0; pointer-events: none; 
      border: 0.5px solid; border-radius: 4px;`
    );
    toolTip.style.background = 'rgba(32, 34, 73, 0.9)';
    toolTip.style.color = '#A8CBFFBF';
    toolTip.style.borderColor = '#C970D0';
    const container = document.getElementById('chartDisplay') || chartContainerRef.current;
    container.appendChild(toolTip);

    newChart.subscribeCrosshairMove(param => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
      ) {
        toolTip.style.display = 'none';
      } else {
        // time will be in the same format that we supplied to setData.
        // thus it will be YYYY-MM-DD
        const dateStr = isUTCTimestamp(param.time) ? moment.unix(param.time).format('DD/MM HH:mm') : param.time;
        toolTip.style.display = 'block';
        const data = param.seriesData.get(newSeries) as SingleValueData;
        const dataTwo = param.seriesData.get(orclSeries) as SingleValueData;
        const price = Math.round(data.value * 100) / 100;
        const priceTwo = Math.round(dataTwo.value * 100) / 100;
        toolTip.innerHTML = `
          <div class="flex flex-col space-y-1">
          <p>${dateStr}</p>
          <p class="text-white">
            vAMM: ${price}
          </p>
          <p class="text-white">
            Oracle: ${priceTwo}
          </p>
          </div>
        `;

        const coordinate = newSeries.priceToCoordinate(price);
        let shiftedCoordinate = param.point.x - 50;
        if (coordinate === null) {
          return;
        }
        // console.log(container.clientWidth, container.clientHeight);
        shiftedCoordinate = Math.max(0, Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate));
        // console.log(shiftedCoordinate);
        const coordinateY =
          coordinate - toolTipHeight - toolTipMargin > 0
            ? coordinate - toolTipHeight - toolTipMargin
            : Math.max(0, Math.min(container.clientHeight - toolTipHeight - toolTipMargin, coordinate + toolTipMargin));
        toolTip.style.left = `${shiftedCoordinate}px`;
        toolTip.style.top = `${coordinateY}px`;
      }
    });

    setAreaSeries(newSeries);
    setVolumeSeries(volSeries);
    setOracleSeries(orclSeries);
    setChart(newChart);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      newChart.remove();
      setChart(undefined);
    };
  }, []);

  useEffect(() => {
    if (areaSeries && volumeSeries && oracleSeries && chart) {
      areaSeries.setData(graphData);
      volumeSeries.setData(graphVolData);
      oracleSeries.setData(graphTwoData);
      chart.timeScale().fitContent();
    }
  }, [graphData, graphVolData, graphTwoData, chart, areaSeries, volumeSeries, oracleSeries]);

  return <div ref={chartContainerRef} id="chartDisplay" className="relative" />;
}

export default ChartDisplay;
