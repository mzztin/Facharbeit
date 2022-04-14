/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    const anagrams = new Map();

    for (let i = 0; i < strs.length; i++) {
        const str = strs[i];
        const sorted = [...str].sort().join("");
        const already = anagrams.get(sorted) ?? [];
        already.push(str);

        anagrams.set(sorted, already);
    }

    return [...anagrams.entries()].map((value) => {
        value.shift()
        return value[0];
    })
};