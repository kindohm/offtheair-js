var audioDevice, oscillator1, oscillator2, lfo1, lfo2, playing;
var channelCount = 2;
var chorus;
var lfo1Amount = 0;
var lfo2Amount = 0;
var volume = .5;

$(document).ready(function () {
    updateCenter();
    $(window).resize(function () { updateCenter(); });
    hideControls();
    $('#container').mouseenter(function () { showControls(); });
    $('#container').mouseleave(function () { hideControls(); });
    initControls();
    buildAudio();
});

function hideControls() {
    $('#controlOverlay').css('visibility', 'hidden');
}

function showControls() {
    $('#controlOverlay').css('visibility', 'visible');
}

function initControls() {

    $('#osc1HzSlider').slider({
        orientation: 'vertical',
        min: 40,
        max: 1000,
        value: 440,
        change: function (event, ui) { oscillator1.frequency = ui.value; }
	, slide: function (event, ui) { oscillator1.frequency = ui.value; }
    });

    $('#lfo1HzSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 100,
        value: 0,
        change: function (event, ui) { lfo1.frequency = ui.value; },
        slide: function (event, ui) { lfo1.frequency = ui.value; },
        step: .1
    });

    $('#lfo1AmountSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 1,
        value: 0,
        change: function (event, ui) { lfo1Amount = ui.value; },
        slide: function (event, ui) { lfo1Amount = ui.value; },
        step: .01
    });


    $('#osc2HzSlider').slider({
        orientation: 'vertical',
        min: 40,
        max: 1000,
        value: 440,
        change: function (event, ui) { oscillator2.frequency = ui.value; },
        slide: function (event, ui) { oscillator2.frequency = ui.value; }
    });

    $('#lfo2HzSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 100,
        value: 0,
        change: function (event, ui) { lfo2.frequency = ui.value; },
        slide: function (event, ui) { lfo2.frequency = ui.value; }
    });

    $('#lfo2AmountSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 1,
        value: 0,
        change: function (event, ui) { lfo2Amount = ui.value; },
        slide: function (event, ui) { lfo2Amount = ui.value; },
        step: .01
    });

    $('#volumeSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 1,
        value: .5,
        step: .01,
        slide: function (event, ui) { volume = ui.value; },
        change: function (event, ui) { volume = ui.value; }
    });

    $('#waveFormButton').click(function () {
        oscillator1.waveShape = getNextWaveShape(oscillator1.waveShape);
        oscillator2.waveShape = oscillator1.waveShape;
        $('#waveFormButton').text(oscillator1.waveShape);

    });

    $('#lfo1WaveFormButton').click(function () {
        lfo1.waveShape = getNextWaveShape(lfo1.waveShape);
        $('#lfo1WaveFormButton').text(lfo1.waveShape);

    });

    $('#lfo2WaveFormButton').click(function () {
        lfo2.waveShape = getNextWaveShape(lfo2.waveShape);
        $('#lfo2WaveFormButton').text(lfo2.waveShape);
    });
}

function getNextWaveShape(shape) {
    switch (shape) {
        case 'sine':
            return 'square';
        case 'square':
            return 'triangle';
        case 'triangle':
            return 'sawtooth';
        case 'sawtooth':
            return 'invSawtooth';
        case 'invSawtooth':
            return 'sine';
    }
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
}

function audioCallback(buffer, channelCount) {
    var l = buffer.length, current;

    for (current = 0; current < l; current += channelCount) {
        lfo1.generate();
        lfo2.generate();
        oscillator1.fm = lfo1.getMix() * lfo1Amount;
        oscillator2.fm = lfo2.getMix() * lfo2Amount;
        oscillator1.generate();
        oscillator2.generate();
        buffer[current] = oscillator1.getMix() * volume;
        buffer[current + 1] = oscillator2.getMix() * volume;
    }

}

