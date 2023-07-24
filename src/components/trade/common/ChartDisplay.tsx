/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, IChartApi, SingleValueData, isUTCTimestamp, MouseEventHandler } from 'lightweight-charts';
import { formatDateTime } from '@/utils/date';
import { useStore as useNanostore } from '@nanostores/react';
import { useChartData } from '@/hooks/collection';
import { $selectedTimeIndex } from '@/stores/trading';
import moment from 'moment';
import { $isSettingOracleOn, $isSettingVammOn } from '@/stores/chart';

function ChartDisplay() {
  const { graphData, graphVolData, graphTwoData } = useChartData();
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

  const addVammSeries = () => {
    if (!chart || areaSeries) return;
    // console.log('addVammSeries');

    const series = chart.addAreaSeries({
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

    const volSeries = chart.addHistogramSeries({
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

    setAreaSeries(series);
    setVolumeSeries(volSeries);
  };

  const removeVammSeries = () => {
    if (!chart || !areaSeries || !volumeSeries) return;
    // console.log('removeOracleSeries');
    chart.removeSeries(areaSeries);
    chart.removeSeries(volumeSeries);
    setAreaSeries(undefined);
    setVolumeSeries(undefined);
  };

  const addOracleSeries = () => {
    if (!chart || oracleSeries) return;
    // console.log('addOracleSeries');
    const series = chart.addAreaSeries({
      lineColor: colors.lineTwoColor,
      topColor: 'transparent',
      bottomColor: 'transparent',
      lineWidth: 1
    });

    setOracleSeries(series);
  };

  const removeOracleSeries = () => {
    if (!chart || !oracleSeries) return;
    // console.log('removeOracleSeries');
    chart.removeSeries(oracleSeries);
    setOracleSeries(undefined);
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

      if (!areaSeries || !oracleSeries) return;

      const data = param.seriesData.get(areaSeries) as SingleValueData | undefined;
      const dataTwo = param.seriesData.get(oracleSeries) as SingleValueData | undefined;
      const price = data ? Math.round(data.value * 100) / 100 : 0;
      const priceTwo = dataTwo ? Math.round(dataTwo.value * 100) / 100 : 0;
      toolTip.innerHTML = `
          <div class="flex flex-col space-y-1">
          <p>${dateStr}</p>
          ${data ? `<p class="text-white">vAMM: ${price}</p>` : ''}
          ${dataTwo ? `<p class="text-white">Oracle: ${priceTwo}</p>` : ''}
          </div>
        `;

      let coordinate;
      if (data) {
        coordinate = areaSeries.priceToCoordinate(price);
      } else {
        coordinate = oracleSeries.priceToCoordinate(priceTwo);
      }
      let shiftedCoordinate = param.point.x - 50;
      if (coordinate === null) {
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

  const handleTooltip = () => {
    if (!chart) return;
    // console.log('unsub sub');
    chart.unsubscribeCrosshairMove(crossHairMoveHandler);
    chart.subscribeCrosshairMove(crossHairMoveHandler);
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

    // console.log({ isSettingVammOn, isSettingOracleOn });
    // addVammSeries();
    // addOracleSeries();

    window.addEventListener('resize', handleResize);

    return () => {
      // console.log('didmount');
      // removeVammSeries();
      // removeOracleSeries();
      window.removeEventListener('resize', handleResize);
      newChart.remove();
      setChart(undefined);
    };
  }, []);

  // graph data sync
  useEffect(() => {
    if (areaSeries && volumeSeries && chart) {
      areaSeries.setData(graphData);
      volumeSeries.setData(graphVolData);
      chart.timeScale().fitContent();
      // console.log('graph data sync');
      handleTooltip();
    }
  }, [graphData, chart, areaSeries, volumeSeries]);

  useEffect(() => {
    if (oracleSeries && chart) {
      oracleSeries.setData(graphTwoData);
      chart.timeScale().fitContent();
      // console.log('graph two data sync');
      handleTooltip();
    }
  }, [graphTwoData, chart, oracleSeries]);

  // show hide vamm oracle series
  useEffect(() => {
    if (chart) {
      if (isSettingVammOn) {
        addVammSeries();
        // console.log('add vamm series');
        handleTooltip();
      } else {
        removeVammSeries();
      }
    }
  }, [isSettingVammOn, chart]);

  useEffect(() => {
    if (chart) {
      if (isSettingOracleOn) {
        addOracleSeries();
        // console.log('add oracle series');
        handleTooltip();
      } else {
        removeOracleSeries();
      }
    }
  }, [isSettingOracleOn, chart]);

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
