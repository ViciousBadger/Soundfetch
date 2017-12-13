var ctx; //Canvas context

//Pic to show while loading thumbnails
var loading = new Image();
loading.src = "media/carlos.jpg";

var itemSize = 32;
var borderSize = 4;
var totalSize = itemSize + borderSize * 2;

var page = 0;

var mousePos;

$(document).ready(function () {
    ctx = $("#canvas")[0].getContext('2d');

    //Mouse movement test
    $(window).on("mousemove",function(e) {
        var rect = canvas.getBoundingClientRect();
        mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        //console.log(mousePos);
    });

    $("#canvas").click(function() {
        for (var i = 0; i < activeTab.canvasItems.length; i++) {
            activeTab.canvasItems[i].tryclick();
        }
    });
    
    //Main canvas loop
    setInterval(function () {
        ctx.canvas.width = $(ctx.canvas).parent().width();
        ctx.canvas.height = $(ctx.canvas).parent().height();

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        //Draw "canvas items" in tab(should it be done like this?)
        if (activeTab !== null) {
            var items = activeTab.canvasItems;

            var columns = Math.floor(ctx.canvas.width / totalSize);
            var rows = Math.floor(ctx.canvas.height / totalSize);

            var maxItems = columns * rows;

            var physicalIndex = 0;
            for (var i = 0; i < items.length && i < maxItems; i++) {

                var item = items[page * maxItems + i];
                item.update();

                var targetPos = getItemPos(physicalIndex, columns, borderSize);
                item.pos = lerp2d(item.pos, targetPos, 0.6);

                var imageToUse = loading;
                if (isImageOk(item.image)) {
                    imageToUse = item.image;
                }
                ctx.drawImage(imageToUse, item.pos.x, item.pos.y, itemSize, itemSize);
                physicalIndex++;
            }
        }
        
    }, 1000 / 60);
});

function getItemPos(index, columns, bordersize) {
    var column = index % columns;
    var row = Math.floor(index / columns);
    return {
        x: bordersize + column * (totalSize),
        y: bordersize + row * (totalSize)
    }
}

function lerp2d(start, end, t) {
    if (start.x === end.x && start.y === end.y) {
        return end;
    }

    return {
        x: start.x + t * (end.x - start.x),
        y: start.y + t * (end.y - start.y)
    }
}

function getTrackArt(t) {
    var coverUrl;
    if (t.artwork_url !== null) {
        coverUrl = t.artwork_url;
    } else {
        coverUrl = t.user.avatar_url;
    }
    return coverUrl.replace("-large", "-small");
}

function getUserArt(u) {
    return u.avatar_url.replace("-large", "-small");
}

function isImageOk(img) {
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}

function CanvasItem(i) {
    if (i === undefined || i.kind === undefined) {
        return;
    };

    this.pos = {
        x:0,
        y:0
    };

    var imageUrl;
    switch (i.kind) {
        case "track":
            imageUrl = getTrackArt(i);
            break;
        case "user":
            imageUrl = getUserArt(i);
            break;
    }

    this.image = new Image();
    this.image.src = imageUrl;
    this.item = i;
    this.hover = false;

    this.tryclick = function () {
        if (this.hover) {
            var index = activeTab.canvasItems.indexOf(this);
            activeTab.canvasItems.splice(index,1);
        }
    };

    this.update = function() {
        var mouseIsOver = mousePos.x > this.pos.x
        && mousePos.x < this.pos.x + itemSize
        && mousePos.y > this.pos.y
        && mousePos.y < this.pos.y + itemSize;

        if (mouseIsOver && !this.hover) {
            setTooltip("<b>User: </b>" + this.item.user.username + " - <b>Track: </b>" + this.item.title);
            this.hover = true;
        }
        if (!mouseIsOver && this.hover) {
            setTooltip("");
            this.hover = false;
        }

    };
}