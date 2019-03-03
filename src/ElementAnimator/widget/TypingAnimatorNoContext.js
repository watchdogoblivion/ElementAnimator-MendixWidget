define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "ElementAnimator/lib/typed",
    "ElementAnimator/lib/jquery",

], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, typedJs, _jQuery) {
    "use strict";

    return declare("ElementAnimator.widget.TypingAnimatorNoContext", [ _WidgetBase ], {

        //type.js variables Static
        typedQuery_: null,
        enabled_: null,
        staticTexts_: null,
        buttonCreateTyped_: null,
        typeSpeed_: null,
        startDelay_: null,
        backSpeed_: null,
        backDelay_: null,
        fadeOut_: null,
        fadeOutDelay_: null,
        loopCount_: null,
        cursorChar_: null,
        showCursor_: null,

        //Button Controls
        buttonToggle_: null,
        buttonStart_: null,
        buttonStop_: null,
        buttonDestroy_: null,
        buttonReset_: null,

        //Event Handlers
        microflowOnComplete_: null,
        microflowonDestroy_: null,
        microflowPreStringTyped_: null,
        microflowOnStringTyped_: null,
        microflowOnTypingResumed_: null,
        microflowOnReset_: null,
        microflowOnStop_: null,
        microflowOnStart_: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,
        _typed: null,
        _element: null,
        _staticArray: null,
        _defaultTag: "p",
        _staticClass: "static-styles",

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            console.log("postCreate");
        },

        update: function (obj, callback) {

            logger.debug(this.id + ".update");
            console.log("_update");
            
            this._contextObj = obj;

            //set any dynamic attributes
            this.initializeArray();
            
            //set a button to create a typed object on click 
            if(this.buttonCreateTyped_ && this.buttonCreateTyped_.trim() !== ""){
                
                var button = document.getElementsByClassName(this.buttonCreateTyped_)[0];
                button.onclick = () => {
                    this.typedFunction();
                }
                           
            }else{
                this.typedFunction();
            }

            this.setButtonControls();
  
            this._updateRendering(callback);
        },

        initializeArray: function(){

            this._staticArray = [];
            for(var key in this.staticTexts_) {
                if(this.staticTexts_.hasOwnProperty(key)) {
                    var value = this.staticTexts_[key];
                    for(var k in value) {
                        if(value.hasOwnProperty(k)) {
                            var v = value[k];
                            this._staticArray.push(v);
                        }
                    }
                }
            }

        },

        typedFunction: function(){

            //creates a default element for holding typed object for the widget even if the user specifies another element
            if(!this._element){
                this._element = document.createElement(this._defaultTag);
                //each created widget will have this class
                this._element.classList.add(this._staticClass);
                this._element.style.display = "inline";
                document.getElementById(this.id).parentElement.appendChild(this._element);
            }

            //used to keep track of all existng widgets, an array of all the _element objects for each widget
            var elements = document.getElementsByClassName(this._staticClass);
            if(this._typed){
                this._typed.destroy();
            }  

            //checks if typed object is enabled
            if(this.enabled_){
                //create typed object
                this.generateTyped();
            } else {
                this.setText();
            }

        },

        generateTyped: function(){            
        
            var options = {
                strings: this._staticArray,
                typeSpeed: this.typeSpeed_,
                startDelay: this.startDelay_,
                backSpeed: this.backSpeed_,
                backDelay: this.backDelay_,
                shuffle: false,
                fadeOut: this.fadeOut_,
                fadeOutDelay: this.fadeOutDelay_,
                loopCount: this.loopCount_,
                cursorChar: this.cursorChar_,
                showCursor: this.showCursor_,
                onComplete: () => {
                    
                    if(this.microflowOnComplete_){
                        this._execMf(this.microflowOnComplete_, () => {
                            console.log("Microflow OnComplete");
                        });
                    }
                },
                onDestroy: () => {
                    
                    if(this.microflowonDestroy_){
                        this._execMf(this.microflowonDestroy_, () => {
                            console.log("Microflow OnDestroy");
                        });
                    }
                },
                preStringTyped: () => {

                    if(this.microflowPreStringTyped_){
                        this._execMf(this.microflowPreStringTyped_, () => {
                            console.log("Microflow Pre string typed");
                        });
                    }  
                },
                onStringTyped: () => {

                    if(this.microflowOnStringTyped_){
                        this._execMf(this.microflowOnStringTyped_, () => {
                            console.log("Microflow On string typed");
                        });
                    }
                },
                onTypingResumed: () => {
                    if(this.microflowOnTypingResumed_){
                        this._execMf(this.microflowOnTypingResumed_, () => {
                            console.log("Microflow on Typing Resumed");
                        });
                    }
                },
                onReset: () => {
                    if(this.microflowOnReset_){
                        this._execMf(this.microflowOnReset_, () => {
                            console.log("Microflow on Reset");
                        });
                    }
                },
                onStop: () => {
                    if(this.microflowOnStop_){
                        this._execMf(this.microflowOnStop_, () => {
                            console.log("Microflow on Stop");
                        });
                    }
                },
                onStart: () => {
                    if(this.microflowOnStart_){
                        this._execMf(this.microflowOnStart_, () => {
                            console.log("Microflow on Start");
                        });
                    }
                },
            };

            //checks if there is a designated element on the page for holding typed object
            if(this.typedQuery_){
                var elem = document.getElementsByClassName(this.typedQuery_)[0];
                elem.style.display = "inline";
                this._typed = new typedJs(elem, options);
                console.log("111111111111111111111111")
            } else {
                console.log("222222222222222222")
                this._typed = new typedJs(this._element, options);
            }
        },

        setText: function(){
            console.log("nooooooooooo 222" + this._staticArray)
            var str = "";
            for(var key in this._staticArray) {
                str += " " + this._staticArray[key];
            }

            //checks if there is a designated element on the page for holding typed object
            if(this.typedQuery_){
                var elem = document.getElementsByClassName(this.typedQuery_)[0];
                elem.innerText = str;
            } else {
                this._element.innerText = str;
            }
            
        },

        setButtonControls: function(){
            if(this.buttonToggle_){
                var toggle = document.getElementsByClassName(this.buttonToggle_)[0];
                toggle.onclick = () => {
                    if(this._typed){
                        this._typed.toggle();
                    }
                }
            }
            if(this.buttonStart_){
                var start = document.getElementsByClassName(this.buttonStart_)[0];
                start.onclick = () => {
                    if(this._typed){
                        this._typed.start();
                    }
                }
            }
            if(this.buttonStop_){
                var stop = document.getElementsByClassName(this.buttonStop_)[0];
                stop.onclick = () => {
                    if(this._typed){
                        this._typed.stop();
                    }
                }
            }
            if(this.buttonDestroy_){
                var destroy = document.getElementsByClassName(this.this.buttonDestroy_)[0];
                destroy.onclick = () => {
                    if(this._typed){
                        this._typed.destroy();
                    }
                }
            }
            if(this.buttonReset_){
                var reset = document.getElementsByClassName(this.buttonReset_)[0];
                reset.onclick = () => {
                    if(this._typed){
                        this._typed.reset(true);
                    }
                }
            }
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");
            console.log("resize");
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
            console.log("uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");
            console.log("_updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function (mf, cb) {
            logger.debug(this.id + "._execMf2");
            if (mf) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: []
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["ElementAnimator/widget/TypingAnimatorNoContext"]);

            