// info on how to lay out timing of different acquisition 
// time is in microseconds

var timingModesZyla = {

    rollingShutterInternalTriggeringOverlap : {
                                                    longName : "Rolling Shutter, Internal Trigger, (Overlap Mode)",
                                                    shortName : "Rolling, Internal, Overlap",
                                                    exposureMin : "1row",
                                                    exposureMax : "30sec", // fix me to support parsing negative numbers
                                                    cycleTimeMin : "1exp",
                                                    cycleTimeFloor : "1frame",
                                                    cycleTimeMax : "1frame + 1exposure + 1row",
                                                    startDelay : "1row", //?
                                                    shutterMode : "rolling"
                                                },
    
    rollingShutterInternalTriggeringNonOverlap : {
                                                    longName : "Rolling Shutter, Internal Trigger, (Non-Overlap Mode)",
                                                    shortName : "Rolling, Internal, Non-Overlap",
                                                    exposureMin : "1row",
                                                    exposureMax : "30sec",
                                                    cycleTimeMin : "1exp + 1frame + 1row",
                                                    cycleTimeMax : "20000sec",
                                                    startDelay : "1row", 
                                                    shutterMode : "rolling"
    },


rollingShutterExternalSoftwareTriggering : {
                                                    longName : "Rolling Shutter External Trigger (Non-Overlap)",
                                                    shortName : "Rolling, External, Non-Overlap",
                                                    exposureMin : "3row",
                                                    exposureMax : "30sec", // fix me to support parsing negative numbers
                                                    cycleTimeMin : "1exposure + 1frame + 1row",
                                                    cycleTimeMax : "20000sec",
                                                    startDelay : "0row", //?
                                                    shutterMode : "rolling"
},

rollingShutterExternalExposureTriggering : {
                                                    longName : "Rolling Shutter External Exposure Trigger (Non-Overlap)",
                                                    shortName : "Rolling, External Exposure, Non-Overlap",
                                                    exposureMin : "3row",
                                                    exposureMax : "30sec", // fix me to support parsing negative numbers
                                                    cycleTimeMin : "1exposure + 1frame + 1row",
                                                    cycleTimeMax : "20000sec",
                                                    startDelay : "0row", //?
                                                    shutterMode : "rolling"
},

rollingShutterExternalExposureTriggeringOverlap : {
                                                longName : "Rolling Shutter External Exposure Trigger (Overlap)",
                                                shortName : "Rolling, External Exposure, Overlap",
                                                exposureMin : "1frame + 1row",
                                                exposureMax : "30sec", // fix me to support parsing negative numbers
                                                cycleTimeMin : "1exposure",
                                                cycleTimeMax : "20000sec",
                                                startDelay : "0row", //?
                                                shutterMode : "rolling"
},

rollingShutterGlobalClearInternalNonOverlap : {
                                                longName : "Rolling Shutter Global Clear Internal Trigger (Non-Overlap)",
                                                shortName : "Rolling, Global Clear Internal Trigger, Non-Overlap",
                                                exposureMin : "1frame + 1row",
                                                exposureMax : "30sec", // fix me to support parsing negative numbers
                                                cycleTimeMin : "1exposure + 1frame + 5rows",
                                                cycleTimeMax : "20000sec",
                                                startDelay : "0row", //?
                                                shutterMode : "rolling",
                                                globalClear : true,
},

rollingShutterGlobalClearExternalNonOverlap : {
                                                longName : "Rolling Shutter Global Clear External Trigger (Non-Overlap)",
                                                shortName : "Rolling, Global Clear External Trigger, Non-Overlap",
                                                exposureMin : "1frame + 1row",
                                                exposureMax : "30sec", // fix me to support parsing negative numbers
                                                cycleTimeMin : "1exposure + 1frame + 5rows",
                                                cycleTimeMax : "20000sec",
                                                startDelay : "0row", //?
                                                shutterMode : "rolling",
                                                globalClear : true,
},

rollingShutterGlobalClearExternalExposureNonOverlap : {
                                                longName : "Rolling Shutter Global Clear External Exposure (Non-Overlap)",
                                                shortName : "Rolling, Global Clear External Exposure, Non-Overlap",
                                                exposureMin : "1frame + 1row",
                                                exposureMax : "30sec", // fix me to support parsing negative numbers
                                                cycleTimeMin : "1exposure + 1frame + 5rows",
                                                cycleTimeMax : "20000sec",
                                                startDelay : "0row", //?
                                                shutterMode : "rolling",
                                                globalClear : true,
                                            },

globalShutterInternalTriggeringNonOverlapShort : {
                                                longName : "Global Shutter Internal Trigger (Non-Overlap) - Short Exposure",
                                                shortName : "Global Shutter, Internal Trigger, Non-Overlap - Short",
                                                exposureMin : "1row",
                                                exposureMax : "1frame + 3rows", // fix me to support parsing negative numbers
                                                cycleTimeMin : "1exposure + 2frames + 18rows",
                                                cycleTimeMax : "1exposure + 2frames + 18rows",
                                                startDelay : "0row", //?
                                                globalShutter : true,
                                                
                                            },

globalShutterInternalTriggeringNonOverlapLong : {
                                                longName : "Global Shutter Internal Trigger (Non-Overlap) - Long Exposure",
                                                shortName : "Global Shutter, Internal Trigger, Non-Overlap - Long",
                                                exposureMin : "1frame + 4rows",
                                                exposureMax : "30sec", // fix me to support parsing negative numbers
                                                cycleTimeMin : "1exposure + 1frame + 15rows",
                                                cycleTimeMax : "20000sec",
                                                startDelay : "0row", //?
                                                globalShutter : true,
                                                
                                            },

globalShutterInternalTriggeringOverlapShort : {
                                                longName : "Global Shutter Internal Trigger (Overlap Mode) - Short Exposure",
                                                shortName : "Global Shutter, Internal Trigger, Overlap, Short",
                                                exposureMin : "1frame + 10rows",
                                                exposureMax : "2frames + 9rows", // fix me to support parsing negative numbers
                                                cycleTimeMin : "2frames + 19rows",
                                                cycleTimeMax : "2frames + 19rows",
                                                startDelay : "0row", //?
                                                globalShutter : true,
                                                
                                            },

globalShutterInternalTriggeringOverlapLong : {
                                                longName : "Global Shutter Internal Trigger (Overlap Mode) - Long Exposure",
                                                shortName : "Global Shutter, Internal Trigger, Overlap, Long",
                                                exposureMin : "2frame + 10rows",
                                                exposureMax : "30sec", // fix me to support parsing negative numbers
                                                cycleTimeMin : "1exposures + 10rows",
                                                cycleTimeMax : "30sec",
                                                startDelay : "0row", //?
                                                globalShutter : true,
                                                
                                            },

globalShutterExternalTriggeringNonOverlap : {
                                                longName : "Global Shutter External Trigger (Non-Overlap)",
                                                shortName : "Global Shutter, External Trigger, Non-Overlap",
                                                exposureMin : "1frame + 4rows",
                                                exposureMax : "30sec", // fix me to support parsing negative numbers
                                                cycleTimeMin : "1exposure + 1frame + 14rows",
                                                cycleTimeMax : "30sec",
                                                startDelay : "1row", //?
                                                globalShutter : true,
                                                
                                            },

globalShutterExternalTriggeringOverlapShort : {
                                                longName : "Global Shutter External Trigger (Overlap Mode) - Short Exposure",
                                                shortName : "Global Shutter, External Trigger, Overlap, Short Exposure",
                                                exposureMin : "1frame + 10rows",
                                                exposureMax : "2frames + 13rows", 
                                                cycleTimeMin : "2frames + 19rows",
                                                cycleTimeMax : "2frames + 19rows",
                                                startDelay : "1row", //?
                                                globalShutter : true,
                                                
                                            },

globalShutterExternalTriggeringOverlapLong : {
                                                longName : "Global Shutter External Trigger (Overlap Mode) - Long Exposure",
                                                shortName : "Global Shutter, External Trigger, Overlap, Long Exposure",
                                                exposureMin : "2frames + 14rows",
                                                exposureMax : "30seconds", 
                                                cycleTimeMin : "1exposure + 11rows",
                                                cycleTimeMax : "30seconds",
                                                startDelay : "1row", //?
                                                globalShutter : true,
                                                
                                            },

}
