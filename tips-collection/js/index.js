JOIN_US_URL = "http://123.56.189.217/thecourses/service/recruit/simpleUpload.php";
// JOIN_US_IN_SITE_URL = "../service/recruit/simpleUpload.php";

function sendContact(contact) {
	if (contact == null || contact == "") {
		alert("空输入无效！");
		return;
	}
	$.ajax({
		type: "POST",
		data: {
			contact: contact,
			dataType: "jsonp"
		},
		url: JOIN_US_URL,
		dataType: "jsonp",
		jsonpCallback: "uploadContactCallback",
		success: function(response) {
			// alert(response.code);
			if (response.code == "1000") {
				alert("提交成功！");
				$("#input-contact-account").val("");
				return;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
	       alert(XMLHttpRequest.status);
	       alert(XMLHttpRequest.readyState);
	       alert(textStatus);
     	}
	});
}

function setStatistics() {
	STATISTICS_URL = 'http://123.56.189.217/thecourses/service/web/getStatistics.php';
	$.ajax({
		type: "GET",
		data: {
			dataType: "jsonp"
		},
		url: STATISTICS_URL,
		dataType: "jsonp",
		jsonpCallback: "getStatisticsCallback",
		success: function(response) {
			// alert(response.code);
			if (response.code == "1000") {
				$("#text-joined-count").text(response.data['joined']);
				$("#text-tips-count").text(response.data['tips']);
				$("#text-views-count").text(response.data['views']);
				return;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
	       alert(XMLHttpRequest.status);
	       alert(XMLHttpRequest.readyState);
	       alert(textStatus);
     	}
	});
}

window.onload = function() {
	$(document).ready(function() {
		setStatistics();
		$("#button-join-us").click(function() {
			if ($.cookie("token") && $.cookie("name")) {
				location.href = "./form.html";
			} else {
				location.href = "./validate.html";
			}
		});
		$("#button-submit-contact").click(function() {
			contact = $("#input-contact-account").val().trim();
			sendContact(contact);
			return false;
		});
	});
}