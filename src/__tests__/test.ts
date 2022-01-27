import { UnitOptions } from '@services/unitSelection';
import setEquals from '@testing/setEquals';

let a = new UnitOptions();
test('[findUnitsRecursively] Outputs correctly for unit with single prerequisite.', () => {
    let data = [[], [0]];

    let received = a.findUnitsRecursively([1], data);
    let expected = new Set<number>([0, 1]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for unit with multiple prerequisites.', () => {
    let data = [[], [0], [0, 1]];

    let received = a.findUnitsRecursively([2], data);
    let expected = new Set<number>([0, 1, 2]);

    expect(setEquals(received, expected)).toBeTruthy();
});
