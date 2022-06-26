# Debugger for Zen

Adds debugger support for ZenScript

## Using Debugger for Zen

**Note: In order to have access of local variables, a [special fork](https://github.com/warmthdawn/CraftTweaker) of crafttweaker should be use instead of official one**


* Install the **Debugger for Zen** extension in VS Code.
* Open the minecraft game path (which has folders scripts, mods, etc )
* Run your minecraft with following jvm arguements
```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address={port}
```
* Select the debug environment "ZenScript: Attach VM".
* Change your debug port
* Press the green 'play' button to start debugging.

You can now 'step through' the `readme.md` file, set and hit breakpoints, and run into exceptions (if the word exception appears in a line).


## Build and Run

* Clone the project [https://github.com/warmthdawn/debugger-for-zen.git](https://github.com/warmthdawn/debugger-for-zen.git)
* Open the project folder in VS Code.
* Press `F5` to build and launch it in another VS Code window.
