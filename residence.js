import { insertResidence, insertCity } from './db.js';
import { csvRowGenerator, delay, convertToEnglishNumber } from './utils.js';

export default async function residence(filePath) {
    try {
        const csvRows = csvRowGenerator(filePath);

        let counter = 0;
        for await (const row of csvRows) {
            if (!row.name) {
                continue;
            }

            const cityId = await insertCity([row.city]);

            const amenities = [row.facilities, row.amenities]
                .filter((item) => item?.trim())
                .join('\n\n');

            let rating = row.average_rating
                ?.split('\n')
                ?.find((value) => value.includes('امتیاز کلی'))
                ?.split(':')[1];
            rating = convertToEnglishNumber(rating);
            rating = rating = rating ? Number(rating) : null;

            const residenceData = [
                row.sku,
                row.name,
                null,
                null,
                row.description,
                row.url,
                rating,
                amenities,
                new Date(),
                new Date(),
                cityId,
            ];

            await insertResidence(residenceData);

            counter++;
            counter % 5 == 0 ? console.log(counter) : null;
        }
    } catch (error) {
        console.log(error);
    }
}
