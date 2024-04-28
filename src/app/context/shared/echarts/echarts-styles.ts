// Learn more about options https://ecomfe.github.io/echarts-doc/public/en/option.html
    import { EChartsOption } from 'echarts';

    export const AttendanceDetailsChart = {
        axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0.2, '#7CFFB2'],
                [0.4, '#58D9F9'],
                [0.6, '#FDDD60'],
                [0.8, '#eb1cc6cf'],
                [1, '#FF6E76']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 10,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: -30,
            length: 15,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          axisLabel: {
            color: 'inherit',
            distance: 30,
            fontSize: 8
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}',
            color: 'inherit'
          },
        };

export class echartStyles {
	static smoothLine = {
		type: 'line',
		smooth: true
	};
	static lineShadow = {
		shadowColor: 'rgba(0, 0, 0, .2)',
		shadowOffsetX: -1,
		shadowOffsetY: 8,
		shadowBlur: 10
	};
	static gridNoAxis = {
		show: false,
		top: 5,
		left: 0,
		right: 0,
		bottom: 0
	};
	static pieRing = {
		radius: ['50%', '60%'],
		selectedMode: true,
		selectedOffset: 0,
		avoidLabelOverlap: false,
	};
	static pieLabelOff = {
		label: { show: false },
		labelLine: { show: false, emphasis: { show: false } },
	};
	static pieLabelCenterHover = {
		normal: {
			show: false,
			position: 'center'
		},
		emphasis: {
			show: true,
			textStyle: {
				fontWeight: 'bold'
			}
		}
	};
	static pieLineStyle = {
		color: 'rgba(0,0,0,0)',
		borderWidth: 2,
		...echartStyles.lineShadow
	};
	static pieThikLineStyle = {
		color: 'rgba(0,0,0,0)',
		borderWidth: 12,
		...echartStyles.lineShadow
	};
	static gridAlignLeft = {
		show: false,
		top: 6,
		right: 0,
		left: '-6%',
		bottom: 0
	};
	static defaultOptions: EChartsOption = {
		grid: {
			show: false,
			top: 6,
			right: 0,
			left: 0,
			bottom: 0
		},
		tooltip: {
			show: true,
			backgroundColor: 'rgba(0, 0, 0, .8)'
		},
		xAxis: {
			type: 'category',
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			show: true
		},
		yAxis: {
			type: 'value',
			show: false
		}
	};
	static lineFullWidth: EChartsOption = {
		grid: {
			show: false,
			top: 0,
			right: '-9%',
			left: '-8.5%',
			bottom: 0
		},
		tooltip: {
			show: true,
			backgroundColor: 'rgba(0, 0, 0, .8)'
		},
		xAxis: {
			type: 'category',
			show: true
		},
		yAxis: {
			type: 'value',
			show: false,
		}
	};
	static lineNoAxis: EChartsOption = {
		grid: echartStyles.gridNoAxis,
		tooltip: {
			show: true,
			backgroundColor: 'rgba(0, 0, 0, .8)'
		},
		xAxis: {
			type: 'category',
			axisLine: {
				show: false
			},
			axisLabel: {
				color: '#ccc'
			}
		},
		yAxis: {
			type: 'value',
			splitLine: {
				lineStyle: {
					color: 'rgba(0, 0, 0, .1)'
				}
			},
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				color:'#ccc'
			}
		}
	};
}
