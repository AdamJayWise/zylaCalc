var cameraInfo = {

    sona42b11 : {
        displayName : "Sona 4.2B-11 - USB 3.1",
        columns : 2048,
        rows : 2048,
        bitModes : [12, 16],
        rowTimeUs : {12 : 20.52/2, 16 : 20.52},
        frameTimeUs : {12 : 21.012 * 1000, 16 : 42.025 * 1000},
        hasGlobalShutter : false,
        globalClear : false,
        interface : "usb3",
        bitDepth : 12,
        numReadouts : 1,
        timings : 'sona11',
    },

    sona42b6 : {
        displayName : "Sona 4.2B-6 - USB 3.1",
        columns : 2048,
        rows : 2048,
        bitModes : [12, 16],
        rowTimeUs : {12 : 11.2, 16 : 6.6},
        frameTimeUs : {12   : 22.9 * 1000, 16 : 13.5 * 1000},
        hasGlobalShutter : false,
        globalClear : false,
        interface : "usb3",
        bitDepth : 12,
        numReadouts : 1,
        timings : "sona6",
    },

    sona42b6x : {
        displayName : "Sona 4.2B-6 - CoaXPress",
        columns : 2048,
        rows : 2048,
        bitModes : [12, 16],
        rowTimeUs : {12 : 11.2, 16 : 6.6},
        frameTimeUs : {12   : 22.9 * 1000, 16 : 13.5 * 1000},
        hasGlobalShutter : false,
        globalClear : false,
        interface : "cxp",
        bitDepth : 12,
        numReadouts : 1,
        timings : "sona6",
    },

}