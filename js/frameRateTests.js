// more refined testing code

function doTest(testObj){
    var frameRate = findFrameRate(testObj.cam, testObj.timingMode, params = testObj.testParams);
    var errorVal = Math.abs(frameRate - testObj.testParams.targetFrameRate);
    console.log('Target is', testObj.testParams.targetFrameRate, 'Calculated value is :', frameRate,'error is ', r(100 * errorVal / frameRate, 2), '%');
}

var tests = [];

tests.push({
    cam : cameraInfo['zyla55cl10'],
    timingMode : timingModesZyla['rollingShutterInternalTriggeringOverlap'],
    testParams : {
                    targetFrameRate : 100,
                    bitDepth : 12,
                    exposureTimeSec : 1e-4,
                    debug : false,
                }
})

tests.push({
    cam : cameraInfo['zyla55cl10'],
    timingMode : timingModesZyla['rollingShutterInternalTriggeringOverlap'],
    testParams : {
                    targetFrameRate : 75,
                    bitDepth : 16,
                    exposureTimeSec : 1e-4,
                    debug : false,
                }
})

tests.push({
    cam : cameraInfo['zyla55cl10'],
    timingMode : timingModesZyla['rollingShutterInternalTriggeringOverlap'],
    testParams : {
                    targetFrameRate : 1691,
                    bitDepth : 12,
                    exposureTimeSec : 1e-4,
                    roiRows : 128,
                    roiColumns : 128,
                    debug : false,
                }
})


tests.push({
    cam : cameraInfo['zyla55cl10'],
    timingMode : timingModesZyla['rollingShutterInternalTriggeringOverlap'],
    testParams : {
                    targetFrameRate : 200,
                    bitDepth : 12,
                    exposureTimeSec : 1e-4,
                    roiRows : 1080,
                    roiColumns : 1920,
                    debug : false,
                }
});

tests.push({
    cam : cameraInfo['zyla55usb'],
    timingMode : timingModesZyla['rollingShutterInternalTriggeringOverlap'],
    testParams : {
                    targetFrameRate : 13020,
                    bitDepth : 12,
                    exposureTimeSec : 9.3e-6,
                    roiRows : 8,
                    roiColumns : 2048,
                    debug : false,
                }
})


tests.push({
    cam : cameraInfo['zyla55usb'],
    timingMode : timingModesZyla['rollingShutterInternalTriggeringOverlap'],
    testParams : {
                    targetFrameRate : 40,
                    bitDepth : 12,
                    exposureTimeSec : 1e-4,
                    debug : false,
                }
})

tests.push({
    cam : cameraInfo['zyla55usb'],
    timingMode : timingModesZyla['rollingShutterInternalTriggeringOverlap'],
    testParams : {
                    targetFrameRate : 27057,
                    bitDepth : 12,
                    exposureTimeSec : 9.3e-6,
                    roiRows : 8,
                    roiColumns : 1024,
                    debug : false,
                }
})

tests.push({
    cam : cameraInfo['zyla55usb'],
    timingMode : timingModesZyla['rollingShutterInternalTriggeringOverlap'],
    testParams : {
                    targetFrameRate : 27057,
                    bitDepth : 12,
                    exposureTimeSec : 9.3e-6,
                    roiRows : 8,
                    roiColumns : 1024,
                    debug : false,
                }
})

tests.push({
    cam : cameraInfo['zyla55usb'],
    timingMode : timingModesZyla['globalShutterInternalTriggeringOverlapShort'],
    testParams : {
                    targetFrameRate : 4008,
                    bitDepth : 12,
                    exposureTimeSec : 9.3e-6,
                    roiRows : 8,
                    roiColumns : 1024,
                    debug : false,
                }
})

tests.push({
    cam : cameraInfo['zyla55cl10'],
    timingMode : timingModesZyla['rollingShutterInternalTriggeringOverlap'],
    testParams : {
                    targetFrameRate : 98,
                    bitDepth : 16,
                    exposureTimeSec : 9.3e-6,
                    roiRows : 2048,
                    roiColumns : 2048,
                    debug : false,
                }
})

console.log("Manually Entered Tests");
tests.forEach(n=>doTest(n))

