{
  "status":1,
  "msg":"sucess",
  "option":{
    "title": {
        "text": "对数轴示例",
        "left": "center",
        "top": -4,
        "padding":3,
        "textStyle": {
           "fontSize":8
       }
    },
    "tooltip": {
        "trigger": "axis",
        "formatter": "{a} <br/>{b} : {c}"
    },
    "legend": {
        "orient": "vertical",
        "left": "left",
        "data": ["2的指数", "3的指数"],
        "itemWidth": 6,
        "itemHeight":4,
        "itemGap":-4,
        "padding":1,
        "textStyle":{
          "fontSize":7
        }
    },
    "xAxis": {
        "type": "category",
        "show":false,
        "name": "x",
        "splitLine": {"show": false},
        "data": ["一", "二", "三", "四", "五", "六", "七", "八", "九"]
    },
    "yAxis": {
        "show":false,
        "type": "log",
        "name": "y"
    },
    "series": [
        {
            "name": "3的指数",
            "type": "line",
            "data": [1, 3, 9, 27, 81, 247, 81, 27, 247]
        },
        {
            "name": "2的指数",
            "type": "line",
            "data": [1, 2, 4, 8, 16, 32, 64, 16, 32]
        }
    ]
  }
}
