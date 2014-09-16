# SUPERDOKU

A sudoku front end that provides basic features such as *undo*, *check*, and *restart*. A deployed example can be found [here](http://superdoku-master-env-4mm59c2hge.elasticbeanstalk.com/).

## Install

To install and build the app yourself, just fork this repo and run `make install` to install all dependencies. You can then just run `make` to build the app or `make serve` to serve the app to `localhost:9000`.

## Design and Technology

I tried to write the app in a highly structured, modular way to allow maximal extensibility. Since I did not use a full-blown framework, this meant largely relying on OO design principles and a consistent and coherent application structure at the file and dependency level. 

#### Modularity

To help me structure my app at the file level I used the [requirejs](https://github.com/jrburke/almond) module loader to allow me to distribute my javascript code over multiple files and make my internal and external dependencies explicit. `requirejs` is also optimized for the browser and loads modules asynchronously while keeping modules in their own namespaces to avoid pollution of the global namespace.

#### Dependecies

To manage dependencies I used [bower](http://bower.io/), a popular javascript package management tool.

#### Build

To manage the build and deployment process, I used [grunt](http://gruntjs.com/), the popular javascript build tool. You can find the build configuration script for this app [here](https://github.com/sclaxton/superdoku/blob/master/Gruntfile.js).

#### Application Technologies

At the application level, I used [jade](http://jade-lang.com/) to compile programatic templates to html and [sass](http://sass-lang.com/) to compile scss stylesheets to css. These tools allowed me to quickly write semantic and syntatically simple html templates and stylesheets. I also integrated both of these technologies with grunt, which allowed for a really simple build process.

I also used the [bluebird](https://github.com/petkaantonov/bluebird) and [EventEmitter](https://github.com/Wolfy87/EventEmitter) libraries. `bluebird` provided a fast, efficient implementation of the Promise/A+ sepcification. I included a promise architecture to help me manage references to the DOM in a way that kept DOM state as separate from application state as possible. I used `EventEmitter` to facilitate managing the coupling of modules through event-based programming. 

#### Deployment

I deployed the app on an AWS Elastic Beanstalk server. I used the Elastic Beanstalk CLI tool to automate deployment and deploy directly from a git repo.

## Future

I actually plan to add a backend in the next month that provides a crowd-sourced puzzle gallery. Users can login and solve puzzles. For the puzzles that they have solved their solve time gets archived and they have the option to rate the puzzle difficulty on some numeric scale. The difficulty of the puzzle would then be computed by some aggregation of solve time and rating. Further, I plan to make it very simple to add new puzzles to the app puzzle gallery, perhaps including OCR technology allowing users to upload a puzzle by taking a picture of it.
