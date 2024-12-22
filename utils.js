import fs from 'fs';

import moment from 'moment-jalaali';

import { parse as parseSync } from 'csv/sync';
import { parse } from 'csv';

// ========================================= delay
export const delay = (ms) => new Promise((res, rej) => setTimeout(() => res(), ms));

// ========================================= csvRowGenerator
export async function* csvRowGenerator(filePath) {
    const parser = parse({
        columns: true,
        cast: (value, context) => {
            if (value === undefined || value === NaN || value === null || value?.trim() === '') {
                return null;
            }

            if (
                value?.trim()?.toLowerCase() === 'true' ||
                value?.trim()?.toLowerCase() === 'false'
            ) {
                return JSON.parse(value);
            }

            return value;
        },
    });

    const stream = fs.createReadStream(filePath).pipe(parser);

    for await (const row of stream) {
        yield row;
    }
}

// ========================================= csvReadStream
export async function csvReadStream(filePath) {
    return new Promise((res, rej) => {
        let result = [];

        const parser = parse({
            columns: true,
            cast: (value, context) => {
                if (
                    value === undefined ||
                    value === NaN ||
                    value === null ||
                    value?.trim() === ''
                ) {
                    return null;
                }

                if (
                    value?.trim()?.toLowerCase() === 'true' ||
                    value?.trim()?.toLowerCase() === 'false'
                ) {
                    return JSON.parse(value);
                }

                return value;
            },
        });

        const stream = fs.createReadStream(filePath);

        stream
            .pipe(parser)
            .on('data', (data) => result.push(data))
            .on('end', () => res(result));
    });
}

// ========================================= csvReadAsync
export async function csvReadAsync(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const records = parseSync(fileContent, {
            columns: true,
        });
        return records;
    } catch (error) {
        console.error('Error reading the CSV file:', error);
        throw error;
    }
}

// ========================================= getDomain
export function getDomain(url) {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.replace(/^www./, '');
        return hostname;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

// ========================================= getDomain
export const jalaliToGregorianDate = (jalaliDate) => {
    return moment(jalaliDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
};
