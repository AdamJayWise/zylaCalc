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
 * 
 * so what I'm about to do is modify this thing such that frame becomes roiRows*rowTime
 * that will be the naive estimate
 * 
 */


console.log("zylaCalc.js 2020 Adam Wise");

app = {
    exposureTimeSec : 0.01,
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
    
    // if no roi is being used:
    if (!app.roiRows){
        var parameterVal = (timeVals["rows"] * cameraObj["rowTimeUs"][currentReadout]) + (timeVals["frames"] * cameraObj["frameTimeUs"][currentReadout]) + (timeVals['microseconds']) + (timeVals['exposures'] * app.exposureTimeSec * 10**6);
    }
    // if no roi is being used:
    if (app.roiRows){
        var parameterVal = (timeVals["rows"] * cameraObj["rowTimeUs"][currentReadout]) + (timeVals["frames"] * app.roiRows * cameraObj["rowTimeUs"][currentReadout] / 2) + (timeVals['microseconds']) + (timeVals['exposures'] * app.exposureTimeSec * 10**6);
    }


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

/*
var headingColDiv = d3.select('#cameraContainer')
                    .append("div")
                    .classed("timingModeLabelCol", true)
                    
headingColDiv.append('span')
        .text("Mode")
        .classed("cameraHeading", true)

headingColDiv.selectAll('.timingModeLabel')
                    .data(app.activeTimingModes)
                    .enter()
                    .append('div')
                    .classed("timingModeLabel", true)
                    .append("div")
                    .text(d=>timingModes[d]['longName'])
                    .classed("timingModeLabelContents", true)

var cameraDivs = d3.select('#cameraContainer')
                    .selectAll('div.cameraDiv')
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
/*
    timingModeDivs
        .append('span')
        .text(d=>timingModes[d].longName)
        .classed("timingHeading", true)
    */

function formatTime(n){
    if (n<1000){
        return r(n,2) + ' us';
    }
    if (n < 100000){
        return r(n/1000,2) + ' ms';
    }

    return r(n/(10**6),2) + ' sec';
}

function populateTimingModeDivs(){

    

    prettyLabelDict = {'exposureMin': 'Min. Exposure', 'exposureMax' : 'Max. Exposure'};

    var timeParams = ['exposureMin','exposureMax'];
    timeParams.forEach(function(p){
        timingModeDivs
        .append("div")
        .text( (d,i,nodeList) => prettyLabelDict[p] + ' ' + formatTime( showCalculatedTime(d,i,nodeList, p) ))
    });

    timingModeDivs
        .append('div')
        .html( (d,i,nodeList) => 'Frame Rate, fps: ' + calculateFrameRate(d,i,nodeList))  ;
}
//populateTimingModeDivs();

// I want to redo this such that I first create a json object organizing the relevant data, then 
// building the table using simple d3... so loop through timing modes and create an entry for each camera's fps and whatever else
// So i'll loop through the entries in timingModes, using the timingModes key as the result key, with an oobje
var timingResults = {};

var headingRow = d3.select("#resultTable")
                    .append("tr")
                    .selectAll(".colHeading")
                    .data([{displayName:''}].concat(Object.keys(cameraInfo)))
                    .enter()
                    .append("td")
                    .classed("colHeading", true)
                    .html(function(d){
                        try {return cameraInfo[d].displayName}
                        catch(err) {return ''}

                    })

var resultRows = d3.select("#resultTable")
                    .selectAll(".timingModeRow")
                    .data(Object.keys(timingModes))
                    .enter()
                    .append("tr")
                    .classed("timingModeRow", true);

var labelCol = resultRows
                    .each(function(d,i,nodes){
                        console.log(d)
                        d3.select(nodes[i])
                            .append("td")
                            .classed("rowLabel", true)
                            .text(timingModes[d].longName)
                    })

var resultCells = resultRows
                    .selectAll(".resultCell")
                    .data(Object.keys(cameraInfo))
                    .enter()
                    .append("td")
                    .classed("resultCell", true)
                    .html((d,i,nodeList)=>generateResultHTML(d,i,nodeList))

function updateCells(){
    resultCells.html((d,i,nodeList)=>generateResultHTML(d,i,nodeList));
}

function generateResultHTML(cameraKey, i, nodeList){
    var timingModeKey = d3.select(nodeList[i].parentElement).data()[0];
    var cam = cameraInfo[cameraKey];
    var timingMode = timingModes[timingModeKey];


    // check if requirement for global clear is being violated:
    if(timingMode['globalClear'] & !cam['globalClear']){
        //d3.select(nodeList[i].parentElement).classed('inactiveMode', true)
        //return '<span style = "color:black">Requires global clear<red>'
        return '-'
    }

    // check if requirement for global shutter is being violated:
    if(timingMode['globalShutter'] & !cam['hasGlobalShutter']){
        //d3.select(nodeList[i].parentElement).classed('inactiveMode', true)
        //return '<span style = "color:black">Requires global shutter<red>'
        return '-'
    }

    // check if min exposure is being violated
    var minExposureUs = getCalculatedTime('exposureMin', timingMode, cam) ;
    if (app.exposureTimeSec*10**6 < minExposureUs){
        // can I set the parent div as inactive?
        return '<span style = "font-size : 70%; color:red">t<sub>exp</sub> < ' + formatTime(minExposureUs) + '<red>'
    }

    // check if min exposure is being violated
    var maxExposureUs = getCalculatedTime('exposureMax', timingMode, cam);
    if (app.exposureTimeSec*10**6 > maxExposureUs){
        // can I set the parent div as inactive?
        return '<span style = "font-size : 70%; color:red">t<sub>exp</sub> > ' + formatTime(maxExposureUs) + '<red>'
    }




    // if there is a floor for the cycle time, make sure calcualted cycle time is at or above it
    var cycleTimeFloorUs = 0;
    if (timingMode['cycleTimeFloor']){
        cycleTimeFloorUs = getCalculatedTime('cycleTimeFloor', timingMode, cam)
    }
    
    var frameRateNaive = 10**6/( d3.max([getCalculatedTime('cycleTimeMin', timingMode, cam), cycleTimeFloorUs]));

    var roiRows = cam['rows'];
    if (app.roiRows){
        roiRows = app.roiRows;
    }
    var roiColumns = cam['columns'];
    if (app.roiColumns){
        roiColumns = app.roiColumns;
    }

    var bandWidthBitsPerSecond = {'usb3':2654.208*10**6, 'cl10' : 6637.486*10**6}[cam['interface']];
    if(app.debug){
        console.log('roi rows are', roiRows, 'roi columns are', roiColumns, 'bandwidth is', bandWidthBitsPerSecond);
    }

    var bandWidthLimitedFrameRate = bandWidthBitsPerSecond / (roiColumns * roiRows * app.bitDepth);
    if(app.debug){
        console.log(timingMode.shortName, 'bwlimit', cam.displayName, bandWidthLimitedFrameRate, 'datalimit', cam.displayName, frameRateNaive)
    }
    return r( d3.min([frameRateNaive, bandWidthLimitedFrameRate]) , 2);
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

// callback for exposure time input
d3.select('#exposureTimeSec')
    .on('input', function(){
        app.exposureTimeSec = Number(this.value);
        updateCells();
    })

//callback for roi row input
d3.select('#roiRows')
    .on('change', function(){
        app['roiRows'] = Math.min(2048, Math.max(8,Number(this.value)));
        this.value = app['roiRows'];
        updateCells();
    })

//callback for roi column input
d3.select('#roiColumns')
    .on('change', function(){
        app['roiColumns'] = Math.min(2048, Math.max(8,Number(this.value)));
        this.value = app['roiColumns'];
        updateCells();
    })

// callback for bit depth input
d3.select('#bitDepth')
    .on('change', function(){
        app['bitDepth'] = Number(this.value);
        updateCells();
    })
    