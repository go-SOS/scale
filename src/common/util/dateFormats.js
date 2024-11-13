// utils/dateFormats.js
const dateFormats = [
    { key: 'MM/dd/yyyy', value: 'MM/dd/yyyy  (12/31/2099)' },
    { key: 'dd/MM/yyyy', value: 'dd/MM/yyyy  (31/12/2099)' },
    { key: 'yyyy-MM-dd', value: 'yyyy-MM-dd  (2099-12-31)' },
    { key: 'dd MMMM yyyy', value: 'dd MMMM yyyy  (31 December 2099)' },
    { key: 'MMMM dd, yyyy', value: 'MMMM dd, yyyy  (December 31, 2099)' },
    { key: 'EEE, MMM dd, yyyy', value: 'EEE, MMM dd, yyyy  (Tue, Dec 31, 2099)' },
    { key: 'yyyy/MM/dd', value: 'yyyy/MM/dd  (2099/12/31)' },
    { key: 'MM-dd-yyyy', value: 'MM-dd-yyyy  (12-31-2099)' },
    { key: 'dd-MM-yyyy', value: 'dd-MM-yyyy  (31-12-2099)' },
];

export default dateFormats;
