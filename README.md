# grunt-little

> less dirctory walk and compiler for grunt

## 环境依赖
Grunt `~0.4.5`

## 安装
```
$ npm install grunt-little --save-dev
```

## 配置
```
grunt.loadNpmTasks('grunt-little');
```

### 任务配置

```
grunt.initConfig({
    little: {
        compile: {
            files: [{
                src: './test/**/*.less'
            }]
        }
    }
});
```

## 使用

```
$ grunt little:compile
```

