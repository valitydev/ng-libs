import { Value } from '../../value';
import { unknownToString } from '../../value/utils/unknown-to-string';
import { valueToString } from '../../value/utils/value-to-string';

export function tableToCsvObject(cols: Value[], data: Value[][][]): string[][] {
    const res = [
        cols
            .map((v) => {
                const res = valueToString(v);
                return [res, `${res} (description)`];
            })
            .flat(),
    ];
    for (const r of data) {
        // flatten nested rows
        const rowRes: string[][] = [[]];
        for (let i = 0; i < r.length; ++i) {
            const cell = r[i];
            const cellValues = cell.map((v) => [valueToString(v), unknownToString(v.description)]);
            if (cellValues.length > 1 && rowRes.length === 1) {
                while (cellValues.length > rowRes.length) {
                    rowRes.push(rowRes[0].slice());
                }
            }
            if (cellValues.length === 1 && rowRes.length > 1) {
                for (let j = 0; j < rowRes.length; ++j) {
                    rowRes[j].push(...cellValues[0]);
                }
            } else {
                for (let j = 0; j < cellValues.length; ++j) {
                    rowRes[j].push(...cellValues[j]);
                }
            }
        }
        res.push(...rowRes);
    }
    // Removing empty description columns (every second column)
    let emptyCols = [];
    for (
        let i = 1;
        i < res[0].length;
        i += 2 // description - every second column
    ) {
        let isEmpty = true;
        for (
            let j = 1; // ignore header row
            j < res.length;
            ++j
        ) {
            if (res[j][i]) {
                isEmpty = false;
                break;
            }
        }
        if (isEmpty) {
            emptyCols.push(i);
        }
    }
    emptyCols = emptyCols.reverse();
    for (const i of emptyCols) {
        for (let j = 0; j < res.length; ++j) {
            res[j].splice(i, 1);
        }
    }
    return res;
}
