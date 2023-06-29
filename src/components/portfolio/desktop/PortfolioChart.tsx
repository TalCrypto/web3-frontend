/* eslint-disable no-useless-concat */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { useStore as useNanostore } from '@nanostores/react';
import { $psHistogramChartData, $psLineChartData, $psShowBalance } from '@/stores/portfolio';

function PortfolioChart(props: any) {
  const { isVisible } = props;

  const isShowBalance = useNanostore($psShowBalance);
  const chartContainerRef: any = useRef();
  const chartRef = useRef<IChartApi | null>(null);
  const lineChartData: any = useNanostore($psLineChartData);
  const histogramChartData: any = useNanostore($psHistogramChartData);

  const colors = {
    backgroundColor: 'transparent',
    lineColor: '#C970D0',
    textColor: 'rgba(168, 203, 255, 0.75)',
    areaTopColor: 'rgba(185, 15, 127, 0.45)',
    areaBottomColor: 'rgba(185, 15, 127, 0.05)'
  };

  const toolTip: any = document.createElement('div');

  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor
      },
      rightPriceScale: {
        visible: false,
        borderVisible: false
      },
      leftPriceScale: {
        visible: true,
        borderVisible: false
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: '#2E4371', visible: true }
      },
      width: chartContainerRef.current.clientWidth,
      // height: 450,
      height: 250,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        lockVisibleTimeRangeOnResize: false,
        tickMarkFormatter: (time: any) => {
          const date = new Date(time * 1000);
          const monthString = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
          const day = date.getDate();

          const formattedDate = `${day} ${monthString}`;
          return formattedDate;
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

    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.remove();
      }

      chartRef.current = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: colors.backgroundColor },
          textColor: colors.textColor
        },
        rightPriceScale: {
          visible: false,
          borderVisible: false
        },
        leftPriceScale: {
          visible: true,
          borderVisible: false
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: '#2E4371', visible: true }
        },
        width: chartContainerRef.current.clientWidth,
        // height: 450,
        height: 250,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          lockVisibleTimeRangeOnResize: false,
          tickMarkFormatter: (time: any) => {
            const date = new Date(time * 1000);
            const monthString = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
            const day = date.getDate();

            const formattedDate = `${day} ${monthString}`;
            return formattedDate;
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

      // line series
      const lineSeries = chartRef.current.addLineSeries({
        crosshairMarkerVisible: true,
        lastValueVisible: true,
        priceLineVisible: true,
        color: colors.lineColor,
        lineWidth: 2,
        lineType: 0
      });
      lineSeries.priceScale().applyOptions({
        scaleMargins: {
          // positioning the price scale for the area series
          top: 0.1,
          bottom: 0.3
        }
      });

      // volume series
      const volumeSeries = chartRef.current.addHistogramSeries({
        // crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
        color: '#26a69a',
        priceFormat: {
          type: 'volume'
        },
        priceScaleId: '' // set as an overlay by setting a blank priceScaleId
      });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8, // highest point of the series will be 70% away from the top
          bottom: 0
        }
      });

      if (lineChartData) {
        lineSeries.setData(lineChartData);
      }

      if (histogramChartData) {
        volumeSeries.setData(histogramChartData);
      }

      // tooltip
      const tooltipOptions = {
        priceFormatter: (price: any) => `$${price.toFixed(2)}`,
        dateFormatter: (timestamp: any) => {
          const date = new Date(timestamp * 1000);

          const dd = String(date.getDate()).padStart(2, '0');
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const yyyy = date.getFullYear();

          return `${dd}/${mm}/${yyyy}`;
        }
      };

      // Create and style the tooltip html element
      const container: any = document.getElementById('divChartWindows');
      const toolTipWidth = 80;
      // Create and style the tooltip html element

      toolTip.style =
        "position: absolute; display: none; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 0.5px solid; border-radius: 4px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif, Montserrat; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;";
      toolTip.style.background = 'rgba(32, 34, 73, 0.9)';
      toolTip.style.color = 'black';
      toolTip.style.borderColor = '#C970D0';
      toolTip.style.padding = '8px 12px';
      container.appendChild(toolTip);

      chartRef.current.subscribeCrosshairMove((param: any) => {
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
          const lineSeriesData: any = param.seriesData.get(lineSeries);
          const accumulated = lineSeriesData?.value;
          const volumeSeriesData: any = param.seriesData.get(volumeSeries);
          const daily = volumeSeriesData?.value;
          const date = tooltipOptions.dateFormatter(param.time);

          const accumulatedColor =
            accumulated === 0 || !isShowBalance ? 'text-highEmphasis' : accumulated > 0 ? 'text-marketGreen' : 'text-marketRed';
          const accumulatedPrefix = accumulated > 0 && isShowBalance ? '+' : '';
          const dailyColor = daily === 0 || !isShowBalance ? 'text-highEmphasis' : daily > 0 ? 'text-marketGreen' : 'text-marketRed';
          const dailyPrefix = daily > 0 && isShowBalance ? '+' : '';

          const content =
            `<div class='text-mediumEmphasis mt-1'>${date}</div><div class='text-white mt-1'>Accumulated: ` +
            `<span class='text-b3e ${accumulatedColor}'>${accumulatedPrefix}${
              isShowBalance ? accumulated.toFixed(6) : '****'
            }</span></div><div class='text-white'>Daily: ` +
            `<span class='text-b3e ${dailyColor}'>${dailyPrefix}${isShowBalance ? daily.toFixed(6) : '****'}</span></div>`;

          toolTip.style.display = 'block';
          toolTip.innerHTML = content;

          const coordinate = lineSeries.priceToCoordinate(accumulated);
          let shiftedCoordinate = param.point.x - 35;
          if (coordinate === null) {
            return;
          }
          shiftedCoordinate = Math.max(0, Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate));
          // const coordinateY =
          //   coordinate - toolTipHeight - toolTipMargin > 0
          //     ? coordinate - toolTipHeight - toolTipMargin
          //     : Math.max(0, Math.min(container.clientHeight - toolTipHeight - toolTipMargin, coordinate + toolTipMargin));
          toolTip.style.left = `${shiftedCoordinate}px`;
          toolTip.style.top = `${40}px`;
        }
      });

      chartRef.current.timeScale().fitContent();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      toolTip.style.display = 'none';
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [lineChartData, histogramChartData, isShowBalance, isVisible]);

  return <div id="divChartWindows" className="relative" ref={chartContainerRef} />;
}

export default PortfolioChart;
