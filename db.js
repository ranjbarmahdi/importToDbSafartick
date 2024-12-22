import db from './config.js';

// ========================================= insertCity
export async function insertCity(queryValues) {
    try {
        const checkQuery = 'SELECT * FROM Cities WHERE name = ?';
        const [rows, _] = await db.query(checkQuery, queryValues);

        if (rows.length === 0) {
            const insertQuery = 'INSERT INTO Cities(name) VALUES(?)';
            const res = await db.query(insertQuery, queryValues);
            return res[0].insertId;
        }

        return rows[0].id;
    } catch (error) {
        console.error('Error inserting city:', error);
        throw error;
    }
}

// ========================================= insertHost
export async function insertHost(queryValues) {
    try {
        const checkQuery = 'SELECT * FROM Hosts WHERE domain = ?';
        const [rows, _] = await db.query(checkQuery, queryValues);

        if (rows.length === 0) {
            const insertQuery = 'INSERT INTO Hosts(domain) VALUES(?)';
            const insertValues = [queryValues[0]];
            const res = await db.query(insertQuery, insertValues);
            return res[0].insertId;
        }

        return rows[0].id;
    } catch (error) {
        console.error('Error inserting host:', error);
        throw error;
    }
}

// ========================================= insertResidence
export async function insertResidence(queryValues) {
    try {
        const insertQuery = `INSERT INTO Accomodations(sku, name, lat, lon, description, url, rating, amenities, createdAt, updatedAt, CityId)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const res = await db.query(insertQuery, queryValues);
        return res;
    } catch (error) {
        console.error('Error inserting residence:', error);
        throw error;
    }
}

// ========================================= insertAccomodationPrice
export async function insertAccomodationPrice(queryValues) {
    try {
        const insertQuery = `INSERT INTO AccomodationPrices(price, date, availible, validUntil, url, scrapedAt, createdAt, updatedAt, AccomodationId, HostId, isInstant)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const res = await db.query(insertQuery, queryValues);
        return res;
    } catch (error) {
        console.error('Error inserting accommodation price:', error);
        throw error;
    }
}

// ========================================= insertComment
export async function insertComment(queryValues) {
    try {
        const insertQuery = `INSERT INTO Reviews(comment, rating, createdAt, updatedAt, AccomodationId)
            VALUES(?, ?, ?, ?, ?)`;

        const res = await db.query(insertQuery, queryValues);
        return res;
    } catch (error) {
        console.error('Error inserting review:', error);
        throw error;
    }
}

// ========================================= getResidenceBySku
export async function getResidenceBySku(sku) {
    try {
        const selectQuery = 'SELECT * FROM Accomodations WHERE sku=?';

        const [rows, _] = await db.query(selectQuery, [sku]);
        return rows[0];
    } catch (error) {
        console.error('Error getResidenceBySku:', error);
        throw error;
    }
}
