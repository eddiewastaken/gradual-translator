class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            let char = word[i];
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    search(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            let char = word[i];
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return node.isEndOfWord;
    }
}

function readTextFile(filePath) {
    const url = chrome.runtime.getURL(filePath);

    return fetch(url)
        .then(response => response.text())
        .then(text => text.split('\n'))
        .catch(error => console.error('Error fetching file:', error));
}

function replaceTextInNode(node, wordsToReplace) {
 const text = node.nodeValue;
 const re = new RegExp(`(?:(?<!\\w)\\b(${wordsToReplace.join("|")})\\b(?!\\w))`, "gi");
 node.nodeValue = text.replace(re, function(matched) {
    return "hello";
 });
}

function performFindAndReplace(wordsToReplace) {
 const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
 while (walker.nextNode()) {
    replaceTextInNode(walker.currentNode, wordsToReplace);
 }
}

// Add listener for preference changes by user
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.enable !== undefined) {
        // Use the enable value
        console.log("Enable value:", request.enable);
		enable = request.enable;
    }
    if (request.slider !== undefined) {
        // Use the slider value
        console.log("Slider value:", request.slider);
    }
});

// Main
readTextFile('google-10000-english.txt').then(lines => {
    console.log(lines);

    // Define the word list
    const wordsToReplace = ['and', 'of', 'or'];

    // Create a new Trie
    const trie = new Trie();

    // Add words to the Trie
    for (const word in wordsToReplace) {
        trie.insert(word);
    }

    // Initial find + replace
    performFindAndReplace(wordsToReplace);

    // Register observer with callback for in-place DOM reloading
    const observer = new MutationObserver(() => {
        performFindAndReplace(wordsToReplace);
    });
    observer.observe(document.body, {attributes: false, childList: true, subtree: true});
});