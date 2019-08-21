# fs_ap

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [VUE_CLI官方文档](https://cli.vuejs.org/zh/config/).
### 目录说明
```
public 目录         //不会被编译的静态文件区
public/configure       //前端工程的一些配置文件
public/download       //用于提供可下载文件的目录 
public/static        //放置一些无需编译的文件 
public/vendor       //放置一些无需编译的插件 （直接通过html引入的）


src目录           //会被编译的主目录
src/assets       //公用文件目录
src/fs-business  //使用频率较低的全局组件
src/fs-element   //使用频率较高的全局组件
src/pages        //本工程的分页模块
src/pages/home_designer        //首页工作台的设计器
src/pages/index        //工程的主页面
src/pages/login        //登录页面
src/pages/template_designer        //模板设计器
src/Ueditor      //工程中用到的富文本插件

```