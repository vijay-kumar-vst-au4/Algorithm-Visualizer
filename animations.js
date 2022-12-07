function getSequencialSearchAnimations(searchNumber, array) {
    let animationArr = []
    for (let i = 0; i < array.length; ++i) {
        if (searchNumber === array[i]) {
            animationArr.push({
                pos: i,
                found: true,
            })

            return animationArr
        } else {
            animationArr.push({
                pos: i,
            })
        }
    }
    animationArr.push({
        pos: array.length - 1,
        found: false
    })

    return animationArr
}

// Algorithms for animations
function getBinarySearchAnimations(searchNumber, sortedArray) {
    let animationArr =  []

    let lowIndex = 0
    let highIndex = sortedArray.length - 1
    let midIndex
    animationArr.push({
        lowIndex,
        highIndex,
        status: 'compare',
    })
    while (lowIndex <= highIndex) {
        midIndex = Math.floor((lowIndex + highIndex) / 2)
        animationArr.push({
            midIndex,
            status: 'select'
        })
        if (sortedArray[midIndex] == searchNumber) {
            animationArr.push({
                midIndex,
                status: 'found'
            })
            return animationArr
        } else if (sortedArray[midIndex] < searchNumber) {
            lowIndex = midIndex + 1
            animationArr.push({
                lowIndex,
                highIndex,
                status: 'compare',
            })
        } else {
            highIndex = midIndex - 1
            animationArr.push({
                lowIndex,
                highIndex,
                status: 'compare',
            })
        }
    }
    animationArr.push({
        lowIndex,
        midIndex,
        highIndex,
        status: 'not-found',
    })
    return animationArr;
}

function getBubbleSortAnimations(inputArr) {
    let animationArr = []
    let len = inputArr.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < len - 1; i++) {
            animationArr.push({
                posI: i,
                posJ: i + 1,
                status: 'compare',
            })
            if (inputArr[i] > inputArr[i + 1]) {
                animationArr.push({
                    posI: i,
                    posJ: i + 1,
                    status: 'swap',
                })  
                let tmp = inputArr[i];
                inputArr[i] = inputArr[i + 1];
                inputArr[i + 1] = tmp;
                swapped = true;
            }
        }
    } while (swapped);
    return animationArr;
}

function getSelectionSortAnimations(inputArr) {
    let animationArr = []
    let len = inputArr.length;
    for (let i = 0; i < len; i++) {
        let min = i
        animationArr.push({
            min: i,
            status: 'select-min',
        })
        for (let j = i + 1; j < len; j++) {
            animationArr.push({
                min,
                j,
                status: 'compare'
            })
            if (inputArr[min] > inputArr[j]) {
                animationArr.push({
                    min: j,
                    status: 'select-min',
                })
                min = j
            }
        }

        if (min !== i) {
            animationArr.push({
                min,
                i,
                status: 'swap'
            })
            let tmp = inputArr[i]
            inputArr[i] = inputArr[min]
            inputArr[min] = tmp
        }
    }
    return animationArr
}