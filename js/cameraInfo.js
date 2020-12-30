var cameraInfo = {

    zyla55cl10 : {
        displayName : "Zyla 5.5, CL10",
        columns : 2560,
        rows : 2160,
        readOutRatesMHz : [200, 560],
        rowTimeUs : {200 : 25.41, 560 : 9.24},
        frameTimeUs : {200 : 27.44 * 1000, 560 : 9.98 * 1000},
        shutterModes : ["global", "rolling"],
        hasGlobalShutter : true,
        globalClear : false,
        interface : "cl10",
    },

    zyla55usb : {
        displayName : "Zyla 5.5, USB3",
        columns : 2560,
        rows : 2160,
        readOutRatesMHz : [200, 560],
        rowTimeUs : {200 : 25.41, 560 : 9.24},
        frameTimeUs : {200 : 27.44 * 1000, 560 : 9.98 * 1000},
        shutterModes : ["global", "rolling"],
        hasGlobalShutter : true,
        globalClear : false,
        interface : "usb3",

    },

    zyla42cl10 : {
        displayName : "Zyla 4.2 PLUS, CL10",
        columns : 2048,
        rows : 2048,
        readOutRatesMHz : [216, 540],
        rowTimeUs : {216 : 24, 540 : 9.6},
        frameTimeUs : {216 : 25.4 * 1000, 540 : 9.83 * 1000},
        shutterModes : ["rolling"],
        hasGlobalShutter : false,
        globalClear : true,
        interface : "cl10",

    },

    zyla42usb : {
        displayName : "Zyla 4.2 PLUS, USB3",
        columns : 2048,
        rows : 2048,
        readOutRatesMHz : [216, 540],
        rowTimeUs : {216 : 24, 540 : 9.6},
        frameTimeUs : {216 : 25.4 * 1000, 540 : 9.83 * 1000},
        shutterModes : ["rolling"],
        hasGlobalShutter : false,
        globalClear : true,
        interface : "usb3",

    },
}