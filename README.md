![XenBoard: interactive microtonal keyboard](/images/XenBoard.png)

# Interactive Microtonal Keyboard
XenBoard is an interactive keyboard and synth that allows the user to play with, create and explore microtonal tunings.

The application gives the opportunity to create equally tempered scales and to customize multiple parameters, in order to
have as much control as possible on the resulting scale.
It also provides the possibility to play with and explore a variety of historical and non equally tempered tunings
from a vast and detailed database.

Libraries used: 
+ Tone.js (https://tonejs.github.io/),
+ Tune.js (https://github.com/abbernie/tune)
+ p5.js (https://github.com/processing/p5.js)

![screenshot of the startup of the keyboard](/images/xenboard%20screenshot.png)

The use of tunings that divide the octave into intervals other than those prescribed by European classical tonality
is known as microtonality.

Microtonality provides artists with a greater range of notes to choose from and expands
their options for harmonic and melodic expression.
It offers a wider spectrum of dissonances and makes it possible to create novel or uncommon chord progressions and keys.

Our objective with this project was to create an easy-to-use and intuitive tool that could bring musicians closer
to understanding this often overlooked field of music.

### General Introduction

On startup, the user is greeted with the classic 12EDO (12 Equal Divisions of the Octave, the usual 12 tone
equal temperament used in the vast majority of western music) system.

<p>
  <img align="left" src="images/dark-light%20mode.png"  width = 300px height = 300px object-fit = cover>
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

Above the keyboard there are a few parameters available that the user can interact with, some are only visible depending on the
current mode that has been selected (explained below in the *Keyboard Modes* section of the README) while some are always present and can be interacted with.

These are:
+ **Central Frequency**: corresponds to the frequency of the first note of the central octave created in the scale
+ **Lower/Higher Octaves buttons**: they allow the user to add or remove octaves with respect to the central one
+ **Polyphony**: indicates the maximum numbers of notes that are allowed to play simultaneously (if the number of keys
  pressed is over this number, the first note that was pressed is stopped in order to allow the newer one to play)

The "**Main Tunings**" dropdown menus is always present, but its contents vary (explained in the *Keyboard Modes* section).

A polygon is present above these parameters, showing an alternative visual representation of the scale. The polygon's number of sides is automatically
updated to be equal to the number of notes of the current scale. On each vertex the ratio between the first note of the octave and the others frequencies
of the scale is displayed (clockwise, starting from the top vertex corresponding to the unison). It's implemented using the p5.js library.

<p>
  <img align="right" src="images/notes%20polygon.png" width = 400px height = 400px object-fit = cover>
  <br/>
  <br/>
  <br/>
  <br/>
  Everytime a key is pressed a line connects the center to the the vertex on the polygon that corresponds to that particular note. The lines are colored
  depending on which octave is being played (the color corresponds to the one the key has on the keyboard). This allows the user to better understand which 
  notes are being played, even if the melody or harmony spans multiple octaves.
</p>

<br clear="right"/>
<br clear="right"/>

There's also the possibility to record what is played on the keyboard, listen to the recording once it's stopped and the chance to
eventually download it. The *toggle recording* button is present on the top left of the instrument and, once pressed, it sticks itself to the corner
of the screen following the scrolling of the page, so that the recording can be stopped at any time without having to scroll back to the top of the page.

## Keyboard Modes

The instrument has two main modes: **Creation** and **Exploration**. The main features of the keyboard remain the same but switching between them allows
the user to have more or less control on the temperaments they can create and which scales they have access to.

To switch from one mode to the other all that is required is to press the **Toggle Tuning Mode** button.

### Creation Mode

In this mode the user can customize their own equally tempered tuning, meaning that every note is equally spaced in the selected interval (depends on the value
of the "**root**" parameter). 

The parameters that can only be interacted with exclusively in this mode are:
+ **Note Number**: the number of notes in which the selected interval (determined by the value of the "**Root**" parameter) will be divided into
+ **Root**: the interval used in the calculation of the scale, it indicates the range of frequencies that will be used in the creation of the scale. By default this value is equal to two, in this case the range is equal to the "octave" (interval 1:2), there's also the option to use the "tritave" (1:3) and the intervals 1:4 and 1:5

These two values are used in the computation of the scale: each consecutive note, starting from the central frequency, will be multiplied by the nth root of the value selected in the parameter **Root**, creating the desired equally tempered scale.

In this mode the **Main Tunings** dropdown contains the most known and commonly used EDO (Equal Division of the Octave) systems, in order to give quick access to some useful tunings with no experimentation needed.

### Exploration Mode

In this second mode there's less control regarding the customization of the temperament in favor of a wider choice of predefined historical tunings and other systems used in other musical cultures around the globe. <br/> The user will not be able to adjust the number of notes or the ratio used to create the scale, they will have the possibility though to search for and choose from the numerous scales present in the database provided by **tune.js**.

![exploration mode screenshot](/images/exploration-mode.png)

In the **Main Tunings** dropdown in this mode there are some of the more popular and known non equally tempered scales, these are both historical european tunings that are seldom used nowadays and tunings that are used to this days in other parts of the world.

To not limit the user to these few predefined tunings, **tune.js**' database of over 3000 tunings was integrated into the project. This DB is accessible by using the appropriate input search field present in this mode. The tunings that are available to be selected can be viewed by clicking on the green highlighted text next to the search field (https://abbernie.github.io/tune/scales.html). <br/> In this webpage provided by tune.js all the descriptions of the tuning systems can be read and the corresponding value copied and then pasted into the instrument, which then allows to click on and load the chosen temperament. <br/> There's also the possibility to search for the desired tuning within XenBoard itself, since the app automatically filters the database to provide options matching the input of the search, allowing to choose from a range of tunings (as is shown in the previous screenshot). 

## Dissonance Visualization

Since microtonality is often a foreign concept to many musicians and users, further visualisations of the qualities of the temperaments that can be selected or created using XenBoard
are implemented. <br/> A graph, implemented with **p5.js**, displays the pleasantness (calculated using Euler's Gradus, explained in the next section) of each interval present in the scale along with value of its average and total Gradus. <br/> In addition the same method is used to calculate the melodic dissonance of what the user is playing, along with the harmonic dissonance (this last one uses a different algorithm, explained in its section of the README). Both of these two values are updated in real time as they follow the performance.

![dissonance graph and values](/images/dissonances.png)

### Scale and Melodic Dissonance (Gradus Suavitatis)

On the right-hand side of the instrument the dissonance of the scale is displayed, along with the melodic dissonance.
Both of these values are calculated using Euler's Gradus Function. explain . . .

![euler's gradus function](/images/euler-gradus.png)

### Harmonic Dissonance (Sethares' algorithm)

In this particular section, a value was also implemented, which updates in real time, that indicates the current harmonic
dissonance of what's being played.

short alg introduction . . .

![equations used in sethares' algorithm](/images/sethares.jpg)

alg details . . .

## Synth and Effects

explain how it was implemented with tone.js

![synth and effects screenshot](/images/synth-effects.png)

explain . . .
