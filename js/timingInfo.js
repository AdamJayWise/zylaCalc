// info on how to lay out timing of different acquisition 
// time is in microseconds

var timingModes = {
    rollingShutterInternalTriggeringNonOverlap : {
                                                    longName : "Rolling Shutter, Internal Triggering, Non-Overlap Mode",
                                                    shortName : "Rolling, Internal, Non-Overlap",
                                                    exposureMin : "1row",
                                                    exposureMax : "30sec",
                                                    cycleTimeMin : "1exp + 1frame + 1row",
                                                    cycleTimeMax : "20000sec",
                                                    startDelay : "1row", 
                                                    shutterMode : "rolling"
    },


    rollingShutterInternalTriggeringOverlap : {
                                                    longName : "Rolling Shutter, Internal Triggering, Overlap Mode",
                                                    shortName : "Rolling, Internal, Overlap",
                                                    exposureMin : "1row",
                                                    exposureMax : "1frame", // fix me to support parsing negative numbers
                                                    cycleTimeMin : "1exp",
                                                    cycleTimeFloor : "1frame",
                                                    cycleTimeMax : "1frame + 1exposure + 1row",
                                                    startDelay : "1row", //?
                                                    shutterMode : "rolling"
},

rollingShutterExternalSoftwareTriggering : {
                                                    longName : "Rolling Shutter, External / Software Triggering (Non-Overlap)",
                                                    shortName : "Rolling, External, Non-Overlap",
                                                    exposureMin : "3row",
                                                    exposureMax : "30sec", // fix me to support parsing negative numbers
                                                    cycleTimeMin : "1exposure + 1frame + 1row",
                                                    cycleTimeMax : "20000sec",
                                                    startDelay : "0row", //?
                                                    shutterMode : "rolling"
},

rollingShutterExternalExposureTriggering : {
                                                    longName : "Rolling Shutter External Exposure Triggering (Non-Overlap)",
                                                    shortName : "Rolling, External Exposure, Non-Overlap",
                                                    exposureMin : "3row",
                                                    exposureMax : "30sec", // fix me to support parsing negative numbers
                                                    cycleTimeMin : "1exposure + 1frame + 1row",
                                                    cycleTimeMax : "20000sec",
                                                    startDelay : "0row", //?
                                                    shutterMode : "rolling"
},

rollingShutterExternalExposureTriggeringOverlap : {
                                                longName : "Rolling Shutter External Exposure Triggering (Overlap)",
                                                shortName : "Rolling, External Exposure, Overlap",
                                                exposureMin : "1frame + 1row",
                                                exposureMax : "30sec", // fix me to support parsing negative numbers
                                                cycleTimeMin : "1exposure",
                                                cycleTimeMax : "20000sec",
                                                startDelay : "0row", //?
                                                shutterMode : "rolling"
},


}