// Facilitate sending the values to content.js
document.getElementById('save').addEventListener('click', sendValues);

function sendValues() {
    const enableValue = document.getElementById('enable').checked;
    const sliderValue = document.getElementById('slider').value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {enable: enableValue, slider: sliderValue});
    });
}

// Update the value shown next to the slider when changed
document.addEventListener('DOMContentLoaded', function() {
    var slider = document.getElementById('slider');
    var display = document.getElementById('sliderValueDisplay');

    slider.addEventListener('input', function() {
        display.textContent = "Translation percentage: " + this.value + "%";
    });
});