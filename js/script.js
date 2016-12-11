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
		times       = lines[1].split(" --> "),
		out      = [];

		times.forEach(function (t) {
			var subSec = t.split(",").pop();

			t = t.split(":");

			var hours = t[0] * (3600), 
			min       = t[1] * (60),
			sec       = parseInt(t[2], 10),
			total     = hours + min + sec;

			total = total - parseInt(seconds.value, 10);

			out.push(SecondsTohhmmss(total) + "," + subSec);
		});

		times    = out.join(" --> ");
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

var SecondsTohhmmss = function(totalSeconds) {
  var hours   = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

  // round seconds
  seconds = Math.round(seconds * 100) / 100

  var result = (hours < 10 ? "0" + hours : hours);
      result += ":" + (minutes < 10 ? "0" + minutes : minutes);
      result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
  return result;
}

})(self);