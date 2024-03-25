class AhoCorasickNode {
    constructor() {
        this.children = {};
        this.output = [];
        this.failure = null;
    }
}

class AhoCorasick {
    constructor() {
        this.root = new AhoCorasickNode();
    }

    addPattern(pattern, output) {
        let node = this.root;

        for (const char of pattern) {
            if (!node.children[char]) {
                node.children[char] = new AhoCorasickNode();
            }
            node = node.children[char];
        }

        node.output.push(output);
    }

    buildFailureFunction() {
        const queue = [];

        // Set failure for depth 1 nodes to root
        for (const child in this.root.children) {
            this.root.children[child].failure = this.root;
            queue.push(this.root.children[child]);
        }

        while (queue.length > 0) {
            const currentNode = queue.shift();

            for (const key in currentNode.children) {
                const child = currentNode.children[key];
                queue.push(child);

                let failureNode = currentNode.failure;

                while (failureNode !== null &&
                    !failureNode.children[key]) {
                    failureNode = failureNode.failure;
                }

                child.failure = failureNode ?
                    failureNode.children[key] ||
                    this.root : this.root;

                child.output = child.output.
                concat(child.failure.output);
            }
        }
    }

    search(text, callback) {
        let currentNode = this.root;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            while (currentNode !== null &&
                !currentNode.children[char]) {
                currentNode = currentNode.failure;
            }

            currentNode = currentNode ?
                currentNode.children[char] ||
                this.root : this.root;

            for (const output of currentNode.output) {
                callback(i - output.length + 1, output);
            }
        }
    }
}

function performReplacement() {
    // Use a TreeWalker to find text nodes
    const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    // Iterate over text nodes and replace words
    while (treeWalker.nextNode()) {
        const textNode = treeWalker.currentNode;
        let nodeValue = textNode.nodeValue;

        // Use the Aho-Corasick algorithm to find matches
        ac.search(nodeValue, (index, output) => {
            // Replace the matched word with "hello"
            nodeValue = nodeValue.substring(0, index) + ' hello ' + nodeValue.substring(index + output.length);
        });

        textNode.nodeValue = nodeValue;
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

// Define the word list
const wordsToReplace = ['and', 'of', 'or'];

// Create an Aho-Corasick machine
const ac = new AhoCorasick();

// Add patterns to the Aho-Corasick machine
wordsToReplace.forEach(word => {
	ac.addPattern(" " + word + " ", " " + word + " "); // The output is the word itself for simplicity
});

// Build the failure function
ac.buildFailureFunction();

// Set up the MutationObserver
const observer = new MutationObserver(performReplacement);
observer.observe(document.body, {
	childList: true,
	subtree: true
});

// Perform the initial replacement
performReplacement();
