const TiltifyClient = require('tiltify-api-client');

client = new TiltifyClient(process.env.TILTIFY_ACCESS_TOKEN);

const getTotal = () => new Promise(resolve => {
    client.Team.getCampaigns('5225', data => {
        resolve(data
            .filter(campaign => campaign.status === 'published' && campaign.type === 'Event')
            .reduce((acc, campaign) => acc + campaign.totalAmountRaised, 0));
    });
});

const formatTotal = total => total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatIncrease = (oldTotal, newTotal) => {
    if (!oldTotal) return '';

    const diff = newTotal - oldTotal;
    return diff === 0 ? '' : (' | ' + (diff < 0 ? '-' : '+') + '£' + formatTotal(diff));
};

const formatDate = () => (new Date()).toLocaleString('en-GB', { timeZone: 'UTC' });

let previousTotal = null;

const logTotal = () => new Promise(resolve => {
    getTotal().then(total => {
        console.log(`${formatDate()} | £${formatTotal(total)}${formatIncrease(previousTotal, total)}`);
        previousTotal = total;
        resolve();
    });
});

setInterval(logTotal, 60 * 1000);
