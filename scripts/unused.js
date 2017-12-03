function writeItems(items) {
    //$(eOutput).html("");
    /*var i = 0;
	var interval = setInterval(function () {
		writeItem(items[i]);
		i++;
		if (i >= items.length) {
			clearInterval(interval);
		}
	}, 2);*/
	var writeItem = function(i) {
		//Pick which way to write it
		if (i === undefined || i.kind === undefined) return;
		switch(i.kind) {
			case "track":
				writeTrack(i);
				break;
			case "user":
				writeUser(i);
				break;
		}
	};
	var writeTrack = function(t) {
		//First, figure out which cover image to use
		var coverUrl;
		if (t.artwork_url !== null) {
		    coverUrl = t.artwork_url;
		} else {
			coverUrl = t.user.avatar_url;
		}
		coverUrl = coverUrl.replace("-large", "-small");
		var text = '<a class="item" title="[' + htmlfilter(t.user.username) + '] ' +
				htmlfilter(t.title) + '" href="#"><div class="image track" style="background-image:url(' + coverUrl + ');"></div></a>';
		append(text,function() {
			displayTrack(t);
		});
	};
	var writeUser = function(u) {
		switch(displayMode) {
		    default: //GRID by default
		        var avatarUrl = u.avatar_url.replace("-large","-small");
				var text = '<a class="item" title="' + htmlfilter(u.username) + '" href="#"><div class="image user" style="background-image:url(' + avatarUrl + ');"></div></a>';
				append(text,function() {
					displayUser(u);
				});
				break;
			case 'list':
				var userLink = '<a class="listitem" href="#">' + u.username + '</a>';
				append(userLink, function() {
					displayUser(u);
				});
				break;
		}
		
	};
	var append = function(text,onClick) {
		$(text).hide().appendTo(eOutput).fadeIn(300).click(function() {
			onClick();
		});
	};
	for (var i = 0; i < items.length; i++) {
	    writeItem(items[i]);
	}
	console.log(items.length);
}

function displayTrack(t) {
	var text = "<h2>" + t.user.username + "</h2><h1>" + t.title + "</h1>";
	text += "<p>" + t.description + "</p>";
	text += "<table>";
	text += tr("Genre",t.genre) +
			tr("Created at",t.created_at) +
			tr("Tags",t.tag_list) +
			tr("Plays",t.playback_count) +
			tr("Downloads",t.download_count) +
			tr("Favorites",t.favoritings_count) +
			tr("Comments",t.comment_count);
	text += "</table>";
	$(eOutput).html(text).hide().fadeIn(300);
}

function displayUser(u) {
	var text = "<h1>" + u.username + "</h1>";
	text += '<img src="' + u.avatar_url +'">';
	text += "<p>" + u.description + "</p>";
	/*text += "<table>";
	text += tr("Genre",t.genre) +
			tr("Created at",t.created_at) +
			tr("Tags",t.tag_list) +
			tr("Plays",t.playback_count) +
			tr("Downloads",t.download_count) +
			tr("Favorites",t.favoritings_count) +
			tr("Comments",t.comment_count);
	text += "</table>";*/
	$(eOutput).html(text).hide().fadeIn(300);
	var text2 = '<a href="#">Show following (' + u.followings_count + ')</a>';
	$(text2).appendTo(eOutput).click(function() {
	    new FetchRequest("/users/" + u.id + "/followings/", {}, function (items) { writeItems(items)});
	});
}

function tr(a,b) {
	return "<tr><td>" + a + "</td><td>" + b + "</td></tr>";
}


function htmlfilter(input) {
	var pre = document.createElement('pre');
    var text = document.createTextNode( input );
    pre.appendChild(text);
    return pre.innerHTML.replace(/\"/g,"&quot;").replace(/\'/g,"&#39;");
}