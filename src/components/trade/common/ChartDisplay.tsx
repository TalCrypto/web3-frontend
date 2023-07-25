/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, IChartApi, SingleValueData, isUTCTimestamp, MouseEventHandler } from 'lightweight-charts';
import { formatDateTime } from '@/utils/date';
import { useStore as useNanostore } from '@nanostores/react';
// import { useChartData } from '@/hooks/collection';
import { $ohlcData, $selectedTimeIndex } from '@/stores/trading';
import moment from 'moment';
import { $isSettingOracleOn, $isSettingVammOn } from '@/stores/chart';
import { getRandomIntInclusive } from '@/utils/number';

function ChartDisplay() {
  const ohlcData = useNanostore($ohlcData);
  // const { graphData, graphVolData, graphTwoData } = useChartData();
  const chartContainerRef: any = useRef();
  const selectedTimeIndex = useNanostore($selectedTimeIndex);
  // const [candleSeries, setCandleSeries] = useState<ISeriesApi<'Candlestick'> | undefined>();
  const [areaSeries, setAreaSeries] = useState<ISeriesApi<'Area'> | undefined>();
  const [volumeSeries, setVolumeSeries] = useState<ISeriesApi<'Histogram'> | undefined>();
  const [oracleSeries, setOracleSeries] = useState<ISeriesApi<'Area'> | undefined>();
  const [chart, setChart] = useState<IChartApi>();

  const isSettingVammOn = useNanostore($isSettingVammOn);
  const isSettingOracleOn = useNanostore($isSettingOracleOn);

  const colors = {
    backgroundColor: 'transparent',
    lineColor: 'rgb(165, 92, 171)',
    lineTwoColor: 'rgba(98, 134, 227, 1)',
    textColor: 'rgba(168, 203, 255, 0.75)',
    areaTopColor: 'rgba(185, 15, 127, 0.45)',
    areaBottomColor: 'rgba(185, 15, 127, 0.05)'
  };

  const toolTipWidth = 100;
  const toolTipHeight = 80;
  const toolTipMargin = 20;

  const crossHairMoveHandler: MouseEventHandler = param => {
    const toolTip = document.getElementById('chartTooltip');
    if (!toolTip) return;
    const container = document.getElementById('chartDisplay') || chartContainerRef.current;

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

      const data = areaSeries ? (param.seriesData.get(areaSeries) as SingleValueData) : undefined;
      const dataTwo = oracleSeries ? (param.seriesData.get(oracleSeries) as SingleValueData) : undefined;
      const price = data ? data.value : 0;
      const priceTwo = dataTwo ? dataTwo.value : 0;
      toolTip.innerHTML = `
          <div class="flex flex-col space-y-1">
          <p>${dateStr}</p>
          ${data ? `<p class="text-white">vAMM: ${price.toFixed(2)}</p>` : ''}
          ${dataTwo ? `<p class="text-white">Oracle: ${priceTwo.toFixed(2)}</p>` : ''}
          </div>
        `;
      // console.log(data, dataTwo);

      let coordinate;
      if (data) {
        coordinate = areaSeries?.priceToCoordinate(price);
      } else {
        coordinate = oracleSeries?.priceToCoordinate(priceTwo);
      }
      let shiftedCoordinate = param.point.x - 50;

      if (!coordinate) {
        return;
      }
      shiftedCoordinate = Math.max(0, Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate));
      const coordinateY =
        coordinate - toolTipHeight - toolTipMargin > 0
          ? coordinate - toolTipHeight - toolTipMargin
          : Math.max(0, Math.min(container.clientHeight - toolTipHeight - toolTipMargin, coordinate + toolTipMargin));
      toolTip.style.left = `${shiftedCoordinate}px`;
      toolTip.style.top = `${coordinateY}px`;
    }
  };

  useEffect(() => {
    if (chart) {
      chart.unsubscribeCrosshairMove(crossHairMoveHandler);
      chart.subscribeCrosshairMove(crossHairMoveHandler);
    }
  }, [chart, areaSeries, oracleSeries]);

  const removeVammSeries = () => {
    if (!chart || !areaSeries || !volumeSeries) return;
    // console.log('removeOracleSeries');
    chart.removeSeries(areaSeries);
    chart.removeSeries(volumeSeries);
    setAreaSeries(undefined);
    setVolumeSeries(undefined);
    chart.timeScale().fitContent();
  };

  const addVammSeries = () => {
    if (!chart) return;
    if (areaSeries) {
      removeVammSeries();
    }
    // console.log('addVammSeries');
    const series = chart.addAreaSeries({
      lineColor: colors.lineColor,
      topColor: colors.areaTopColor,
      bottomColor: colors.areaBottomColor,
      lineWidth: 1
    });
    const graphData = ohlcData.map(record => ({ time: record.time, value: record.close }));
    series.setData(graphData);
    setAreaSeries(series);

    // const newSeries = newChart.addCandlestickSeries({
    //   upColor: '#26a69a',
    //   downColor: '#ef5350',
    //   borderVisible: false,
    //   wickUpColor: '#26a69a',
    //   wickDownColor: '#ef5350'
    // });

    const volSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume'
      },
      priceScaleId: ''
    });
    volSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.9,
        bottom: 0
      }
    });
    const graphVolData = ohlcData.map(record => ({
      time: record.time,
      value: getRandomIntInclusive(1, record.close * 10),
      color: Math.random() > 0.5 ? 'rgba(120, 243, 99, 0.3)' : 'rgba(255, 86, 86, 0.3)'
    }));
    volSeries.setData(graphVolData);
    setVolumeSeries(volSeries);

    chart.timeScale().fitContent();
  };

  const removeOracleSeries = () => {
    if (!chart || !oracleSeries) return;
    // console.log('removeOracleSeries');
    chart.removeSeries(oracleSeries);
    setOracleSeries(undefined);
    chart.timeScale().fitContent();
  };

  const addOracleSeries = () => {
    if (!chart) return;
    if (oracleSeries) {
      removeOracleSeries();
    }
    // console.log('addOracleSeries');
    const series = chart.addAreaSeries({
      lineColor: colors.lineTwoColor,
      topColor: 'transparent',
      bottomColor: 'transparent',
      lineWidth: 1
    });

    // todo: second graph oracle / vamm
    const graphTwoData = ohlcData.map(record => ({
      time: record.time,
      value: record.close + 0.01
    }));
    series.setData(graphTwoData);
    setOracleSeries(series);
    chart.timeScale().fitContent();
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

    newChart.timeScale().fitContent();
    setChart(newChart);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      newChart.remove();
      setChart(undefined);
    };
  }, []);

  // graph data sync
  useEffect(() => {
    if (chart) {
      if (isSettingVammOn === true) {
        // console.log('vamm sync');
        addVammSeries();
      }

      if (isSettingVammOn === false) {
        // console.log('vamm remove');
        removeVammSeries();
      }

      if (isSettingOracleOn === true) {
        // console.log('oracle sync');
        addOracleSeries();
      }

      if (isSettingOracleOn === false) {
        // console.log('oracle remove');
        removeOracleSeries();
      }
    }
  }, [chart, ohlcData, isSettingVammOn, isSettingOracleOn]);

  return (
    <div ref={chartContainerRef} id="chartDisplay" className="relative">
      <div
        id="chartTooltip"
        className="pointer-events-none absolute z-10 hidden h-[80px] w-[100px] rounded border-[0.5px] border-[#C970D0] bg-[rgba(32,34,73,0.9)] px-2 py-3 text-[12px] text-mediumEmphasis "
      />
    </div>
  );
}

export default ChartDisplay;
