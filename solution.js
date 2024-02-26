const fs = require('fs');
const readline = require('readline');
const { performance } = require('perf_hooks');

function findMaxMinMedianMeanAndSequences(filePath) {
    let numbers = [];
    let maxNum = -Infinity;
    let minNum = Infinity;
    let sum = 0;
    let count = 0;
    let increasingSequence = [];
    let decreasingSequence = [];
    let startTime = performance.now();

    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    rl.on('line', line => {
        const lineNumbers = line.trim().split(' ').map(Number);
        numbers.push(...lineNumbers);
        for (const num of lineNumbers) {
            if (num > maxNum) {
                maxNum = num;
            }
            if (num < minNum) {
                minNum = num;
            }
            sum += num;
            count++;

            if (num > (increasingSequence.length > 0 ? increasingSequence[increasingSequence.length - 1] : -Infinity)) {
                increasingSequence.push(num);
            } else {
                if (increasingSequence.length > 1 && increasingSequence.length > longestIncreasingSequence.length) {
                    longestIncreasingSequence = [...increasingSequence];
                }
                increasingSequence = [num];
            }

            if (num < (decreasingSequence.length > 0 ? decreasingSequence[decreasingSequence.length - 1] : Infinity)) {
                decreasingSequence.push(num);
            } else {
                if (decreasingSequence.length > 1 && decreasingSequence.length > longestDecreasingSequence.length) {
                    longestDecreasingSequence = [...decreasingSequence];
                }
                decreasingSequence = [num];
            }
        }
    });

    return new Promise((resolve, reject) => {
        rl.on('close', () => {
            numbers.sort((a, b) => a - b);
            const n = numbers.length;
            let median;
            if (n % 2 === 0) {
                median = (binarySearch(numbers, n / 2 - 1) + binarySearch(numbers, n / 2)) / 2;
            } else {
                median = binarySearch(numbers, Math.floor(n / 2));
            }
            const mean = sum / count;
            let endTime = performance.now();
            let executionTime = endTime - startTime;
            resolve([maxNum, minNum, median, mean, longestIncreasingSequence, longestDecreasingSequence, executionTime]);
        });

        rl.on('error', reject);
    });
}

function binarySearch(arr, targetIndex) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (mid === targetIndex) {
            return arr[mid];
        } else if (mid < targetIndex) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return null;
}

const filePath = '10m.txt';
let longestIncreasingSequence = [];
let longestDecreasingSequence = [];
findMaxMinMedianMeanAndSequences(filePath)
    .then(([maxNum, minNum, median, mean, longestIncreasingSeq, longestDecreasingSeq, executionTime]) => {
        console.log("Максимальне число:", maxNum);
        console.log("Мінімальне число:", minNum);
        console.log("Медіана:", median);
        console.log("Середнє арифметичне значення:", mean);
        console.log("Найбільша зростаюча послідовність:", longestIncreasingSeq);
        console.log("Найбільша спадна послідовність:", longestDecreasingSeq);
        console.log("Час виконання:", executionTime.toFixed(2), "мс");
    })
    .catch(err => {
        console.error("Сталася помилка:", err);
    });