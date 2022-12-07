// constants
const BG_COLOR = 'cyan';
const COMPARE_COLOR = 'blue';
const FOUND_COLOR = 'red';
const SELECT_COLOR = 'green';
const BOOL_FALSE   = false;
const BOOL_TRUE    = true;
const RED_COLOR    = "#ff0000";
const GREEN_COLOR  = "#00ff00";
const MIN_NUM_RANGE = 0;
const CLASS_NAME_BAR = 'bar';
const TEXT_PX = 'px';
const TEXT_DIV = 'div';
const TEXT_FAIL = 'fail';
const INPUT_FAILURE_MESSAGE = 'Input dataset size must be minimum 5';
const TEXT_DATASET_SIZE = 'dataset-size'
const TEXT_LINES_CONTAINER = 'lines-container';
const TEXT_SEARCH_NUMBER = 'search-number';
const TEXT_GENERATE_ARRAY = 'generate-array';
const TEXT_LINEAR_SEARCH = 'linear-search';
const TEXT_BINARY_SEARCH = 'binary-search';
const TEXT_BUBBLE_SORT   = 'bubble-sort';
const TEXT_SELECTION_SORT = 'selection-sort';
const TEXT_SHOW  = 'show';
const TEXT_TOAST  = "toast";
const TEXT_TOAST_DESC =  "toast-desc";
const TEXT_TOAST_ICON = "toast-icon";
const TEXT_SUCCESS = 'success'
const TOAST_SUCCESS_TYPE = 'fa fa-2x fa-check-circle' ;
const TOAST_FAILURE_TYPE = 'fa fa-2x fa-exclamation-circle';
const TEXT_EMPTY = '';
const MIN_INPUT_SIZE = 5;
const FOUND_MESSAGE = 'Found on position: ';
const TEXT_NOT_FOUND  ='Not found';
const TEXT_COMPARE = 'compare';
const AVG_SLEEP_TIME   = 1000;
const LONG_SLEEP_TIME  = 5000;
const SHORT_SLEEP_TIME      = 500;
const ONE  = 1;
const SORTING_SUCCESS_MSG = 'Finshed sorting!';
const TEXT_SWAP = 'swap';
const TEXT_FOUND = 'found';
const TEXT_NOT_FOUND_PROP = 'not-found';
const TEXT_FOUND_MSG = 'Found at index: ';
const SMALL_MULTIPLIER = 3;
const LARGE_MULTIPLIER = 5;
// utils
function getRandomNumber(min, max) {
    let random = Math.floor(Math.random() * (max - min + ONE)) + min;
    return random;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Project utitlity functions

function setInactiveInteractions(activeStatus) {
    document.getElementById(TEXT_DATASET_SIZE).disabled = activeStatus;
    document.getElementById(TEXT_SEARCH_NUMBER).disabled = activeStatus;
    document.getElementById(TEXT_GENERATE_ARRAY).disabled = activeStatus;
    document.getElementById(TEXT_LINEAR_SEARCH).disabled = activeStatus;
    document.getElementById(TEXT_BINARY_SEARCH).disabled = activeStatus;
    document.getElementById(TEXT_BUBBLE_SORT).disabled = activeStatus;
    document.getElementById(TEXT_SELECTION_SORT).disabled = activeStatus;
}

function enableInteractions() {
    setInactiveInteractions(BOOL_FALSE);
}

function disableInteractions() {
    setInactiveInteractions(BOOL_TRUE);
}

function toast(type, desc) {
    let toast = document.getElementById(TEXT_TOAST);
    let toastDesc = document.getElementById(TEXT_TOAST_DESC);
    let toastIcon = document.getElementById(TEXT_TOAST_ICON);
    
    toast.className = TEXT_SHOW;
    toastDesc.innerText = desc;
    toastIcon.className = type === TEXT_SUCCESS ? TOAST_SUCCESS_TYPE: TOAST_FAILURE_TYPE;
    toastIcon.style.color = type === TEXT_SUCCESS ? GREEN_COLOR : RED_COLOR;

    setTimeout(() => { toast.className = toast.className.replace(TEXT_SHOW, TEXT_EMPTY); }, LONG_SLEEP_TIME);
}

let datasetSize, pivot, array = [];

function handleDatasetSizeChange() {

    datasetSize = Number(document.getElementById(TEXT_DATASET_SIZE).value);
    if (!datasetSize || datasetSize < MIN_INPUT_SIZE) {
        toast(TEXT_FAIL, INPUT_FAILURE_MESSAGE);
        document.getElementById(TEXT_DATASET_SIZE).focus();
        datasetSize = null;
        return;
    }
}

function handleSearchNumberChange() {
    pivot = Number(document.getElementById(TEXT_SEARCH_NUMBER).value) >= MIN_INPUT_SIZE ? Number(document.getElementById(TEXT_SEARCH_NUMBER).value) : MIN_INPUT_SIZE;
    document.getElementById(TEXT_SEARCH_NUMBER).value = pivot;
}

function generateArray() {
    
    if (!datasetSize || datasetSize < MIN_INPUT_SIZE) {
        toast(TEXT_FAIL, INPUT_FAILURE_MESSAGE);
        document.getElementById(TEXT_DATASET_SIZE).focus();
        return;
    }
    let lineContainerElement = document.getElementById(TEXT_LINES_CONTAINER);

    // Remove Present Children
    let child = lineContainerElement.lastElementChild;  
    while (child) { 
        lineContainerElement.removeChild(child); 
        child = lineContainerElement.lastElementChild; 
    }
    array = [];

    // Add new Children
    for (let i = MIN_NUM_RANGE; i < datasetSize; ++i) {
        let randomNumber = getRandomNumber(MIN_NUM_RANGE, datasetSize);
        array.push(randomNumber);
        let  div = document.createElement(TEXT_DIV);
        div.className = 'bar-container';
        let lineElement = document.createElement(TEXT_DIV);
        lineElement.className = CLASS_NAME_BAR;
        let multiplier = array.length <= 50 ? LARGE_MULTIPLIER : SMALL_MULTIPLIER;
        lineElement.style.height = randomNumber * multiplier + TEXT_PX;
        let textDiv = document.createElement(TEXT_DIV);
        textDiv.innerHTML = randomNumber;
        div.appendChild(lineElement);
        div.appendChild(textDiv);
        lineContainerElement.appendChild(div);
    }
}

async function doLinearSearch() {
    if (!pivot) {
        toast(TEXT_FAIL, INPUT_FAILURE_MESSAGE)
        document.getElementById(TEXT_SEARCH_NUMBER).focus()
        return
    }

    if (!array.length) {
        toast(TEXT_FAIL, TEXT_GENERATE_ARRAY)
        document.getElementById(TEXT_GENERATE_ARRAY).focus()
        return
    }

    disableInteractions()

    let animationArr = getSequencialSearchAnimations(pivot, [...array])
    let lineContainerChildElements = Array.from(document.getElementById(TEXT_LINES_CONTAINER).children)
    let previous
    for (let i = MIN_NUM_RANGE; i < animationArr.length; ++i) {
        let animation = animationArr[i]
        await sleep(SHORT_SLEEP_TIME)
        
        if (Number.isInteger(previous)) {
            lineContainerChildElements[previous].style.backgroundColor = BG_COLOR;
        }
        
        if (animation.found === BOOL_TRUE) {
            lineContainerChildElements[animation.pos].style.backgroundColor = FOUND_COLOR;
            toast(TEXT_SUCCESS, FOUND_MESSAGE + animation.pos);
            break
        } else if (animation.found === BOOL_FALSE) {
            lineContainerChildElements[animation.pos].style.backgroundColor = BG_COLOR;
            toast(TEXT_FAIL, TEXT_NOT_FOUND);
            enableInteractions();
            break;
        } else {
            lineContainerChildElements[animation.pos].style.backgroundColor = SELECT_COLOR;
            previous = animation.pos;
        }
    }

    enableInteractions();
}

async function doBinarySearch() {
    if (!pivot) {
        toast(TEXT_FAIL, TEXT_SEARCH_NUMBER);
        document.getElementById(TEXT_SEARCH_NUMBER).focus();
        return;
    }

    if (!array.length) {
        toast(TEXT_FAIL, TEXT_GENERATE_ARRAY);
        document.getElementById(TEXT_GENERATE_ARRAY).focus();
        return;
    }

    disableInteractions();

    let lineContainerChildElements = Array.from(document.getElementById(TEXT_LINES_CONTAINER).children).slice();
    // Sort array and dom elements before performing binary search
    array.sort((a, b) => a - b);
    lineContainerChildElements.sort((a, b) => parseInt(a.style.height) - parseInt(b.style.height));

    let lineContainerElement = document.getElementById(TEXT_LINES_CONTAINER);

    // Remove Present Children
    let child = lineContainerElement.lastElementChild;
    while (child) { 
        lineContainerElement.removeChild(child); 
        child = lineContainerElement.lastElementChild; 
    }

    // Append the sorted childs
    for (let i = MIN_NUM_RANGE; i < array.length; ++i) {
        let  div = document.createElement(TEXT_DIV);
        div.className = 'bar-container';
        let lineElement = document.createElement(TEXT_DIV);
        lineElement.className = CLASS_NAME_BAR;
        let multiplier = array.length <= 50 ? LARGE_MULTIPLIER : SMALL_MULTIPLIER;
        lineElement.style.height = array[i]*multiplier + TEXT_PX;
        let textDiv = document.createElement(TEXT_DIV);
        textDiv.innerHTML = array[i];
        div.appendChild(lineElement);
        div.appendChild(textDiv);
        lineContainerElement.appendChild(div);
    }

    await sleep(AVG_SLEEP_TIME);

    let animationArr = getBinarySearchAnimations(pivot, array);
    let previous;
    lineContainerChildElements = Array.from(document.getElementById(TEXT_LINES_CONTAINER).children);
    
    for (let i = MIN_NUM_RANGE; i < animationArr.length; ++i) {
        const animation = animationArr[i];
        await sleep(SHORT_SLEEP_TIME);
        if (previous) {
            if (previous.status === TEXT_COMPARE) {
                lineContainerChildElements[previous.lowIndex].style.backgroundColor = BG_COLOR;
                previous.highIndex >= MIN_NUM_RANGE && (lineContainerChildElements[previous.highIndex].style.backgroundColor = BG_COLOR);
            } else {
                lineContainerChildElements[previous.midIndex].style.backgroundColor = BG_COLOR;
            }
        }

        if (animation.status === TEXT_FOUND) {
            lineContainerChildElements[animation.midIndex].style.backgroundColor = FOUND_COLOR;
            toast(TEXT_SUCCESS,  TEXT_FOUND_MSG + animation.midIndex);
            break;
        } else if (animation.status === TEXT_NOT_FOUND_PROP) {
            lineContainerChildElements[animation.lowIndex].style.backgroundColor = BG_COLOR;
            lineContainerChildElements[animation.midIndex].style.backgroundColor = BG_COLOR;
            animation.highIndex >= MIN_NUM_RANGE && (lineContainerChildElements[animation.highIndex].style.backgroundColor = BG_COLOR);
            toast(TEXT_FAIL, TEXT_NOT_FOUND);
            break;
        } else if (animation.status === TEXT_COMPARE) {
            lineContainerChildElements[animation.lowIndex].style.backgroundColor = COMPARE_COLOR;
            animation.highIndex >= MIN_NUM_RANGE && (lineContainerChildElements[animation.highIndex].style.backgroundColor = COMPARE_COLOR);
            await sleep(SHORT_SLEEP_TIME);
        } else {
            lineContainerChildElements[animation.midIndex].style.backgroundColor = SELECT_COLOR;
        }

        previous = animation;
    }

    enableInteractions();
}

async function doBubbleSort() {
    if (!array.length) {
        toast(TEXT_FAIL, TEXT_GENERATE_ARRAY);
        document.getElementById(TEXT_GENERATE_ARRAY).focus();
        return
    }

    disableInteractions();

    let lineContainerChildElements = Array.from(document.getElementById(TEXT_LINES_CONTAINER).children);
    let animationArr = getBubbleSortAnimations(array);
    let previous;

    for (let i = MIN_NUM_RANGE; i < animationArr.length; ++i) {
        await sleep(SHORT_SLEEP_TIME)
        if (previous) {
            lineContainerChildElements[previous.posI].style.backgroundColor = BG_COLOR;
            lineContainerChildElements[previous.posJ].style.backgroundColor = BG_COLOR;
        }
        const animation = animationArr[i];

        if (animation.status === TEXT_COMPARE) {
            lineContainerChildElements[animation.posI].style.backgroundColor = COMPARE_COLOR;
            lineContainerChildElements[animation.posJ].style.backgroundColor = COMPARE_COLOR;
        } else {
            lineContainerChildElements[animation.posI].style.backgroundColor = SELECT_COLOR;
            lineContainerChildElements[animation.posJ].style.backgroundColor = SELECT_COLOR;
            await sleep(SHORT_SLEEP_TIME);
            const tempHeight = lineContainerChildElements[animation.posI].children[0].style.height;
            const tempText = lineContainerChildElements[animation.posI].children[1].innerHTML;
            lineContainerChildElements[animation.posI].children[0].style.height = lineContainerChildElements[animation.posJ].children[0].style.height;
            lineContainerChildElements[animation.posI].children[1].innerHTML = lineContainerChildElements[animation.posJ].children[1].innerHTML
            lineContainerChildElements[animation.posJ].children[0].style.height = tempHeight;
            lineContainerChildElements[animation.posJ].children[1].innerHTML = tempText;
        }

        previous = animation;
    }

    if (previous) {
        lineContainerChildElements[previous.posI].style.backgroundColor = BG_COLOR;
        lineContainerChildElements[previous.posJ].style.backgroundColor = BG_COLOR;
    }

    enableInteractions();
    toast(TEXT_SUCCESS, SORTING_SUCCESS_MSG);
}

async function doSelectionSort() {
    if (!array.length) {
        toast(TEXT_FAIL, TEXT_GENERATE_ARRAY);
        document.getElementById(TEXT_GENERATE_ARRAY).focus();
        return;
    }

    disableInteractions();

    let lineContainerChildElements = Array.from(document.getElementById(TEXT_LINES_CONTAINER).children);
    let animationArr = getSelectionSortAnimations(array);
    let previous;

    for (let i = MIN_NUM_RANGE; i < animationArr.length; ++i) {
        await sleep(300);
        if (previous) {
            Number.isInteger(previous.min) && (lineContainerChildElements[previous.min].style.backgroundColor = BG_COLOR);
            Number.isInteger(previous.j) && (lineContainerChildElements[previous.j].style.backgroundColor = BG_COLOR);
            Number.isInteger(previous.i) && (lineContainerChildElements[previous.i].style.backgroundColor = BG_COLOR);
        }
        const animation = animationArr[i];
        if (animation.status === TEXT_COMPARE) {
            lineContainerChildElements[animation.min].style.backgroundColor = COMPARE_COLOR;
            lineContainerChildElements[animation.j].style.backgroundColor = COMPARE_COLOR;
        } else if (animation.status === TEXT_SWAP) {
            lineContainerChildElements[animation.min].style.backgroundColor = SELECT_COLOR;
            lineContainerChildElements[animation.i].style.backgroundColor = SELECT_COLOR;
            await sleep(SHORT_SLEEP_TIME);
            const tempHeight = lineContainerChildElements[animation.min].children[0].style.height;
            const tempText = lineContainerChildElements[animation.min].children[1].innerHTML;
            lineContainerChildElements[animation.min].children[0].style.height = lineContainerChildElements[animation.i].children[0].style.height;
            lineContainerChildElements[animation.min].children[1].innerHTML = lineContainerChildElements[animation.i].children[1].innerHTML;
            lineContainerChildElements[animation.i].children[0].style.height = tempHeight;
            lineContainerChildElements[animation.i].children[1].innerHTML = tempText;
        } else {
            lineContainerChildElements[animation.min].style.backgroundColor = FOUND_COLOR;
        }

        previous = animation;
    }

    if (previous) {
        Number.isInteger(previous.min) && (lineContainerChildElements[previous.min].style.backgroundColor = BG_COLOR);
        Number.isInteger(previous.j) && (lineContainerChildElements[previous.j].style.backgroundColor = BG_COLOR);
        Number.isInteger(previous.i) && (lineContainerChildElements[previous.i].style.backgroundColor = BG_COLOR);
    }
    enableInteractions();
    toast(TEXT_SUCCESS, SORTING_SUCCESS_MSG);
}