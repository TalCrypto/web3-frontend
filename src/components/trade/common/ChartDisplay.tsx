/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, IChartApi, SingleValueData, isUTCTimestamp, MouseEventHandler } from 'lightweight-charts';
import { formatDateTime } from '@/utils/date';
import { useStore as useNanostore } from '@nanostores/react';
// import { useChartData } from '@/hooks/collection';
import { $OracleGraphData, $ohlcData, $selectedTimeIndex } from '@/stores/trading';
import { $isSettingOracleOn, $isSettingVammOn } from '@/stores/chart';
import { getRandomIntInclusive } from '@/utils/number';

function ChartDisplay({ id }: { id: string }) {
  const ohlcData = useNanostore($ohlcData);
  const oracleGraphData = useNanostore($OracleGraphData);
  // const { graphData, graphVolData, graphTwoData } = useChartData();
  const chartContainerRef: any = useRef();
  const selectedTimeIndex = useNanostore($selectedTimeIndex);
  // const [candleSeries, setCandleSeries] = useState<ISeriesApi<'Candlestick'> | undefined>();
  // const [areaSeries, setAreaSeries] = useState<ISeriesApi<'Area'> | undefined>();
  // const [volumeSeries, setVolumeSeries] = useState<ISeriesApi<'Histogram'> | undefined>();
  // const [oracleSeries, setOracleSeries] = useState<ISeriesApi<'Area'> | undefined>();
  // const [chart, setChart] = useState<IChartApi>();

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
      },
      crosshair: {
        // hide the horizontal crosshair line
        horzLine: {
          visible: false,
          labelVisible: false
        },
        // hide the vertical crosshair label
        vertLine: {
          labelVisible: false,
          color: colors.lineColor,
          style: 4
        }
      }
    });

    // add series vamm and oracle -----------------------------------

    // console.log('addVammSeries');
    const vammSeries = newChart.addAreaSeries({
      lineColor: colors.lineColor,
      topColor: colors.areaTopColor,
      bottomColor: colors.areaBottomColor,
      lineWidth: 1
    });
    const graphData = ohlcData.map(record => ({ time: record.time, value: record.close }));
    vammSeries.setData(graphData);
    // setAreaSeries(vammSeries);

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
    // setVolumeSeries(volSeries);

    let oracleSeries: any;

    if (isSettingOracleOn) {
      // console.log('addOracleSeries');
      oracleSeries = newChart.addAreaSeries({
        lineColor: colors.lineTwoColor,
        topColor: 'transparent',
        bottomColor: 'transparent',
        lineWidth: 1
      });

      // todo: second graph oracle / vamm
      const graphTwoData = ohlcData.map(record => ({ time: record.time, value: record.close + 0.1 }));
      oracleSeries.setData(graphTwoData);
      // setOracleSeries(oracleSeries);
    }

    newChart.timeScale().fitContent();
    // setChart(newChart);

    // tooltip --------------------------------------

    const toolTipWidth = 100;
    const toolTipHeight = 80;
    const toolTipMargin = 20;

    const container: any = document.getElementById(`${id}-chartDisplay`);
    const toolTip: any = document.getElementById(`${id}-chartTooltip`);

    toolTip.style.display = 'none';

    const dateFormatter = (timestamp: any) => {
      const date = new Date(timestamp * 1000);

      const DD = String(date.getDate()).padStart(2, '0');
      const MM = String(date.getMonth() + 1).padStart(2, '0');
      const HH = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');

      return `${DD}/${MM} ${HH}:${mm}`;
    };

    const crossHairMoveHandler: MouseEventHandler = param => {
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
        const dateStr = isUTCTimestamp(param.time) ? dateFormatter(param.time) : param.time;
        toolTip.style.display = 'block';

        const data = vammSeries ? (param.seriesData.get(vammSeries) as SingleValueData) : undefined;
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
          coordinate = vammSeries?.priceToCoordinate(price);
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

    newChart.subscribeCrosshairMove(crossHairMoveHandler);

    const handleResize = () => {
      newChart.applyOptions({ width: chartContainerRef.current.clientWidth });
      newChart.timeScale().fitContent();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      newChart.unsubscribeCrosshairMove(crossHairMoveHandler);
      window.removeEventListener('resize', handleResize);
      newChart.remove();
      // setChart(undefined);
    };
  }, [ohlcData, isSettingVammOn, isSettingOracleOn]);

  return (
    <div ref={chartContainerRef} id={`${id}-chartDisplay`} className="relative">
      <div
        id={`${id}-chartTooltip`}
        className="pointer-events-none absolute z-10 hidden h-[80px] w-[100px] rounded border-[0.5px] border-[#C970D0] bg-[rgba(32,34,73,0.9)] px-2 py-3 text-[12px] text-mediumEmphasis "
      />
    </div>
  );
}

export default ChartDisplay;
