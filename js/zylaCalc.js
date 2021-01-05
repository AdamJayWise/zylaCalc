/**
I'd like to re-write some of this to clean it up and allow adding the Sona models (and future sCMOS cameras)

re-write a single function getFrameRate(cameraObject, timingObject, paramObj) to allow for automated testing

re-write how the timing rules work to allow for different rules with different cameras.
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
app.availableTimingModes = Object.keys(timingModesZyla);
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

function getCalculatedTime(timingParam, timingModeObj, cameraObj, params = app){
    var timeVals = parseTimingString(timingModeObj[timingParam]);
    var currentReadout =  cameraObj["readOutRatesMHz"][1];
    
    // if no roi is being used:
    if (!params.roiRows){
        var parameterVal = (timeVals["rows"] * cameraObj["rowTimeUs"][currentReadout]) + (timeVals["frames"] * cameraObj["frameTimeUs"][currentReadout]) + (timeVals['microseconds']) + (timeVals['exposures'] * params.exposureTimeSec * 10**6);
    }
    // if no roi is being used:
    if (params.roiRows){
        var parameterVal = (timeVals["rows"] * cameraObj["rowTimeUs"][currentReadout]) + (timeVals["frames"] * params.roiRows * cameraObj["rowTimeUs"][currentReadout] / 2) + (timeVals['microseconds']) + (timeVals['exposures'] * params.exposureTimeSec * 10**6);
    }
    return parameterVal;
}


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

    var prettyLabelDict = {'exposureMin': 'Min. Exposure', 'exposureMax' : 'Max. Exposure'};

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

// function to wrap getCalculatedTime with relevant data stored in DOM nodes
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

function findFrameRate(cam, timingMode, params = app){
    // function to find the frame rate in fps given a camera object and timingmode object
    if (app.debug){
        console.log(params);
    }
    // if there is a floor for the cycle time, make sure calcualted cycle time is at or above it
    var cycleTimeFloorUs = 0;
    if (timingMode['cycleTimeFloor']){
        cycleTimeFloorUs = getCalculatedTime('cycleTimeFloor', timingMode, cam, params = params)
    }
    
    var frameRateNaive = 10**6/( d3.max([getCalculatedTime('cycleTimeMin', timingMode, cam, params = params), cycleTimeFloorUs]));

    var roiRows = cam['rows'];
    if (params.roiRows){
        roiRows = params.roiRows;
    }
    var roiColumns = cam['columns'];
    if (params.roiColumns){
        roiColumns = params.roiColumns;
    }

    var bandWidthBitsPerSecond = {'usb3':1*2654.208*10**6, 'cl10' : 6637.486*10**6}[cam['interface']];
    if(params.debug){
        console.log('roi rows are', roiRows, 'roi columns are', roiColumns, 'bandwidth is', bandWidthBitsPerSecond);
    }

    var bandWidthLimitedFrameRate = bandWidthBitsPerSecond / (roiColumns * roiRows * params.bitDepth);
    if(params.debug){
        console.log(timingMode.shortName, 'bwlimit', cam.displayName, bandWidthLimitedFrameRate, 'datalimit', cam.displayName, frameRateNaive)
    }
    return r( d3.min([frameRateNaive, bandWidthLimitedFrameRate]) , 2);
}

///////////////////// GUI Code goes here /////////////////////////

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
                    .data(Object.keys(timingModesZyla))
                    .enter()
                    .append("tr")
                    .classed("timingModeRow", true);

var labelCol = resultRows
                    .each(function(d,i,nodes){
                        d3.select(nodes[i])
                            .append("td")
                            .classed("rowLabel", true)
                            .text(timingModesZyla[d].longName)
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
    // estable camera, timing mode, parameters
    var timingMode = timingModesZyla[timingModeKey];


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

    return findFrameRate(cam, timingMode)
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
    
///////////////////// End of GUI Code /////////////////////////
