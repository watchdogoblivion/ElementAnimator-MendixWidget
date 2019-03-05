# Element Animator

Adds animations to elements and texts.

## Available Widgets

* CSSAnimator : Adds a wide variety of animations to any element on the page.
* TypingAnimator : Take a string and make it type with the configurations you set.
* TypingAnimatorNoContext : Performs same functionality as TypingAnimator without entity context.

## Dependencies

Mendix 7.22

# CssAnimator Features 

* Add animations to any element on the page
* Adjust the animation delay, the animation duration, and the animation iteration
* Configure whether or not the element dissapears when the animation ends
* Trigger a microflow when the animation ends

## Sample
![Gif of CssAnimator Example](https://github.com/watchdogoblivion/ElementAnimator-MendixWidget/blob/master/assets/EX2.gif)


## Usage
![CssAnimator image](https://github.com/watchdogoblivion/ElementAnimator-MendixWidget/blob/master/assets/CssAnimations.png)
![CssAnimator image](https://github.com/watchdogoblivion/ElementAnimator-MendixWidget/blob/master/assets/CssEvents.png)

# TypingAnimator Features

* Create typing animation with static or dynamic(entity attribute) string.
* Adjust typing speed, start delay, backspeed, back delay, fade out, fade out delay, loopcount, and whether typing is enabled or disabled.
* Select a button that will trigger; the creation of a typed object, the starting, stopping and toggling of the typing animation, that will reset the animation, and destroy the typed object.
* Trigger microflow; after typing is completed, before each string is typed, after each string is typed, when a typing object is destroyed, when the typing is stopped, when the typing starts after stopping, and when the typing is reset.

## Sample

![Gif of TypingAnimator Example](https://github.com/watchdogoblivion/ElementAnimator-MendixWidget/blob/master/assets/Ex.gif)
![Gif of TypingAnimator Example](https://github.com/watchdogoblivion/ElementAnimator-MendixWidget/blob/master/assets/EX1.gif)


## usage
![Gif of CssAnimator image](https://github.com/watchdogoblivion/ElementAnimator-MendixWidget/blob/master/assets/TypedStatic.png)
![Gif of CssAnimator image](https://github.com/watchdogoblivion/ElementAnimator-MendixWidget/blob/master/assets/TypedDynamic.png)
![Gif of CssAnimator image](https://github.com/watchdogoblivion/ElementAnimator-MendixWidget/blob/master/assets/TCustomControls.png)
![Gif of CssAnimator image](https://github.com/watchdogoblivion/ElementAnimator-MendixWidget/blob/master/assets/TEvents.png)

## Sample combined

![Gif of TypingAnimator and CssAnimator Example](https://github.com/watchdogoblivion/ElementAnimator-MendixWidget/blob/master/assets/EX3.gif)

## Notes and tips

* The CSS animator cannot use display inline on the element that is targeted by animate css, but you can use it on its parent. Therefore the CSS animator is Better used on fresh elements instead of building blocks because building blocks come with pre-defined css properties.
* You cannot apply css animation directly to the same element the typed object is using for typing. You can use it on its parent. This is because typed objects use display inine by default and css animations do not.
* You cannot use multiple css animation effects on a single element. To use multiple effects, use element wrappng and add the effects to each layer.
* Avoid using the **static** element selector in a listview, as all the widgets generated in the list view will point to the same element and cause distortion.
* The css property text-align: center can affect the way certain css animations display their animations. 
* Selecting an element for typing is optional. The widget automatically creates a default element and appends it to end of the parent.
* Selecting the element for css animation is optional. It automatically takes the parent node.

## Known Bugs

* There is a bug with the dynamic texts that use the ** to split the texts. In an overview page, if you try to save an object in a popup too fast, it causes a glitch. Use a new page instead of popup to edit an object in order to avoid the bug.