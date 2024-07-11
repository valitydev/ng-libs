import { Value } from '../../value';
import { unknownToString } from '../../value/utils/unknown-to-string';
import { valueToString } from '../../value/utils/value-to-string';

export function tableToCsvObject(cols: Value[], data: Value[][]): string[][] {
    const res = [
        cols
            .map((v) => {
                const res = valueToString(v);
                return [res, `${res} (description)`];
            })
            .flat(),
        ...data.map((r) => r.map((c) => [valueToString(c), unknownToString(c.description)]).flat()),
    ];
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
