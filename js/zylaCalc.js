/**
 * so to start I'd like to create an entry for each camera, showing each mode's acquisition
 * it'd be nice to have them line up across models for comparison, not sure how to keep catagories registered
 * other than using the paradigm i had for the other ones, e.g., loop through active cameras, and within that 
 * loop through active modes
*/

/**
 * the algorithm for checking framerate should work like this,
 * 
 * what do I want to do with the rolling shutter mode?  The framerate is supposed to be equal to the exposure
 * time until long exposure hits
 * so cycle time = exposure time until exposure time longer than readout
 * 
 * 12 and 16 bit are independant of readout rate
 */


console.log("zylaCalc.js 2020 Adam Wise");

app = {
    exposureTimeSec : 0.001,
    debug : 0,
    bitDepth : 12,
    roiColumns : 0,
    roiRows : 0,
}

// this is temporary to stash available timing modes and cameras
app.availableTimingModes = Object.keys(timingModes);
app.availableCameras = Object.keys(cameraInfo);

app.activeTimingModes = app.availableTimingModes;
app.activeCameras = app.availableCameras;


// rounding function with specific number of decimal places d
function r(n,d){
    return Math.round(n*10**d)/10**d;
}

function parseTimingString(timeString){
    var numRows = 0;
    var numFrames = 0;
    var numExposures = 0;
    var numSeconds = 0;

    var rowReg = /(\d+)row/;
    var frameReg = /(\d+)frame/;
    var expReg = /(\d+)exp/;
    var secReg = /(\d+)sec/;

    if (rowReg.exec(timeString)){
        numRows = Number(rowReg.exec(timeString)[1]);
    }

    if (frameReg.exec(timeString)){
        numFrames = Number(frameReg.exec(timeString)[1]);
    }

    if (expReg.exec(timeString)){
        numExposures = Number(expReg.exec(timeString)[1]);
    }

    if (secReg.exec(timeString)){
        numSeconds = Number(secReg.exec(timeString)[1]);
    }

    if (app.debug){
        console.log("time string is ", timeString);
        console.log('Rows:', numRows, ', Frames:', numFrames, ', Exposures: ', numExposures, 'microseconds' , numSeconds * 10**6);
    }

    return {rows : numRows, frames : numFrames, exposures : numExposures, microseconds : numSeconds * 10**6};
}

function getCalculatedTime(timingParam, timingModeObj, cameraObj){
    var timeVals = parseTimingString(timingModeObj[timingParam]);
    var currentReadout =  cameraObj["readOutRatesMHz"][1];
    var parameterVal = timeVals["rows"] * cameraObj["rowTimeUs"][currentReadout] + timeVals["frames"] * cameraObj["frameTimeUs"][currentReadout] + timeVals['microseconds'] + timeVals['exposures'] * app.exposureTimeSec * 10**6;
    return parameterVal;
}
/**
 * Test out parsing stored timing info in the timingModes object
 */
function testParseTimings(cam, timingMode){
    //console.log("camera is: ", cam);
    //console.log("timing mode is: ", timingMode)

    // parse exposure minimum
    


    console.log("Camera is:", cam['displayName']);
    console.log("Timing Mode is:", timingMode['longName']);
    var currentReadout = cam["readOutRatesMHz"][0];
    console.log("current readout rate is ", currentReadout);
    

    function checkTiming(timingParam){
        var timeVals = parseTimingString(timingMode[timingParam]);
        var parameterVal = timeVals["rows"] * cam["rowTimeUs"][currentReadout] + timeVals["frames"] * cam["frameTimeUs"][currentReadout] + timeVals['microseconds'];
        
        if (parameterVal < 1000){
            console.log(timingParam, "is : ",parameterVal,"us")
        }

        if ( (parameterVal >= 1000) && (parameterVal < 100000)){
            console.log(timingParam, "is : ",parameterVal / 1000,"ms")
        }

        if (parameterVal > 100000) {
            console.log(timingParam, "is : ",parameterVal/(10**6),"s")
        }
    }

    ['exposureMin','exposureMax','cycleTimeMin', 'cycleTimeMax', 'startDelay'].forEach(d=>checkTiming(d))


}

testParseTimings(cameraInfo["zyla55usb"], timingModes["rollingShutterInternalTriggeringNonOverlap"]);

var cameraDivs = d3.select('#cameraContainer')
                    .selectAll('div')
                    .data(app.activeCameras)
                    .enter()
                    .append('div')
                    .classed("cameraDiv", true)

cameraDivs 
    .append('span')
    .text(d=>cameraInfo[d].displayName)
    .classed("cameraHeading", true)
                    

var timingModeDivs = d3.selectAll('.cameraDiv')
                        .selectAll('.timingMode')
                        .data(app.activeTimingModes)
                        .enter()
                        .append('div')
                        .classed("timingMode", true)
timingModeDivs
        .append('span')
        .text(d=>timingModes[d].longName)
        .classed("timingHeading", true)

function populateTimingModeDivs(){

    function formatTime(n){
        if (n<1000){
            return r(n,3) + ' us';
        }
        if (n < 100000){
            return r(n/1000,3) + ' ms';
        }

        return r(n/(10**6),3) + ' sec';
    }

    var timeParams = ['exposureMin','exposureMax'];
    timeParams.forEach(function(p){
        timingModeDivs
        .append("div")
        .text( (d,i,nodeList) => p + ' ' + formatTime( showCalculatedTime(d,i,nodeList, p) ))
    });

    timingModeDivs
        .append('div')
        .text( (d,i,nodeList) => 'Frame Rate ' + calculateFrameRate(d,i,nodeList)) ;
}
populateTimingModeDivs();

function calculateFrameRate(timingModeKey, i, nodeList, timeParam){
    var cameraKey = d3.select(nodeList[i].parentElement.parentElement).data()[0];
    var cam = cameraInfo[cameraKey];
    var timingMode = timingModes[timingModeKey];

    // check if min exposure is being violated
    var minExposureSec = getCalculatedTime('exposureMin', timingMode, cam) / 10**6;
    console.log(minExposureSec, 'min exposure')
    if (app.exposureTimeSec < minExposureSec){
        return 'Error - exposure time too short'
    }


    // if there is a floor for the cycle time, make sure calcualted cycle time is at or above it
    var cycleTimeFloorUs = 0;
    if (timingMode['cycleTimeFloor']){
        cycleTimeFloorUs = getCalculatedTime('cycleTimeFloor', timingMode, cam)
    }
    console.log('cycletimefloor is', cycleTimeFloorUs)
    var frameRateNaive = 10**6/( d3.max([getCalculatedTime('cycleTimeMin', timingMode, cam), cycleTimeFloorUs]));

    return r( d3.min([frameRateNaive]) , 2);
}

                        
function showCalculatedTime(timingModeKey, i, nodeList, timeParam){
    var cameraKey = d3.select(nodeList[i].parentElement.parentElement).data()[0];
    // show cycle time based on what's up
    var cam = cameraInfo[cameraKey];
    var timingMode = timingModes[timingModeKey];

    // need validation for shutter mode and min/max exposure
    // so how to report the exposure-dependant cycle time? 

    var timeUs = getCalculatedTime(timeParam, timingMode, cam);

    return timeUs;
}        

d3.select('#exposureTimeSec')
    .on('input', function(){
        console.log('changed');
        app.exposureTimeSec = Number(this.value);
        timingModeDivs.selectAll('div').remove();   
        populateTimingModeDivs();
    })



    