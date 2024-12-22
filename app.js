import path from 'path';
import fs from 'fs';
import promptSync from 'prompt-sync';
import residence from './residence.js';
import price from './price.js';
import comment from './comment.js';

const prompt = promptSync({ sigint: true });

const directories = {
    residence: './csv/residence',
    price: './csv/price',
    comment: './csv/comment',
};

const MENU_OPTIONS = {
    INSERT_RESIDENCE: '1',
    INSERT_PRICE: '2',
    INSERT_COMMENT: '3',
};

async function createDirectories() {
    await Promise.all(
        Object.values(directories).map((dir) => fs.promises.mkdir(dir, { recursive: true }))
    );
}

function getCsvFilesPaths(directory) {
    try {
        const csvFiles = fs
            .readdirSync(directory)
            .filter((file) => path.extname(file).toLowerCase() === '.csv');

        if (csvFiles.length === 0) {
            console.log(`No CSV files found in ${directory}`);
            return [];
        }

        return csvFiles.map((p) => path.join(directory, p));
    } catch (error) {
        console.error(`Error reading directory ${directory}:`, error);
    }
}

async function main() {
    await createDirectories();

    const menuString = `=========================== Menu ===========================
        1 - Insert Residence
        2 - Insert Price
        3 - Insert Comment`;

    console.log(menuString);
    const userInput = prompt('Enter your choice (1-3): ')?.trim();

    switch (userInput) {
        case MENU_OPTIONS.INSERT_RESIDENCE:
            for (const csvPath of getCsvFilesPaths(directories.residence)) {
                await residence(csvPath);
                // fs.unlinkSync(csvPath);
            }
            break;

        case MENU_OPTIONS.INSERT_PRICE:
            for (const csvPath of getCsvFilesPaths(directories.price)) {
                await price(csvPath);
            }
            break;

        case MENU_OPTIONS.INSERT_COMMENT:
            for (const csvPath of getCsvFilesPaths(directories.comment)) {
                await comment(csvPath);
            }
            break;

        default:
            console.log('You entered an invalid input!');
            break;
    }
}

main();
