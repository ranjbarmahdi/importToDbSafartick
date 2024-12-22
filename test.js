import moment from 'moment-jalaali';

export const jalaliToGregorianDate = (jalaliDate) => {
    return moment(jalaliDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
};

const gregorianDate = new Date(jalaliToGregorianDate('1403/9/7'));

const validUntil = new Date(new Date(gregorianDate).getTime() + 8 * 60 * 60 * 1000);

console.log(gregorianDate);

console.log(validUntil.toISOString());
