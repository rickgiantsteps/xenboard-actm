![XenBoard: interactive microtonal keyboard](/images/XenBoard.png)

# Interactive Microtonal Keyboard
XenBoard is an interactive keyboard and synth that allows the user to play with, create and explore microtonal tunings.

The application gives the opportunity to create equally tempered scales and to customize multiple parameters, in order to 
have as much control as possible on the resulting scale.
It also provides the possibility to play with and explore a variety of historical and non equally tempered tunings 
from a vast and detailed database.

![screenshot of the startup of the keyboard](/images/xenboard%20screenshot.png)

The use of tunings that divide the octave into intervals other than those prescribed by European classical tonality
is known as microtonality.

Microtonality provides artists with a greater range of notes to choose from and expands 
their options for harmonic and melodic expression.
It offers a wider spectrum of dissonances and makes it possible to create novel or uncommon chord progressions and keys.

Our objective with this project was to create an easy-to-use and intuitive tool that could bring musicians closer
to understanding this often overlooked field of music.

Technologies used: Vue.js (https://vuejs.org/), Tone.js (https://tonejs.github.io/), 
Tune.js (https://github.com/abbernie/tune)

### General Introduction

On startup, the user is greeted with the classic 12EDO (12 Equal Divisions of the Octave, the usual 12 tone
equal temperament used in the vast majority of western music) system.

The theme of the operating system (dark/light) is automatically detected and the colors
of the instrument are displayed accordingly, the theme can be changed any time by
clicking the moon/sun icon present in the top right corner.

<p align="center">
<img src="images/dark-light%20mode.png" width="400" height="200">
</p>

The keyboard 

polygon

image of polygon

recording

toggle mode button what does it do? . . .

## Creation mode

explanation of creation mode (parameters, ecc . . . )

image

explain . . .

## Exploration mode

explanation of exploration mode (tune.js, search, ecc . . . )

image

explain . . .

## Scale and Melodic Dissonance (Gradus Suavitatis)
On the right-hand side of the instrument the dissonance of the scale is displayed, along with the melodic dissonance.
Both of these values are calculated using Euler's Gradus Function. explain . . .

image of graph and dissonance values

explain . . .

## Harmonic Dissonance (Sethares' algorithm)

In this particular section, as seen in the previous image, we've also implemented a value, that updates in real time, that indicates the current harmonic
dissonance of what's being played. explain . . .

## Synth and Effects

image

explain . . .