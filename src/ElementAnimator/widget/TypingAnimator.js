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

    var $ = jQuery.noConflict(true);

    return declare("ElementAnimator.widget.TypingAnimator", [ _WidgetBase ], {

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
        //cursorChar_: null,
        //showCursor_: null, 

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

        //Attribute variables Dynamic
        tagAttr_: null,
        enabledAttr_: null,
        dynamicText_: null,
        buttonCreateTypedAttr_: null,
        typeSpeedAttr_: null,
        startDelayAttr_: null,
        backSpeedAttr_: null,
        backDelayAttr_: null,
        fadeOutAttr_: null,
        fadeOutDelayAttr_: null,
        loopCountAttr_: null,
        // cursorCharAttr_: null,
        // showCursorAttr_: null,
        
        // Internal variables.
        _handles: null,
        _contextObj: null,
        _typed: null,
        _typedElement: null,
        _dynamicArray: null,
        _staticArray: null,
        _defaultTag: "p",

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

            //suscribe to object changes and update typing object fields
            this.subscription();

            //set any dynamic attributes
            if(this._contextObj){
                this.setAttributes();
            }else{
                this.uninitialize();
            }
            
            
            //set a button to create a typed object on click 
            if(this.buttonCreateTyped_ && this.buttonCreateTyped_.trim() !== ""){
                
                var button = document.getElementsByClassName(this.buttonCreateTyped_)[0];
                button.onclick = () => {
                    this.typedFunction();
                }
                           
            }else{
                this.typedFunction();
            }

            //adds custom button controls for typing object
            this.setButtonControls();

            this._updateRendering(callback);
        },

        //when an attrbte changes set the updated fields
        subscription: function(){
            this.subscribe({
                guid: this.checkExists(),
                callback: function(guid) {

                    if(this._contextObj){
                        this.setAttributes();
                    }else{
                        this.uninitialize();
                    }
                    
                    if(this._typed){
                        this._typed.strings = this._staticArray;
                        this._typed.typeSpeed = this.typeSpeed_,
                        this._typed.startDelay = this.startDelay_,
                        this._typed.backSpeed = this.backSpeed_,
                        this._typed.backDelay = this.backDelay_,
                        this._typed.shuffle = false,
                        this._typed.fadeOut = this.fadeOut_,
                        this._typed.fadeOutDelay = this.fadeOutDelay_,
                        this._typed.loopCount = this.loopCount_
                        //this._typed.cursorChar = this.cursorChar_,
                        //this._typed.showCursor = this.showCursor_
                    }  
                }
            });
        },

        checkExists: function(){
            if(this._contextObj){
                return this._contextObj.getGuid();
            }else{
                return null;
            }
        },

        setAttributes: function(){

            var text = this._contextObj.get(this.dynamicText_)
            if(!text || text.trim() == ""){
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
            } else {
                this._dynamicArray = this._contextObj.get(this.dynamicText_).split("**");
            }

            if(this.buttonCreateTypedAttr_){
                this.buttonCreateTyped_ = this._contextObj.get(this.buttonCreateTypedAttr_);
            }

            var tAttr = this._contextObj.get(this.tagAttr_)
            if(tAttr && tAttr.trim() != ""){
                this._defaultTag = tAttr;
            }

            if(this.enabledAttr_){
                this.enabled_ = this._contextObj.get(this.enabledAttr_);
            }         
            if(this.typeSpeedAttr_){
                this.typeSpeed_ = this._contextObj.get(this.typeSpeedAttr_);
            }
            if(this.startDelayAttr_){
               this.startDelay_ = this._contextObj.get(this.startDelayAttr_);
            }
            if(this.backSpeedAttr_){
                this.backSpeed_ = this._contextObj.get(this.backSpeedAttr_);
            }
            if(this.backDelayAttr_){
                this.backDelay_ = this._contextObj.get(this.backDelayAttr_);
            }
            if(this.fadeOutAttr_){
                this.fadeOut_ = this._contextObj.get(this.fadeOutAttr_);
            }
            if(this.fadeOutDelayAttr_){
                this.fadeOutDelay_ = this._contextObj.get(this.fadeOutDelayAttr_);
            }
            if(this.loopCountAttr_){
                this.loopCount_ = this._contextObj.get(this.loopCountAttr_);
            }
            // if(this.cursorCharAttr_){
            //     this.cursorChar_ = this._contextObj.get(this.cursorCharAttr_);
            // }
            // if(this.showCursorAttr_){
            //     this.showCursor_ = this._contextObj.get(this.showCursorAttr_);
            // }
            if(this._dynamicArray){
                this._staticArray = this._dynamicArray;
            }

        },

        typedFunction: function(){

            //creates a default element for holding typed object for the widget even if the user specifies another element
            if(!this._typedElement){
                this._typedElement = document.createElement(this._defaultTag);
                this._typedElement.style.display = "inline";
                document.getElementById(this.id).parentElement.appendChild(this._typedElement);
            }

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
                cursorChar: "|",
                showCursor: false,
                onComplete: () => {

                    if(this.microflowOnComplete_){
                        this._execMf(this.microflowOnComplete_, this._contextObj.getGuid(), () => {
                            console.log("Microflow OnComplete");
                        });
                    }
                },
                onDestroy: () => {
                    
                    if(this.microflowonDestroy_){
                        this._execMf(this.microflowonDestroy_, this._contextObj.getGuid(), () => {
                            console.log("Microflow OnDestroy");
                        });
                    }
                },
                preStringTyped: () => {

                    if(this.microflowPreStringTyped_){
                        this._execMf(this.microflowPreStringTyped_, this._contextObj.getGuid(), () => {
                            console.log("Microflow Pre string typed");
                        });
                    }  
                },
                onStringTyped: () => {

                    if(this.microflowOnStringTyped_){
                        this._execMf(this.microflowOnStringTyped_, this._contextObj.getGuid(), () => {
                            console.log("Microflow On string typed");
                        });
                    }
                },
                onTypingResumed: () => {
                    if(this.microflowOnTypingResumed_){
                        this._execMf(this.microflowOnTypingResumed_, this._contextObj.getGuid(), () => {
                            console.log("Microflow on Typing Resumed");
                        });
                    }
                },
                onReset: () => {
                    if(this.microflowOnReset_){
                        this._execMf(this.microflowOnReset_, this._contextObj.getGuid(), () => {
                            console.log("Microflow on Reset");
                        });
                    }
                },
                onStop: () => {
                    if(this.microflowOnStop_){
                        this._execMf(this.microflowOnStop_, this._contextObj.getGuid(), () => {
                            console.log("Microflow on Stop");
                        });
                    }
                },
                onStart: () => {
                    if(this.microflowOnStart_){
                        this._execMf(this.microflowOnStart_, this._contextObj.getGuid(), () => {
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
            } else {
                this._typed = new typedJs(this._typedElement, options);
            }


            console.log("Typed Object created")
        },

        setText: function(){

            var str = "";
            for(var key in this._staticArray) {
                str += " " + this._staticArray[key];
            }

             //checks if there is a designated element on the page for holding text
             if(this.typedQuery_){
                var elem = document.getElementsByClassName(this.typedQuery_)[0];
                elem.innerText = str;
            } else {
                this._typedElement.innerText = str;
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
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
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

require(["ElementAnimator/widget/TypingAnimator"]);

            