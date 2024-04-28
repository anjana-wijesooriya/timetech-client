import { ChartData, ChartOptions, ChartType, Plugin } from "chart.js";
import { BasePlatform } from "chart.js/dist";

export type IChartConfig = {
    type: ChartType;
    data: ChartData;
    options?: ChartOptions;
    plugins?: Plugin[];
    platform?: typeof BasePlatform;
}