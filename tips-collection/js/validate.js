VALIDATE_URL = "http://123.56.189.217/thecourses/service/login/login.php";
IN_SITE_URL = "../service/login/login.php"

function validate(uid, password) {
	$.ajax({
		type: "POST",
		data: {
			uid: uid,
			password: password,
			dataType: "jsonp"
		},
		url: VALIDATE_URL,
		dataType: "jsonp",
		jsonpCallback: "getBasicInfoCallback",
		success: function(response) {
			// alert(response.code);
			if (response.code == "1000") {
				$.cookie('token', response.data.token, { expires: 30 });
				$.cookie('name', response.data.name, { expires: 30 });
				hideLoadingImage();
				setHintText("验证成功！");
				location.href = "./form.html";
				return;
			}
			hideLoadingImage();
			// alert(response.msg);
			setHintText("错误：用户名密码错误或学校服务器异常。");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
	       alert(XMLHttpRequest.status);
	       alert(XMLHttpRequest.readyState);
	       alert(textStatus);
     	}
	});
}

function setHintText(content) {
	$("#text-hint").html(content);
}
function showLoadingImage() {
	$(".sk-folding-cube").css("opacity", 0.6);
	// $(".hint-image-wrapper").show();
}
function hideLoadingImage() {
	$(".sk-folding-cube").css("opacity", 0.0);
	// $(".hint-image-wrapper").hide();
}

window.onload = function() {
	$(document).ready(function() {
		$("#input-password").focus(function() {
			if ($("#input-password").attr("type") == "text") {
				$("#input-password").attr("type", "password");
				$("#input-password").focus();
			}
			return false;
		});
		$("#button-validate").click(function() {
			uid = $("#input-student-id").val();
			password = $("#input-password").val();
			setHintText("验证中......");
			showLoadingImage();
			validate(uid, password);
			return false;
		});
	});
}