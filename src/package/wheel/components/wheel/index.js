Component({
    externalClasses: ["sol-class"],
    properties: {
        areaNumber: {
            type: Number,
            value: 8
        },
        awardNumer: {
            type: Number,
            value: 1
        },
        speed: {
            type: Number,
            value: 16
        },
        mode: {
            type: Number,
            value: 2,
            observer: function observer(e, t) {
                this.setData({
                    deg: 0
                });
            }
        },
        times: {
            type: Number,
            value: 3,
            observer: function observer(e, t) {
                this.setData({
                    left_times: t
                })
            }
        },
        backgroundImg: {
            type: String,
            value: ''
        }
    },
    data: {
        deg: 0,
        singleAngle: "",
        isStart: !1,
        left_times: 0
    },
    methods: {
        init: function init() {
            var e = 360 / this.data.areaNumber;
            this.setData({
                singleAngle: e, //提示的内容,                
                // left_times: this.properties.times
            });
        },
        start: function start() {
            if (this.data.left_times > 0) {
                this.triggerEvent("start");
                this.setData({
                    left_times: this.data.left_times - 1
                })
            } else {
                this.triggerEvent("start");
            }
        },
        begin: function begin() {
            var e = this,
                t = this.data,
                a = t.deg,
                s = t.awardNumer,
                r = t.singleAngle,
                i = t.speed,
                n = t.isStart,
                l = t.mode;
            if (!n) {
                this.data.isStart = !0;
                var o = 0;
                o = 2 == l ? 360 - ((s - 1 + 1) * r + r / 2) : (s - 1) * r + r / 2 + 360;
                var u, d = 360 * (Math.floor(4 * Math.random()) + 4);
                console.log(o),
                    a = 0,
                    this.timer = setInterval(function () {
                        a < d ? a += i : o + d <= (a += u = i < (u = (o + d - a) / i) ? i : u < 1 ? 1 : u) && (a = o + d,
                                e.data.isStart = !1,
                                clearInterval(e.timer),
                                e.triggerEvent("success")),
                            e.setData({
                                singleAngle: r,
                                deg: a,
                                mode: l
                            });
                    }, 1e3 / 60);
            }
        }
    },
    attached: function attached() {
        this.init();
    }
});
