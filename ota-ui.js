var audioDevice, oscillator1, oscillator2, lfo1, lfo2, playing;
var channelCount = 2;
var lfo1Amount = 0;
var lfo2Amount = 0;
var lfo1Hz = 0;
var lfo2Hz = 0;
var osc1Hz = 440;
var osc2Hz = 440;
var oscWaveForm = 'sine';
var lfo1WaveForm = 'sine';
var lfo2WaveForm = 'sine';
var volume = .5;

$(document).ready(function () {
    loadInitialParams();
    updateCenter();
    $(window).resize(function () { updateCenter(); });
    hideControls();
    $('#container').mouseenter(function () { showControls(); });
    $('#container').mouseleave(function () { hideControls(); });
    initControls();
    buildAudio();
    setShareUrl();
});

function loadInitialParams() {
    var lfo1AmountParam = getParameterByName('lfo1Amount');
    var lfo2AmountParam = getParameterByName('lfo2Amount');
    var lfo1HzParam = getParameterByName('lfo1Hz');
    var lfo2HzParam = getParameterByName('lfo2Hz');
    var osc1HzParam = getParameterByName('osc1Hz');
    var osc2HzParam = getParameterByName('osc2Hz');
    var oscWaveFormParam = getParameterByName('oscWaveForm');
    var lfo1WaveFormParam = getParameterByName('lfo1WaveForm');
    var lfo2WaveFormParam = getParameterByName('lfo2WaveForm');
    var volumeParam = getParameterByName('volume');

    lfo1Amount = lfo1AmountParam === undefined || lfo1AmountParam === null || isNaN(lfo1AmountParam) ? lfo1Amount : lfo1AmountParam;
    lfo2Amount = lfo2AmountParam === undefined || lfo2AmountParam === null || isNaN(lfo2AmountParam) ? lfo2Amount : lfo2AmountParam;
    osc1Hz = osc1HzParam === undefined || osc1HzParam === null || isNaN(osc1HzParam) ? osc1Hz : osc1HzParam;
    osc2Hz = osc2HzParam === undefined || osc2HzParam === null || isNaN(osc2HzParam) ? osc2Hz : osc2HzParam;
    lfo1Hz = lfo1HzParam === undefined || lfo1HzParam === null || isNaN(lfo1HzParam) ? lfo1Hz : lfo1HzParam;
    lfo2Hz = lfo2HzParam === undefined || lfo2HzParam === null || isNaN(lfo2HzParam) ? lfo2Hz : lfo2HzParam;
    oscWaveForm = oscWaveFormParam === undefined || oscWaveFormParam === null || oscWaveFormParam.length === 0 ? oscWaveForm : oscWaveFormParam;
    lfo1WaveForm = lfo1WaveFormParam === undefined || lfo1WaveFormParam === null || lfo1WaveFormParam.length === 0 ? lfo1WaveForm : lfo1WaveFormParam;
    lfo2WaveForm = lfo2WaveFormParam === undefined || lfo2WaveFormParam === null || lfo2WaveFormParam.length === 0 ? lfo2WaveForm : lfo2WaveFormParam;
    volume = volumeParam === undefined || volumeParam === null || isNaN(volumeParam) ? volume : volumeParam;
}

function buildShareUrl() {
    return 'http://kindohm.com/offtheair/index.html?' +
        'osc1Hz=' + $('#osc1HzSlider').slider('option', 'value') +
        '&osc2Hz=' + $('#osc2HzSlider').slider('option', 'value') +
        '&lfo1Hz=' + $('#lfo1HzSlider').slider('option', 'value') +
        '&lfo2Hz=' + $('#lfo2HzSlider').slider('option', 'value') +
        '&lfo1Amount=' + $('#lfo1AmountSlider').slider('option', 'value') +
        '&lfo2Amount=' + $('#lfo2AmountSlider').slider('option', 'value') +
        '&lfo1WaveForm=' + lfo1.waveShape +
        '&lfo2WaveForm=' + lfo2.waveShape +
        '&oscWaveForm=' + oscillator1.waveShape +
        '&volume=' + $('#volumeSlider').slider('option', 'value');


}

function setShareUrl() {
    $('#url').val(buildShareUrl());
}

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
        step: 0.1,
        value: osc1Hz,
        change: function (event, ui) { oscillator1.frequency = ui.value; setShareUrl(); }
	, slide: function (event, ui) { oscillator1.frequency = ui.value; setShareUrl(); }
    });

    $('#lfo1HzSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 100,
        value: lfo1Hz,
        change: function (event, ui) { lfo1.frequency = ui.value; setShareUrl(); },
        slide: function (event, ui) { lfo1.frequency = ui.value; setShareUrl(); },
        step: .1
    });

    $('#lfo1AmountSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 1,
        value: lfo1Amount,
        change: function (event, ui) { lfo1Amount = ui.value; setShareUrl(); },
        slide: function (event, ui) { lfo1Amount = ui.value; setShareUrl(); },
        step: .01
    });


    $('#osc2HzSlider').slider({
        orientation: 'vertical',
        min: 40,
        max: 1000,
        step: .1,
        value: osc2Hz,
        change: function (event, ui) { oscillator2.frequency = ui.value; setShareUrl(); },
        slide: function (event, ui) { oscillator2.frequency = ui.value; setShareUrl(); }
    });

    $('#lfo2HzSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 100,
        value: lfo2Hz,
        step: .1,
        change: function (event, ui) { lfo2.frequency = ui.value; setShareUrl(); },
        slide: function (event, ui) { lfo2.frequency = ui.value; setShareUrl(); }
    });

    $('#lfo2AmountSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 1,
        value: lfo2Amount,
        change: function (event, ui) { lfo2Amount = ui.value; setShareUrl(); },
        slide: function (event, ui) { lfo2Amount = ui.value; setShareUrl(); },
        step: .01
    });

    $('#volumeSlider').slider({
        orientation: 'vertical',
        min: 0,
        max: 1,
        value: volume,
        step: .01,
        slide: function (event, ui) { volume = ui.value; setShareUrl(); },
        change: function (event, ui) { volume = ui.value; setShareUrl(); }
    });

    $('#waveFormButton').click(function () {
        oscillator1.waveShape = getNextWaveShape(oscillator1.waveShape);
        oscillator2.waveShape = oscillator1.waveShape;
        $('#waveFormButton').text(oscillator1.waveShape);
        setShareUrl();
    });

    $('#lfo1WaveFormButton').click(function () {
        lfo1.waveShape = getNextWaveShape(lfo1.waveShape);
        $('#lfo1WaveFormButton').text(lfo1.waveShape);
        setShareUrl();
    });

    $('#lfo2WaveFormButton').click(function () {
        lfo2.waveShape = getNextWaveShape(lfo2.waveShape);
        $('#lfo2WaveFormButton').text(lfo2.waveShape);
        setShareUrl();
    });

    $('#url').click(function(){
        $('#url').focus();
        $('#url').select();
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
    oscillator1 = audioLib.Oscillator(audioDevice.sampleRate, osc1Hz);
    oscillator2 = audioLib.Oscillator(audioDevice.sampleRate, osc2Hz);
    oscillator1.waveShape = oscWaveForm;
    oscillator2.waveShape = oscWaveForm;

    lfo1 = audioLib.Oscillator(audioDevice.sampleRate, lfo1Hz);
    lfo2 = audioLib.Oscillator(audioDevice.sampleRate, lfo2Hz);
    lfo1.waveShape = lfo1WaveForm;
    lfo2.waveShape = lfo2WaveForm;
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

// this function was yanked from 
// http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return null;
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
