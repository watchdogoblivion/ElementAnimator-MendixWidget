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
    "ElementAnimator/lib/jquery",
    "ElementAnimator/lib/animate"


], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery, animate) {
    "use strict";

    //set css classes from animate.css 
    if(!window.Style){
        window.Style = {}; // global Object;
        Style.value = document.createElement('style');
        Style.value.type = 'text/css';
        Style.value.innerHTML = animate.getValue();
        document.getElementsByTagName('head')[0].appendChild(Style.value);
    }

    return declare("ElementAnimator.widget.CSSAnimator", [ _WidgetBase ], {
        
        //animated.css variables static 
        cssQuery_: null,
        cssEnum_: null,
        delay_: null,
        duration_: null,
        iteration_: null,

        //Event handlers
        microflowOnAnimationEnd_: null,
        onAnimationEnd_: null,
    
        // Internal variables.
        _handles: null,
        _contextObj: null,
        _context: null,
        

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

            this.cssFunction();
  
            this._updateRendering(callback);
        },

        cssFunction: function(){

            var cssElement;
            //retreve element that will be animated. If it does not exist, then create one
            if(this.cssQuery_){
                cssElement = document.getElementsByClassName(this.cssQuery_)[0];
            }else {
                this.cssQuery_ = "auto" + this.uniqueid;
                cssElement = document.getElementById(this.id).parentElement;
                cssElement.classList.add(this.cssQuery_);
            }

            //add customization for animations
            Style.value.innerHTML += "." + this.cssQuery_ + 
            "{ animation-duration:" + this.duration_ + "s;" +
            "  animation-delay:" + this.delay_ + "s;" +
            "  animation-iteration-count:" + this.iteration_ + ";}"

            //add animation
            if(this.cssEnum_){
                cssElement.classList.add(this.cssEnum_);
            }

            //add event handler for microflow call
            if(this.microflowOnAnimationEnd_){
                cssElement.addEventListener('animationend', () => { 
                    this._execMf(this.microflowOnAnimationEnd_, () => {
                        console.log("Microflow On Animation End");
                    });
                });
            }

            //add event handlers wheb animation ends
            switch(this.onAnimationEnd_){
                case "removeElementOnAnimationEnd":
                    cssElement.addEventListener('animationend', () => {
                        if(cssElement){
                            cssElement.parentNode.removeChild(cssElement);
                        }    
                    });
                break;
                case "hideVisibilityOnAnimationEnd":
                    cssElement.addEventListener('animationend', () => {
                        if(cssElement){
                            cssElement.style.visibility = "hidden";
                        }   
                    });
                break;
                case "hideDisplayOnAnimationEnd":
                    cssElement.addEventListener('animationend', () => {
                        if(cssElement){
                            cssElement.style.display = 'none';
                        }    
                    });
                break;
                default:
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
            logger.debug(this.id + "._execMf");
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

require(["ElementAnimator/widget/CSSAnimator"]);

            