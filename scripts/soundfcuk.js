/* 
 * Copyright (C) 2015 BK-TN
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */


//UNFCUK YOUR SOUND
//This is the collection of javascript functions used to drive the site.
//Rememeber to initialize the soundcloud API before using any of these.

var eOutput = "#output";
var eStatus = "#status";
var eTabs = "#tabs";

var activeTab = null

var itemsPerRequest = 200;
var maxItems = 1000;

var displayMode = "grid";

//Tab class - a tab is a single fetch. Searching opens a new tab.
function Tab(name) {
    this.name = name;
    this.items = [];
    this.canvasItems = [];

    this.addList = function (newItems) {
        this.items.push.apply(this.items, newItems);
        this.update();
        for (var i = 0; i < newItems.length; i++) {
            this.canvasItems.push(new CanvasItem(newItems[i]));
        }
    }

    this.update = function () {

    }

    //Constructor
    var listitem = $("<li></li>")
    $("<a href=\"#\">" + name + "</a>").appendTo(listitem).click(function() {
    	console.log("selected tab " + name)
    	listitem.addClass("selected")
    });
    $("<a href=\"#\" class=\"close\">X</a>").appendTo(listitem).click(function() {
    	console.log("closed tab " + name)
    });

    listitem.appendTo(eTabs)
}

function setStatus(text) {
	$(eStatus).html(text);
}

function setTooltip(text) {
	$("#tooltip").html(text);
}

//use this code later
/*this.fetchSingle = function(uri,uriData,onDone,onError) { 
		SC.get(uri,uriData,function(output,error) {
			if (error !== null) {
				onError(error);
			} else {
				onDone(output);
			}
		});
	};*/