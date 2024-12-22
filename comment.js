import { insertComment, getResidenceBySku } from './db.js';

import { csvRowGenerator, delay } from './utils.js';

export default async function comment(filePath) {
    try {
        const csvRows = csvRowGenerator(filePath);

        let counter = 0;
        for await (const row of csvRows) {
            const residenceId = (await getResidenceBySku(row.sku))?.id;

            const currentTime = new Date();

            if (residenceId) {
                const reviewData = [
                    row.comment_text,
                    Number(row.rating) || null,
                    currentTime,
                    currentTime,
                    residenceId,
                ];

                await insertComment(reviewData);
            }

            counter++;
            counter % 5 == 0 ? console.log(counter) : null;
        }
    } catch (error) {
        console.log(error);
    }
}
