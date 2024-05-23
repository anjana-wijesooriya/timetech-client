import colorLib from '@kurkle/color';
import { DateTime } from 'luxon';
import 'chartjs-adapter-luxon';
// import { valueOrDefault } from './helpers/helpers.core';

// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
var _seed = Date.now();

export function valueOrDefault<T>(value: T | undefined, defaultValue: T) {
    return typeof value === 'undefined' ? defaultValue : value;
}

export class Utils {
    isMobile() {
        return window && window.matchMedia('(max-width: 767px)').matches;
    }
    ngbDateToDate(ngbDate: { month: any, day: any, year: any }) {
        if (!ngbDate) {
            return null;
        }
        return new Date(`${ngbDate.month}/${ngbDate.day}/${ngbDate.year}`);
    }
    dateToNgbDate(date: Date) {
        if (!date) {
            return null;
        }
        date = new Date(date);
        return { month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() };
    }
    scrollToTop(selector: string) {
        if (document) {
            const element = <HTMLElement>document.querySelector(selector);
            element.scrollTop = 0;
        }
    }

    getImageBlobUrl(imgString: string) {
        const b64Data = imgString;
        const contentType = 'image/jpg';

        // Decode the Base64 string
        const byteCharacters = atob(b64Data);

        // Create an array of byte values
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        // Convert the array of byte values to a Uint8Array
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the Uint8Array
        const blob = new Blob([byteArray], { type: contentType });

        // Now you can use the blob as needed (e.g., display it to the user)
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    }
    genId() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    srand(seed) {
        _seed = seed;
    }

    rand(min = undefined, max = undefined) {
        min = valueOrDefault(min, 0);
        max = valueOrDefault(max, 0);
        _seed = (_seed * 9301 + 49297) % 233280;
        return min + (_seed / 233280) * (max - min);
    }

    numbers(config) {
        var cfg = config || {};
        var min = valueOrDefault(cfg.min, 0);
        var max = valueOrDefault(cfg.max, 100);
        var from = valueOrDefault(cfg.from, []);
        var count = valueOrDefault(cfg.count, 8);
        var decimals = valueOrDefault(cfg.decimals, 8);
        var continuity = valueOrDefault(cfg.continuity, 1);
        var dfactor = Math.pow(10, decimals) || 0;
        var data = [];
        var i, value;

        for (i = 0; i < count; ++i) {
            value = (from[i] || 0) + this.rand(min, max);
            if (this.rand() <= continuity) {
                data.push(Math.round(dfactor * value) / dfactor);
            } else {
                data.push(null);
            }
        }

        return data;
    }

    points(config) {
        const xs = this.numbers(config);
        const ys = this.numbers(config);
        return xs.map((x, i) => ({ x, y: ys[i], r: undefined }));
    }

    bubbles(config) {
        return this.points(config).map(pt => {
            pt.r = this.rand(config.rmin, config.rmax);
            return pt;
        });
    }

    labels(config) {
        var cfg = config || {};
        var min = cfg.min || 0;
        var max = cfg.max || 100;
        var count = cfg.count || 8;
        var step = (max - min) / count;
        var decimals = cfg.decimals || 8;
        var dfactor = Math.pow(10, decimals) || 0;
        var prefix = cfg.prefix || '';
        var values = [];
        var i;

        for (i = min; i < max; i += step) {
            values.push(prefix + Math.round(dfactor * i) / dfactor);
        }

        return values;
    }

    MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    months(config) {
        var cfg = config || {};
        var count = cfg.count || 12;
        var section = cfg.section;
        var values = [];
        var i, value;

        for (i = 0; i < count; ++i) {
            value = this.MONTHS[Math.ceil(i) % 12];
            values.push(value.substring(0, section));
        }

        return values;
    }

    COLORS = [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',
        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba'
    ];

    color(index) {
        return this.COLORS[index % this.COLORS.length];
    }

    transparentize(value, opacity) {
        var alpha = opacity === undefined ? 0.5 : 1 - opacity;
        return colorLib(value).alpha(alpha).rgbString();
    }

    CHART_COLORS = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };

    NAMED_COLORS = [
        this.CHART_COLORS.red,
        this.CHART_COLORS.orange,
        this.CHART_COLORS.yellow,
        this.CHART_COLORS.green,
        this.CHART_COLORS.blue,
        this.CHART_COLORS.purple,
        this.CHART_COLORS.grey,
    ];

    namedColor(index) {
        return this.NAMED_COLORS[index % this.NAMED_COLORS.length];
    }

    newDate(days) {
        return DateTime.now().plus({ days }).toJSDate();
    }

    newDateString(days) {
        return DateTime.now().plus({ days }).toISO();
    }

    parseISODate(str) {
        return DateTime.fromISO(str);
    }

    getLocalStorage(key: string) {
        return JSON.parse(window.localStorage.getItem(key))
    }

    setLocalStorage(key, string, obj: any) {
        return window.localStorage.setItem(key, JSON.stringify(obj));
    }
}
