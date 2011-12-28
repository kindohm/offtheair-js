var audioDevice, oscillator1, oscillator2, lfo1, lfo2, playing;
var channelCount = 2;

$(document).ready(function () {
    updateCenter();
    $(window).resize(function () { updateCenter(); });
    hideControls();
    $('#container').mouseenter(function () { showControls(); });
    $('#container').mouseleave(function () { hideControls(); });
    setUpSliders();
    buildAudio();
});

function hideControls() {
    $('#controlOverlay').css('visibility', 'hidden');
}

function showControls() {
    $('#controlOverlay').css('visibility', 'visible');
}

function setUpSliders() {

    $('#osc1HzSlider').slider({
        orientation: 'vertical',
        min: 40,
        max: 1000,
        value: 440,
        change: function (event, ui) { oscillator1.frequency = ui.value; }
    });

    $('#lfo1HzSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 1000,
        value: 2,
        change: function (event, ui) { lfo1.frequency = ui.value; }
    });

    $('#osc2HzSlider').slider({
        orientation: 'vertical',
        min: 40,
        max: 1000,
        value: 440,
        change: function (event, ui) { oscillator2.frequency = ui.value; }
    });

    $('#lfo2HzSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 1000,
        value: 1,
        change: function (event, ui) { lfo2.frequency = ui.value; }
    });
}

function updateCenter() {
    var doc = $(document);
    var content = $('#container');
    var top = doc.height() / 2.0 - content.height() / 2.0;
    var left = doc.width() / 2.0 - content.width() / 2.0;
    content.offset({ top: top, left: left });
}

function buildAudio() {
    audioDevice = audioLib.AudioDevice(audioCallback, channelCount);
    oscillator1 = audioLib.Oscillator(audioDevice.sampleRate, $('#osc1HzSlider').slider('value'));
    oscillator2 = audioLib.Oscillator(audioDevice.sampleRate, $('#osc2HzSlider').slider('value'));
    lfo1 = audioLib.Oscillator(audioDevice.sampleRate, 1);
    lfo2 = audioLib.Oscillator(audioDevice.sampleRate, 2);

    oscillator1.addAutomation('frequency', lfo1, .25, 'additiveModulation');
    oscillator2.addAutomation('frequency', lfo2, .55, 'additiveModulation');
}

function audioCallback(buffer, channelCount) {
    var l = buffer.length, current;
    
    for (current = 0; current < l; current += channelCount) {
        lfo1.generate();
        lfo2.generate();
        oscillator1.generate();
        oscillator2.generate();
        buffer[current] = oscillator1.getMix();
        buffer[current + 1] = oscillator2.getMix();
    }
}