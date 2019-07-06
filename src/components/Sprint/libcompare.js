export function compare(a, b) {
    const wordsA = a.split(/[^A-Za-z0-9ÜüÖöÄä]+/).sort().sort((a, b) => b.length - a.length);
    const wordsB = b.split(', ').sort().sort((a, b) => b.length - a.length);
    while(wordsA.length < wordsB.length) {
        wordsA.push('');
    }
    while(wordsB.length < wordsA.length) {
        wordsB.push('');
    }
    const res = [];
    for(let i = 0; i < wordsA.length; i += 1) {
        let minDist = Infinity;
        let minRes = null;
        let minId = -1;
        for(let j = 0; j < wordsB.length; j += 1) {
            const tmp = compareWord(wordsA[i], wordsB[j]);
            if(tmp.dist < minDist) {
                minDist = tmp.dist;
                minRes = tmp;
                minId = j;
            }
        }
        res.push(minRes);
        wordsB.splice(minId, 1);

    }
    return {
        cmp: res.reduce((a, c) => (a && c.cmp), true),
        res
    }

}
export function compareWord(a, b) {
    const dp = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    for(let i = 0; i <= a.length; i += 1) {
        dp[0][i] = i;
    }
    for(let j = 0; j <= b.length; j += 1) {
        dp[j][0] = j;
    }

    for(let j = 1; j <= b.length; j += 1) {
        for(let i = 1; i <= a.length; i += 1) {
            const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[j][i] = Math.min(
                dp[j][i - 1] + 1,
                dp[j - 1][i] + 1,
                dp[j - 1][i - 1] + indicator,
            );
        }
    }
    let i = a.length;
    let j = b.length;
    let min = dp[j][i];
    let na = '';
    let nb = '';
    while(i > 0 && j > 0) {
        switch(min) {
        case dp[j][i - 1] + 1:
            na = '<span style="background: #ed4041; color: white">' + a[i - 1] + '</span>' + na;
            nb = '<span style="background: #f69f89">&nbsp;</span>' + nb;
            i -= 1;
            break;
        case dp[j - 1][i] + 1:
            na = '<span style="background: #8bdeb4">&nbsp;</span>' + na;
            nb = '<span style="background: #19be6b; color: white">' + b[j - 1] + '</span>' + nb;
            j -= 1;
            break;
        case dp[j - 1][i - 1] + 1:
            na = '<span style="background: #ff9900">' + a[i - 1] + '</span>' + na;
            nb = '<span style="background: #ff9900">' + b[j - 1] + '</span>' + nb;
            i -= 1;
            j -= 1;
            break;
        case dp[j - 1][i - 1]:
            na = a[i - 1] + na;
            nb = b[j - 1] + nb;
            i -= 1;
            j -= 1;
            break;
        default:
            throw new Error('invilid');
        }
        min = dp[j][i];
    }
    while(i > 0) {
        na = '<span style="background: #f69f89; color: white">' + a[i - 1] + '</span>' + na;
        nb = '<span style="background: #8bdeb4">&nbsp;</span>' + nb;
        i -= 1;
    }
    while(j > 0) {
        na = '<span style="background: #8bdeb4">&nbsp;</span>' + na;
        nb = '<span style="background: #19be6b; color: white">' + b[j - 1] + '</span>' + nb;
        j -= 1;
    }
    return {
        cmp: Math.ceil(b.length / 5) >= dp[b.length][a.length],
        diff: {
            na,
            nb
        },
        dist: dp[b.length][a.length],
        distAllowed: Math.ceil(b.length / 5)
    };
}
