# grunt-little

> compile less files and output the corresponding css file with the same name in the same directory.

## Environment
Grunt `~0.4.5`

## Install
```
$ npm install grunt-little --save-dev
```

## Config
```
grunt.loadNpmTasks('grunt-little');
```

## Task Config

```
grunt.initConfig({
    little: {
        compile: {
            //base file, can be used to define base variables for example.
            options: {
                baseFiles: ['./test/common/*.less']
            },
            
            files: [{
                src: './test/src/**/*.less'
            }]
        }
    }
});
```

## Usage

```
$ grunt little:compile
```

