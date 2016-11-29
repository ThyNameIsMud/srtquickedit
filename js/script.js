(function (view) {
var $ = function(id) {
		return document.getElementById(id);
	},
	html              = $("html"),
	text_options_form = $("text-options"),
	text_filename     = $("text-filename"),
	text              = $("text"),
	seconds           = $("seconds"),
	get_blob          = function() {
		return view.Blob;
	},
	text_options_form = $("text-options");

text_options_form.addEventListener("submit", function(event) {
	event.preventDefault();
	var BB    = get_blob(),
	output    = [],
	subtitle  = text.value,
	subtitles = subtitle.split("\n\n");

	subtitles.pop();
	for (var i = subtitles.length - 1; i >= 0; i--) {
		// 1
		// 00:00:12,259 --> 00:00:15,481
		// So it's officially Shooter Season 2016, the\n\n
		
		var section = subtitles[i],
		lines       = section.split("\n"),
		times       = lines[1].split(" --> ");

		times[0] = times[0].replace(/\d+:(\d+):(\d+),\d+/, replaceTime);
		times[1] = times[1].replace(/\d+:(\d+):(\d+),\d+/, replaceTime);

		times    = times.join(" --> ");
		lines[1] = times;

		output[i] = lines.join("\n");
	}

	output = output.join("\n\n");
	output += "\n\n";

	saveAs(
		  new BB(
			  [output]
			, {type: "application/srt;charset=" + document.characterSet}
		)
		, (text_filename.value || text_filename.placeholder) + ".srt"
	);
}, false);

function replaceTime (match, p1, p2, offset, string) {
	var adjust = parseInt(p2, 10) - parseInt(seconds.value, 10)
		str = '';
	if(adjust < 0) {
		var min = (adjust < -10) ? parseInt(p1, 10) - 2 : parseInt(p1, 10) - 1;
		if(min < 10) {
			min = "0"+min;
		}

		adjust = 60 - Math.abs(adjust);
		min = ":" + min + ":";
		string = string.replace(/:(\d+):/, min);
	} else if(adjust < 10) {
		adjust = "0"+adjust;
	}

	str = ":" + adjust + ",";
	return string.replace(/:(\d+),/, str);
}

})(self);