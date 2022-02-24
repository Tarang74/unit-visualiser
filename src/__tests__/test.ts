import { UnitOptions } from '@services/unitSelection';
import setEquals from '@testing/setEquals';

const a = new UnitOptions();
test('[findUnitsRecursively] Outputs correctly for unit with no prerequisite.', () => {
    const data = [[], []];

    const received = a.findPrerequisitesRecursively([1], data);
    const expected = new Set<number>([1]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for unit with single prerequisite.', () => {
    const data = [[], [0]];

    const received = a.findPrerequisitesRecursively([1], data);
    const expected = new Set<number>([0, 1]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for unit with multiple prerequisites as disjunctions.', () => {
    const data = [[], [0], [0, 1]];

    const received = a.findPrerequisitesRecursively([2], data);
    const expected = new Set<number>([0, 1, 2]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for unit with multiple prerequisites as disjunctions containing conjunctions.', () => {
    const data = [[], [0], [], [[2], [0, 1]]];

    const received = a.findPrerequisitesRecursively([3], data);
    const expected = new Set<number>([0, 1, 2, 3]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for multiple units with single prerequisite.', () => {
    const data = [[], [0], [], [2], [3], [4]];

    const received = a.findPrerequisitesRecursively([1, 5], data);
    const expected = new Set<number>([0, 1, 2, 3, 4, 5]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for multiple units with multiple prerequisites as disjunctions.', () => {
    const data = [[], [0], [0, 1], [], [3], [], [1, 4]];

    const received = a.findPrerequisitesRecursively([1, 2, 6], data);
    const expected = new Set<number>([0, 1, 2, 3, 4, 6]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for unit with multiple prerequisites as disjunctions containing conjunctions.', () => {
    const data = [[], [0], [], [[2], [0, 1]], [3, [0, 1, 2]]];

    const received = a.findPrerequisitesRecursively([3, 4], data);
    const expected = new Set<number>([0, 1, 2, 3, 4]);

    expect(setEquals(received, expected)).toBeTruthy();
});
