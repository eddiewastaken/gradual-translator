document.getElementById('enable').addEventListener('change', sendValues);
document.getElementById('slider').addEventListener('input', sendValues);

function sendValues() {
    const enableValue = document.getElementById('enable').checked;
    const sliderValue = document.getElementById('slider').value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {enable: enableValue, slider: sliderValue});
    });
}