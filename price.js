import { insertHost, insertAccomodationPrice, getResidenceBySku } from './db.js';
import { csvRowGenerator, delay, getDomain, jalaliToGregorianDate } from './utils.js';

export default async function price(filePath) {
    try {
        const csvRows = csvRowGenerator(filePath);

        let counter = 0;
        for await (const row of csvRows) {
            const domain = getDomain(row.url);

            const hostId = await insertHost([domain]);
            const residenceId = (await getResidenceBySku(row.sku))?.id;

            const currentTime = new Date();
            const gregorianDate = jalaliToGregorianDate(row.date);

            const validUntil = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);

            if (hostId && residenceId) {
                const priceData = [
                    parseFloat(row.price),
                    jalaliToGregorianDate(row.date),
                    new Date() > new Date(gregorianDate) ? false : true,
                    validUntil,
                    row.url,
                    currentTime,
                    currentTime,
                    currentTime,
                    residenceId,
                    hostId,
                    row.is_instant,
                ];

                await insertAccomodationPrice(priceData);
            }

            counter++;
            counter % 5 == 0 ? console.log(counter) : null;
        }
    } catch (error) {
        console.log(error);
    }
}
