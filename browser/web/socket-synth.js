var example = example || {};

(function () {
    "use strict";

    var freqTransform = function (value) {
        return (value * 6000) + 60;
        //return (value * 110) + 60;
    };

    var identityTransform = function (value) {
        return value;
    };


    var carrierSpecOne = {
        freq: {
            inputPath: "carrierOne.freq.value",
            transform: freqTransform,
            synthName: "synth1"
        },
        mul: {
            inputPath: "carrierOne.mul.mul",
            transform: identityTransform,
            synthName: "synth1"
        }
    };

    var carrierSpecTwo = {
        freq: {
            inputPath: "carrierTwo.freq.value",
            transform: freqTransform,
            synthName: "synth2"
        },
        mul: {
            inputPath: "carrierTwo.mul.mul",
            transform: identityTransform,
            synthName: "synth2"
        }
    };

    var carrierSpecThree = {
        freq: {
            inputPath: "carrierThree.freq.value",
            transform: freqTransform,
            synthName: "synth3"
        },
        mul: {
            inputPath: "carrierThree.mul.mul",
            transform: identityTransform,
            synthName: "synth3"
        }
    };

    var carrierSpecFour = {
        freq: {
            inputPath: "carrierFour.freq.value",
            transform: freqTransform,
            synthName: "synth4"
        },
        mul: {
            inputPath: "carrierFour.mul.mul",
            transform: identityTransform,
            synthName: "synth4"
        }
    };
    /*
    var modulatorSpec = {
        freq: {
            inputPath: "modulator.freq.value",
            transform: freqTransform
        },
        mul: {
            inputPath: "modulator.mul",
            transform: freqTransform
        }
    };*/

    example.SocketSynth = function () {
        this.oscPort = new osc.WebSocketPort({
            url: "ws://localhost:8081"
        });

        this.listen();
        this.oscPort.open();

        this.oscPort.socket.onmessage = function (e) {
            console.log("message", e);
        };

        this.valueMap = {


             "/1/rotaryA": carrierSpecOne.freq,
             "/1/rotaryB": carrierSpecTwo.freq,
             "/1/rotaryC": carrierSpecThree.freq,
             "/1/rotaryD": carrierSpecFour.freq,

             "/1/faderA": carrierSpecOne.mul,
             "/1/faderB": carrierSpecTwo.mul,
             "/1/faderC": carrierSpecThree.mul,
             "/1/faderD": carrierSpecFour.mul,

             //"/multifaderM/1": carrierSpec.mul,


          //  "/3/xyM_1/z": modulatorSpec.mul*/
        };

        this.vibratoSynth = flock.synth({
           synthDef: {
              ugen: "flock.ugen.out",
              bus: 4,
              expand: 1,
              sources: {
                id: "beat",
                ugen: "flock.ugen.lfSaw",
                freq: 2
              }
            }
        });

        this.synth1 = flock.synth({
           synthDef: {
                id: "carrierOne",
                ugen: "flock.ugen.sinOsc",
                freq: {
                    ugen: "flock.ugen.value",
                    rate: "audio",
                    value: 110,

                },
                mul: {
                  ugen: "flock.ugen.in",
                  bus: 4,
                  mul: 1,
                }
            }
        });

        this.synth2 = flock.synth({
          synthDef: {
            id: "carrierTwo",
            ugen: "flock.ugen.triOsc",
              freq: {
                  ugen: "flock.ugen.value",
                  rate: "audio",
                  value: 110/2,

              },
              mul: {
                ugen: "flock.ugen.in",
                bus: 4,
                mul: 2,
              }
          }
        });

        this.synth3 = flock.synth({
          synthDef: {
            id: "carrierThree",
            ugen: "flock.ugen.lfNoise",
              freq: {
                  ugen: "flock.ugen.value",
                  rate: "audio",
                  value: 110,

              },
              mul: {
                ugen: "flock.ugen.in",
                bus: 4,
                mul: 0.75,
              }
          }
        });

        this.synth4 = flock.synth({
          synthDef: {
            id: "carrierFour",
            ugen: "flock.ugen.lfPulse",
              freq: {
                  ugen: "flock.ugen.value",
                  rate: "audio",
                  value: 110/4,

              },
              mul: {
                ugen: "flock.ugen.in",
                bus: 4,
                mul: 1,
              }
          }
        });

            /*var globalFreq = 110;
var vibratoSynth = flock.synth({
	synthDef: {
		ugen: "flock.ugen.out",
		bus: 4,
		expand: 1,
		sources: {
			id: "beat",
			ugen: "flock.ugen.lfSaw",
			freq: 2
		}
	}
});
var synth = flock.synth({
	synthDef: {
		ugen: "flock.ugen.sinOsc",
		freq: globalFreq,
		mul: {
			ugen: "flock.ugen.in",
			bus: 4,
			mul: 1,
		}
	}
});
var synth = flock.synth({
	synthDef: {
		ugen: "flock.ugen.triOsc",
		freq: globalFreq/2,
		mul: {
			ugen: "flock.ugen.in",
			bus: 4,
			mul: 2,
		}
	}
});
var synth = flock.synth({
	synthDef: {
		ugen: "flock.ugen.lfNoise",
		freq: globalFreq,
		mul: {
			ugen: "flock.ugen.in",
			bus: 4,
			mul: 0.75
		}
	}
});
var synth = flock.synth({
	synthDef: {
		ugen: "flock.ugen.lfPulse",
		freq: globalFreq/4,
		mul: {
			ugen: "flock.ugen.in",
			bus: 4,
			mul: 0.1
		}
	}
});
            */




    };

    example.SocketSynth.prototype.listen = function () {
        this.oscPort.on("open", this.play.bind(this));
        this.oscPort.on("message", this.mapMessage.bind(this));
        this.oscPort.on("message", function (msg) {
            console.log("message", msg);
        });
        this.oscPort.on("close", this.pause.bind(this));
    };

    example.SocketSynth.prototype.play = function () {
        if (!flock.enviro.shared) {
          flock.init();
        }

        //this.vibratoSynth.play();
        this.synth1.play();
        //this.synth2.play();
        //this.synth3.play();
        //this.synth4.play();

    };

    example.SocketSynth.prototype.pause = function () {
        this.vibratoSynth.pause();
        this.synth1.pause();
        this.synth2.pause();
        this.synth3.pause();
        this.synth4.pause();

    };

    example.SocketSynth.prototype.mapMessage = function (oscMessage) {
        $("#message").text(fluid.prettyPrintJSON(oscMessage));

        var address = oscMessage.address;
        var value = oscMessage.args[0];
        var transformSpec = this.valueMap[address];

        if (transformSpec) {
            var transformed = transformSpec.transform(value);
            var synth = this[transformSpec.synthName];

            synth.set(transformSpec.inputPath, transformed);
        }
    };

}());
