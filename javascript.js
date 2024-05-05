var adjective = [
    "Fluffy",
    "Sparkling",
    "Whirling",
    "Majestic",
    "Enchanted",
    "Gleaming",
    "Flickering",
    "Twinkling",
    "Mystical",
    "Giant",
    "Magical",
    "Gentle",
    "Dazzling",
    "Rolling",
    "Cozy"]
var object = [
    "Cloud",
    "Star",
    "Phone",
    "Mountain",
    "Forest",
    "Sword",
    "Candle",
    "Firefly",
    "Potion",
    "Castle",
    "Unicorn",
    "Camera",
    "Rainbow",
    "Hills",
    "Cabin"]
var list;


function generator() {
    document.getElementById("name").innerHTML = adjective[Math.floor(Math.random() * adjective.length)] + " " + object[Math.floor(Math.random() * object.length)];;;
}


if (window.addEventListener) {
    window.addEventListener('load', function () {
        var canvas, context, canvaso, contexto;

        var tool;
        var tool_default = 'line';

        function init() {

            canvaso = document.getElementById('imageView');
            if (!canvaso) {
                alert('Error: I cannot find the canvas element!');
                return;
            }

            if (!canvaso.getContext) {
                alert('Error: no canvas.getContext!');
                return;
            }


            contexto = canvaso.getContext('2d');
            if (!contexto) {
                alert('Error: failed to getContext!');
                return;
            }


            var container = canvaso.parentNode;
            canvas = document.createElement('canvas');
            if (!canvas) {
                alert('Error: I cannot create a new canvas element!');
                return;
            }

            canvas.id = 'imageTemp';
            canvas.width = canvaso.width;
            canvas.height = canvaso.height;
            container.appendChild(canvas);

            context = canvas.getContext('2d');


            var tool_select = document.getElementById('dtool');
            if (!tool_select) {
                alert('Error: failed to get the dtool element!');
                return;
            }
            tool_select.addEventListener('change', ev_tool_change, false);


            if (tools[tool_default]) {
                tool = new tools[tool_default]();
                tool_select.value = tool_default;
            }


            canvas.addEventListener('mousedown', ev_canvas, false);
            canvas.addEventListener('mousemove', ev_canvas, false);
            canvas.addEventListener('mouseup', ev_canvas, false);
        }


        function ev_canvas(ev) {
            if (ev.layerX || ev.layerX == 0) { // Firefox
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            } else if (ev.offsetX || ev.offsetX == 0) { // Opera
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }


            var func = tool[ev.type];
            if (func) {
                func(ev);
            }
        }


        function ev_tool_change(ev) {
            if (tools[this.value]) {
                tool = new tools[this.value]();
            }
        }


        function img_update() {
            contexto.drawImage(canvas, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
        }


        var tools = {};


        tools.pencil = function () {
            var tool = this;
            this.started = false;


            this.mousedown = function (ev) {
                context.beginPath();
                context.moveTo(ev._x, ev._y);
                tool.started = true;
            };


            this.mousemove = function (ev) {
                if (tool.started) {
                    context.lineTo(ev._x, ev._y);
                    context.stroke();
                }
            };


            this.mouseup = function (ev) {
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                    img_update();
                }
            };
        };


        tools.rect = function () {
            var tool = this;
            this.started = false;

            this.mousedown = function (ev) {
                tool.started = true;
                tool.x0 = ev._x;
                tool.y0 = ev._y;
            };

            this.mousemove = function (ev) {
                if (!tool.started) {
                    return;
                }

                var x = Math.min(ev._x, tool.x0),
                    y = Math.min(ev._y, tool.y0),
                    w = Math.abs(ev._x - tool.x0),
                    h = Math.abs(ev._y - tool.y0);

                context.clearRect(0, 0, canvas.width, canvas.height);

                if (!w || !h) {
                    return;
                }

                context.strokeRect(x, y, w, h);
            };

            this.mouseup = function (ev) {
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                    img_update();
                }
            };
        };


        tools.line = function () {
            var tool = this;
            this.started = false;

            this.mousedown = function (ev) {
                tool.started = true;
                tool.x0 = ev._x;
                tool.y0 = ev._y;
            };

            this.mousemove = function (ev) {
                if (!tool.started) {
                    return;
                }

                context.clearRect(0, 0, canvas.width, canvas.height);

                context.beginPath();
                context.moveTo(tool.x0, tool.y0);
                context.lineTo(ev._x, ev._y);
                context.stroke();
                context.closePath();
            };

            this.mouseup = function (ev) {
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                    img_update();
                }
            };
        };

        init();

    }, false);
}
