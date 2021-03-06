/**
 * Created by Ihor on 10.09.2015.
 */
(function () {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        bombPlace,
        bombLength,
        placeContent,
        elemLeft = canvas.offsetLeft,
        elemTop = canvas.offsetTop,
        initBtn = document.getElementById('runSupp'),
        openPlace,
        game;
    initBtn.addEventListener('click', function () {
        bombardir.init();
    });
    canvas.addEventListener('click', function (e) {
        if(game){
            var x = Math.floor((e.pageX - elemLeft) / 20 - 0.2),
                y = Math.floor((e.pageY - elemTop) / 20 - 0.2);
            if (x < 0 || y < 0 || x > 24 || y > 24) {
                return false
            } else {
                bombardir.clickEvent(x, y);
            }
        }
    });
    canvas.addEventListener('contextmenu', function (e) {
        if(game){
            var x = Math.floor((e.pageX - elemLeft) / 20 - 0.25),
                y = Math.floor((e.pageY - elemTop) / 20 - 0.25);
            if (x < 0 || y < 0 || x > 24 || y > 24) {
                return false
            } else {
                bombardir.clickEvent(x, y,'context');
            }
            e.preventDefault();
        }
    });
    var bombardir = {
        init: function () {
            bombLength = (+document.getElementById('bombLength').value > 200
            || +document.getElementById('bombLength').value < 5) ? 20
                : +document.getElementById('bombLength').value;
            placeContent = [];
            placeContent[0] = [0];
            bombPlace = [];
            bombPlace[0] = [0, 0];
            context.fillStyle = 'black';
            openPlace = 0;
            game = true;
            this.buildPlace();
            this.buildBomb();
            this.catchBomb();
        },
        clickEvent: function (x, y, rightClick) {
            if(rightClick){
                if(placeContent[x][y]['status'] === 'close'){
                    if(placeContent[x][y]['type'] === 'flag'){
                        placeContent[x][y]['type'] = 'close';
                        context.fillStyle = '#000';
                        context.fillRect(x * 20 + 1, y * 20 + 1, 19, 19);
                        return false
                    }
                    placeContent[x][y]['type'] = 'flag';
                    context.beginPath();
                    context.fillStyle = '#fff';
                    context.arc(x*20+10.5,y*20+10.5,9,0,Math.PI*2,true);
                    context.moveTo(x*20+10.5,y*20+10.5);
                    context.fill();
                    context.beginPath();
                    context.fillStyle = '#000';
                    context.arc(x*20+10.5,y*20+10.5,6,0,Math.PI,false);
                    context.moveTo(x*20+8,y*20+8);
                    context.arc(x*20+8,y*20+8,1,0,Math.PI*2,true);
                    context.moveTo(x*20+13,y*20+8);
                    context.arc(x*20+13,y*20+8,1,0,Math.PI*2,true);
                    context.stroke();
                }

            } else {
                if (placeContent[x][y]['type'] === 'bomb') {
                    this.gameOver();
                } else {
                    if (placeContent[x][y]['status'] === 'close' && placeContent[x][y]['type'] != 'flag') {
                        this.openOneType(x, y, placeContent[x][y]['type'], 5)
                    }
                }
            }

        },
        openOneType: function (x, y, type, iter) {
            context.fillStyle = '#d9d9d9';
            context.fillRect(x * 20 + 1, y * 20 + 1, 19, 19);
            placeContent[x][y]['status'] = 'open';
            openPlace++;
            context.fillStyle = 'red';
            if (placeContent[x][y]['type'] > 0) {
                context.fillText(placeContent[x][y]['type'], placeContent[x][y]['y'] * 20 + 7, placeContent[x][y]['x'] * 20 + 14);
            }
            if (openPlace == 625 - bombLength) {
                this.gameOver(true);
                return false;
            }
            iter++;
            if (type === 0) {
                var left = setTimeout(function () {
                    if (x > 0) {
                        if (placeContent[x - 1][y]['type'] != 'flag' && placeContent[x - 1][y]['type'] != 'bomb' && placeContent[x - 1][y]['status'] != 'open') {
                            type = placeContent[x - 1][y]['type'];
                            bombardir.openOneType(x - 1, y, type, iter);
                        }
                    }
                }, iter / 2);
                var top = setTimeout(function () {
                    if (y > 0) {
                        if (placeContent[x][y - 1]['type'] != 'flag' && placeContent[x][y - 1]['type'] != 'bomb' && placeContent[x][y - 1]['status'] != 'open') {
                            type = placeContent[x][y - 1]['type'];
                            bombardir.openOneType(x, y - 1, type, iter);
                        }
                    }
                }, iter / 2);
                var right = setTimeout(function () {
                    if (x < 24) {
                        if (placeContent[x + 1][y]['type'] != 'flag' && placeContent[x + 1][y]['type'] != 'bomb' && placeContent[x + 1][y]['status'] != 'open') {
                            type = placeContent[x + 1][y]['type'];
                            bombardir.openOneType(x + 1, y, type, iter);
                        }
                    }
                }, iter / 2);
                var bottom = setTimeout(function () {
                    if (y < 24) {
                        if (placeContent[x][y + 1]['type'] != 'flag' && placeContent[x][y + 1]['type'] != 'bomb' && placeContent[x][y + 1]['status'] != 'open') {
                            type = placeContent[x][y + 1]['type'];
                            bombardir.openOneType(x, y + 1, type, iter);
                        }
                    }
                }, iter / 2);
                var bottomLeft = setTimeout(function () {
                    if (y < 24 && x > 0) {
                        if (placeContent[x - 1][y + 1]['type'] != 'flag' && placeContent[x - 1][y + 1]['type'] != 'bomb' && placeContent[x - 1][y + 1]['status'] != 'open') {
                            type = placeContent[x - 1][y + 1]['type'];
                            bombardir.openOneType(x - 1, y + 1, type, iter);
                        }
                    }
                }, iter / 2);
                var bottomRight = setTimeout(function () {
                    if (y < 24 && x < 24) {
                        if (placeContent[x + 1][y + 1]['type'] != 'flag' && placeContent[x + 1][y + 1]['type'] != 'bomb' && placeContent[x + 1][y + 1]['status'] != 'open') {
                            type = placeContent[x + 1][y + 1]['type'];
                            bombardir.openOneType(x + 1, y + 1, type, iter);
                        }
                    }
                }, iter / 2);
                var topRight = setTimeout(function () {
                    if (y > 0 && x < 24) {
                        if (placeContent[x + 1][y - 1]['type'] != 'flag' && placeContent[x + 1][y - 1]['type'] != 'bomb' && placeContent[x + 1][y - 1]['status'] != 'open') {
                            type = placeContent[x + 1][y - 1]['type'];
                            bombardir.openOneType(x + 1, y - 1, type, iter);
                        }
                    }
                }, iter / 2);
                var topLeft = setTimeout(function () {
                    if (y > 0 && x > 0) {
                        if (placeContent[x - 1][y - 1]['type'] != 'flag' && placeContent[x - 1][y - 1]['type'] != 'bomb' && placeContent[x - 1][y - 1]['status'] != 'open') {
                            type = placeContent[x - 1][y - 1]['type'];
                            bombardir.openOneType(x - 1, y - 1, type, iter);
                        }
                    }
                }, iter / 2);
            }
        },
        gameOver: function (victory) {
            var confir;
            for(var i = 0; i < bombPlace.length; i++){
                context.beginPath();
                context.fillStyle = 'red';
                context.arc(bombPlace[i][0]*20+10.5,bombPlace[i][1]*20+10.5,5,0,Math.PI*2,true);
                context.fill();
            }
            if (victory) {
                confir = confirm('Вы виграли, зіграєте ще?');
                if (confir) {
                    this.init();
                    game = true;
                } else {
                    game = false;
                }
            } else {
                confir = confirm('Вы програли, зіграєте ще?');
                if (confir) {
                    this.init();
                    game = true;
                } else {
                    game = false;
                }
            }
            return false

        },
        buildPlace: function () {
            for (var x = 0, y = 0; y < 25; x++) {
                if (x > 24) {
                    y++;
                    placeContent[y] = [];
                    x = -1;
                    continue;
                }
                placeContent[y][x] = {
                    x: x,
                    y: y,
                    type: 0,
                    status: 'close'
                };
                context.fillRect(x * 20 + 1, y * 20 + 1, 19, 19);
            }
        },
        buildBomb: function () {
            var random_x,
                random_y,
                oneBomb,
                newMass;
            for (var i = 0; i < bombLength; i++) {
                random_x = (Math.ceil((Math.random() * 25))) - 1;
                random_y = (Math.ceil((Math.random() * 25))) - 1;
                oneBomb = true;
                newMass = bombPlace;
                for (var j = 0; j < newMass.length; j++) {
                    if (newMass[j][0] == random_y && newMass[j][1] == random_x) {
                        oneBomb = false;
                        i--;
                        break;
                    }
                }
                if (oneBomb) {
                    placeContent[random_y][random_x]['type'] = 'bomb';
                    bombPlace[i] = [random_y, random_x];
                }
            }
        },
        catchBomb: function () {
            for (var i = 0; i < bombPlace.length; ++i) {
                if (bombPlace[i][0] > 0) {
                    if (placeContent[bombPlace[i][0] - 1][bombPlace[i][1]]['type'] !== "bomb") {
                        context.fillStyle = 'black';
                        context.fillStyle = 'white';
                        placeContent[bombPlace[i][0] - 1][bombPlace[i][1]]['type'] += 1;
                    }
                }
                if (bombPlace[i][1] > 0) {
                    if (placeContent[bombPlace[i][0]][bombPlace[i][1] - 1]['type'] !== "bomb") {
                        context.fillStyle = 'black';
                        context.fillStyle = 'white';
                        placeContent[bombPlace[i][0]][bombPlace[i][1] - 1]['type'] += 1;
                    }
                }
                if (bombPlace[i][0] < 24) {
                    if (placeContent[bombPlace[i][0] + 1][bombPlace[i][1]]['type'] !== "bomb") {
                        context.fillStyle = 'black';
                        context.fillStyle = 'white';
                        placeContent[bombPlace[i][0] + 1][bombPlace[i][1]]['type'] += 1;
                    }
                }
                if (bombPlace[i][1] < 24) {
                    if (placeContent[bombPlace[i][0]][bombPlace[i][1] + 1]['type'] !== "bomb") {
                        context.fillStyle = 'black';
                        context.fillStyle = 'white';
                        placeContent[bombPlace[i][0]][bombPlace[i][1] + 1]['type'] += 1;
                    }
                }
                if (bombPlace[i][1] < 24 && bombPlace[i][0] < 24) {
                    if (placeContent[bombPlace[i][0] + 1][bombPlace[i][1] + 1]['type'] !== "bomb") {
                        context.fillStyle = 'black';
                        context.fillStyle = 'white';
                        placeContent[bombPlace[i][0] + 1][bombPlace[i][1] + 1]['type'] += 1;
                    }
                }
                if (bombPlace[i][1] > 0 && bombPlace[i][0] > 0) {
                    if (placeContent[bombPlace[i][0] - 1][bombPlace[i][1] - 1]['type'] !== "bomb") {
                        context.fillStyle = 'black';
                        context.fillStyle = 'white';
                        placeContent[bombPlace[i][0] - 1][bombPlace[i][1] - 1]['type'] += 1;
                    }
                }
                if (bombPlace[i][1] > 0 && bombPlace[i][0] < 24) {
                    if (placeContent[bombPlace[i][0] + 1][bombPlace[i][1] - 1]['type'] !== "bomb") {
                        context.fillStyle = 'black';
                        context.fillStyle = 'white';
                        placeContent[bombPlace[i][0] + 1][bombPlace[i][1] - 1]['type'] += 1;
                    }
                }
                if (bombPlace[i][0] > 0 && bombPlace[i][1] < 24) {
                    if (placeContent[bombPlace[i][0] - 1][bombPlace[i][1] + 1]['type'] !== "bomb") {
                        context.fillStyle = 'black';
                        context.fillStyle = 'white';
                        placeContent[bombPlace[i][0] - 1][bombPlace[i][1] + 1]['type'] += 1;
                    }
                }
            }
        }
    };
}());
