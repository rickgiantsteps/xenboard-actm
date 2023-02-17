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

<p>
  <img align="left" src="images/dark-light%20mode.png"  width = 400px height = 300px object-fit = cover>
  <br/>
  <br/>
  <br/>
  The theme of the operating system (dark/light) is automatically detected and the colors
  of the instrument are displayed accordingly, this is automated by performing a media query on the window in which the program is running. 
  The theme can be changed at any time by clicking the moon/sun icon present in the top right corner.
</p>

<br clear="left"/>
<br clear="left"/>

The keyboard is displayed under the customizable parameters. It consists of an hexagonal grid
of keys each corresponding to a different note in the created scale. Each octave is colored differently
with an alternating three-colour pattern, this was implemented in order to make it clearer when the scale repeats.

![keyboard screenshot](/images/keyboard.png)

On top of the keyboard there are a few parameters available that the user can interact with, some are only visible depending on the
current mode that has been selected (explained below in the *Keyboard Modes* section of the README) while some are always present and can be interacted with.

These are:
+ **Central Frequency**: corresponds to the frequency of the first note of the central octave created in the scale
+ **Lower/Higher Octaves buttons**: they allow the user to add or remove octaves with respect to the central one
+ **Polyphony**: indicates the maximum numbers of notes that are allowed to play simultaneously (if the number of keys
  pressed is over this number, the first note that was pressed is stopped in order to allow the newer one to play)

The "**Main Tunings**" dropdown menus is always present, but its contents vary (explained in the *Keyboard Modes* section).

A polygon is present above these parameters, showing an alternative visual representation of the scale. The polygon's number of sides is automatically
updated to be equal to the number of notes of the current scale. On each vertex the ratio between the first note of the octave and the others frequencies
of the scale is displayed (clockwise, starting from the top vertex corresponding to the unison).

<p>
  <img align="right" src="images/notes%20polygon.png">
  <br/>
  <br/>
  <br/>
  Everytime a key is pressed a line connects the center to the the vertex on the polygon that corresponds to that particular note. The lines are colored
  depending on which octave is being played (the color corresponds to the one the key has on the keyboard). This allows the user to better understand which 
  notes are being played, even if the melody or harmony spans multiple octaves.
</p>

There's also the possibility to record what is played on the keyboard, listen to the recording once it's stopped and the chance to
eventually download it. The *toggle recording* button is present on the top left of the instrument and, once pressed, it sticks itself to the corner
of the screen following the scrolling of the page, so that the recording can be stopped at any time without having to scroll back to the top of the page.

## Keyboard Modes

The instrument has two main modes: **Creation** and **Exploration**. The main features of the keyboard remain the same but switching between them allows
the user to have more or less control on the temperaments they can create and which scales they have access to.

To switch from one mode to the other all that is required is to press the **Toggle Tuning Mode** button.

### Creation Mode

explanation of creation mode (parameters, ecc . . . )

explain . . .

### Exploration Mode

explanation of exploration mode (tune.js, search, ecc . . . )

![exploration mode screenshot](/images/exploration-mode.png)

explain . . .

## Dissonance Visualization

We analyze . . .

![dissonance graph and values](/images/dissonances.png)

### Scale and Melodic Dissonance (Gradus Suavitatis)

On the right-hand side of the instrument the dissonance of the scale is displayed, along with the melodic dissonance.
Both of these values are calculated using Euler's Gradus Function. explain . . .

![euler's gradus function](/images/euler-gradus.png)

### Harmonic Dissonance (Sethares' algorithm)

In this particular section, we've also implemented a value, which updates in real time, that indicates the current harmonic
dissonance of what's being played.

short alg introduction . . .

![equations used in sethares' algorithm](/images/sethares.jpg)

alg details . . .

## Synth and Effects

![synth and effects screenshot](/images/synth-effects.png)

explain . . .