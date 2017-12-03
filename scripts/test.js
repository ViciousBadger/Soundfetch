var coolTab;

function pagingUpdate() {
	$("#paging-num").html("Page " + (page + 1));
}

$(document).ready(function () {
	//Profiles used for testing likes
	//Erland: 27618420 - shitton of likes
	//BK-TN: 6833649 - small amount of likes
	$("#filter").change(function () {
		$("#output").children().each(function () {
			var tracktitle = $(this).attr("title").toLowerCase();
			var filtertext = $("#filter").val().toLowerCase();
			if (tracktitle.indexOf(filtertext) > -1) {
				//Track matches filter
				$(this).show();
			} else { //Track doesn't match filter
				$(this).hide();
			}
		});
	});
	displayMode = $("#showas").val();
	$("#showas").change(function() {
		displayMode = $("#showas").val();
		writeItems(loadedItems);
	});
	$("#search-query").keyup(function(e) {
		if (e.keyCode === 13) {
			$("#search-go").click();
		}
	});
	$("#search-go").click(function(e) {
		search();
	});
	$("#paging-prev").click(function(e) {
		page -= 1;
		pagingUpdate();

	});
	$("#paging-next").click(function(e) {
		page += 1;
		pagingUpdate();
	});

	coolTab = new Tab("Cool tab");
	activeTab = coolTab
	pagingUpdate();
});

function search() {
	var query = $("#search-query").val();
	var type = $("#search-type").val();
	$(eOutput).html("");
	switch(type) {
	    case "tracks":
	        new FetchRequest("/tracks/", { q: query }, function (items) { coolTab.addList(items) });
		    //mainTab.fetch();
			break;
		case "users":
		    new FetchRequest("/users/", { q: query }, function (items) { writeItems(items); });
			break;
	}
	
	return false;
}