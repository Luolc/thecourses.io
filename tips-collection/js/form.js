mIsCustomCourse = 0;
mIsCustomTeacher = 0;
mName = "";
mCredit = null;
mTeacher = "";
mTeachersForSelect = new Array();
mTags = new Array();
mTips = "";

function init() {
	$("#div-course-list").hide();
	$("#div-teacher").hide();
	$("#div-teacher-list").hide();
	$("#div-tag").hide();
	$("#div-tag-exist").hide();
	$("#div-tips").hide();
	$("#button-submit").hide();
	
	if ($.cookie("name") && $.cookie("token")) {
		$("greetings").html("欢迎，" + $.cookie("name") + "！");
	} else {
		$.removeCookie("token");
		$.removeCookie("name");
		location.href = "./validate.html";
	}

	$("#textarea-tag-exist").autoHeight();
}

function setCourse(name) {
	$("#input-course-name").val(name);
	$("#htext-search-course").text("重新搜索");
	$("#htext-search-course").show();
	$("#div-course-list").hide();
	$("#div-teacher").show();
	$("#htext-choice-teacher").hide();
	$("#div-teacher-list").show();

	getTeachers();
}

function setTeacher(name) {
	$("#input-teacher-name").val(name);
	$("#htext-choice-teacher").show();
	$("#div-teacher-list").hide();
	$("#div-tag").show();
	$("#div-tag-exist").show();
	$("#div-tips").show();
	$("#button-submit").show();
}

function insertTag(tag) {
	tagJsonObj = new Object();
	tagJsonObj['tag'] = tag;
	for (i = 0; i < mTags.length; ++i) {
		if (mTags[i]['tag'] == tag) return;
	}
	mTags.push(tagJsonObj);
	tags = $("#textarea-tag-exist").val();
	tags = tags + tag + "    ";
	$("#textarea-tag-exist").val(tags);
	$("#textarea-tag-exist").autoHeight();
}

function isEmptyInput(e) {
	return e.val().trim() == "";
}

function search(key) {
	SEARCH_URL = "http://123.56.189.217/thecourses/service/dean/search.php";
	$.ajax({
		type: "GET",
		data: {
			key: key,
			dataType: "jsonp"
		},
		url: SEARCH_URL,
		dataType: "jsonp",
		jsonpCallback: "getSearchResponseCallback",
		success: function(response) {
			// alert(response.code);
			if (response.code == "1000") {
				// alert(JSON.stringify(response));
				ele = $("#input-course-custom-wrapper");
				for (i = 0; i < response.data.length; ++i) {
					ele.before(
						'<div class="choice-row course-row"><div class="choice-text course-name pull-left">' 
						+ response.data[i]['name'] 
						+ '</div><div class="choice-text course-credit pull-right">' 
						+ parseFloat(response.data[i]['credit']).toFixed(1) + '</div></div>');
				}

				// 给待选择课程添加onClickListener
				$(".choice-row.course-row").click(function(e) {
					if ($(e.target).children(".course-name").text() == "") {
						courseName = $(e.target).parent().children(".course-name").text();
						courseCredit = $(e.target).parent().children(".course-credit").text();
					} else {
						courseName = $(e.target).children(".course-name").text();
						courseCredit = $(e.target).children(".course-credit").text();
					}
					mIsCustomCourse = 0;
					mName = courseName;
					mCredit = courseCredit;
					setCourse(courseName);
				});
				$("#div-course-list").show();
				$("#input-course-name").val("");
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

function getTeachers() {
	GET_TEACHER_URL = "http://123.56.189.217/thecourses/service/dean/getTeachers.php";
	if (mIsCustomCourse == 1) {
		mTeachersForSelect = new Array();
		return;
	}
	$.ajax({
		type: "GET",
		data: {
			name: mName,
			credit: mCredit,
			dataType: "jsonp"
		},
		url: GET_TEACHER_URL,
		dataType: "jsonp",
		jsonpCallback: "getTeachersCallback",
		success: function(response) {
			// alert(response.code);
			if (response.code == "1000") {
				// alert(JSON.stringify(response));
				mTeachersForSelect = response.data;
				resetTeacherList();
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

function resetTeacherList() {
	$(".choice-row.teacher-row").remove();
	ele = $("#input-teacher-custom-wrapper");
	for (i = 0; i < mTeachersForSelect.length; ++i) {
		if (mTeachersForSelect[i]['teacher'].trim().length > 0) {
			ele.before('<div class="choice-row teacher-row"><div class="choice-text teacher-name pull-left">'
				+ mTeachersForSelect[i]['teacher'] + '</div></div>');
		}
	}

	$(".choice-row.teacher-row").click(function(e) {
		teacherName = $(e.target).text().trim();
		mIsCustomTeacher = 0;
		mTeacher = teacherName;
		setTeacher(teacherName);
	});
}

function searchAgain() {
	$("#htext-search-course").text("搜索");
	$("#htext-search-course").show();
	$("#input-course-name").val("");
	mName = "";
	mCredit = null;
	mIsCustomCourse = 0;
	$("#input-course-name").attr("disabled", false);
	$("#input-course-name").focus();
	$("#div-course-list").hide();
	$("#div-teacher").hide();
	$("#div-teacher-list").hide();
	$("#div-tag").hide();
	$("#div-tag-exist").hide();
	$("#div-tips").hide();
	$("#button-submit").hide();
	$("#input-teacher-name").val("");
	mTeacher = "";
	mIsCustomTeacher = 0;
	$("#input-tag").val("");
	mTags = new Array();
	$("#textarea-tag-exist").val("");
	$("#textarea-tips").val("");
	mTips = "";
}

$.fn.autoHeight = function() {
	function autoHeight(e) {
		e.style.height = 'auto';
		e.scrollTop = 0;
		e.style.height = e.scrollHeight + 2 + 'px';
	}

	this.each(function() {
		autoHeight(this);
		$(this).on('keyup', function() {
			autoHeight(this);
		});
	});
}

window.onload = function() {
	$(document).ready(function() {
		init();
		// 重新验证
		$("#re-validate").click(function() {
			$.removeCookie("token");
			$.removeCookie("name");
		});

		// 搜索课程
		$("#htext-search-course").click(function() {
			if (isEmptyInput($("#input-course-name"))) {
				alert("空输入无效！");
				return false;
			}
			if ($("#htext-search-course").text() == "搜索") {
				$(".choice-row.course-row").remove();
				key = $("#input-course-name").val().trim();
				$("#htext-search-course").hide();
				$("#input-course-name").attr("disabled", true);
				search(key);
			} else {
				if ($("#input-teacher-name").val() != "" ||
					$("#textarea-tag-exist").val() != "" ||
					$("#textarea-tips").val() != "") {
					if (!confirm("重新搜索将会清空已有的讲师、标签和心得，是否继续？")) {
						return;
					}
				}
				$("#htext-search-course").text("搜索");
				$("#input-course-name").val("");
				mName = "";
				mCredit = null;
				mIsCustomCourse = 0;
				$("#input-course-name").attr("disabled", false);
				$("#input-course-name").focus();
				$("#div-teacher").hide();
				$("#div-teacher-list").hide();
				$("#div-tag").hide();
				$("#div-tag-exist").hide();
				$("#div-tips").hide();
				$("#button-submit").hide();
				$("#input-teacher-name").val("");
				mTeacher = "";
				mIsCustomTeacher = 0;
				$("#input-tag").val("");
				mTags = new Array();
				$("#textarea-tag-exist").val("");
				$("#textarea-tips").val("");
				mTips = "";
			}
		});
		$("#htext-search-again").click(function() {
			searchAgain();
		});

		$("#htext-add-course").click(function() {
			if (isEmptyInput($("#input-course-custom"))) {
				alert("空输入无效！");
				return;
			}
			customCourseName = $("#input-course-custom").val().trim();
			$("#input-course-custom").val("");
			mName = customCourseName;
			mIsCustomCourse = 1;
			setCourse(customCourseName);
		});

		$("#htext-choice-teacher").click(function() {
			$("#htext-choice-teacher").hide();
			$("#div-teacher-list").show();
			$("#input-teacher-name").val("");
			mTeacher = "";
			mIsCustomTeacher = 0;
		});
		
		$("#htext-add-teacher").click(function() {
			if (isEmptyInput($("#input-teacher-custom"))) {
				alert("空输入无效！")
				return;
			}
			customTeacherName = $("#input-teacher-custom").val().trim();
			$("#input-teacher-custom").val("");
			mTeacher = customTeacherName;
			mIsCustomTeacher = 1;
			setTeacher(customTeacherName);
		});

		$("#htext-add-tag").click(function() {
			if (isEmptyInput($("#input-tag"))) {
				alert("空输入无效！");
				return true;
			}
			tag = $("#input-tag").val().trim();
			if (tag.length > 15) {
				alert("标签不得超过15字！");
				return true;
			}
			if (tag.indexOf(' ') >= 0 || tag.indexOf('\t') >= 0) {
				alert("标签中不得包含空格。如果希望输入多个标签，请依次添加。");
				return true;
			}
			$("#input-tag").val("");
			insertTag(tag);
		});

		$("#button-submit").click(function() {
			UPLOAD_TIP_URL = 'http://123.56.189.217/thecourses/service/web/uploadTip.php';
			cname = $("#input-cname").val().trim();
			if (cname == "") {
				alert("昵称不得为空！");
				$("#input-cname").focus();
				return false;
			}
			mTips = $("#textarea-tips").val();
			if (mTips.length <= 137) {
				alert("请满足心得体会的字数要求^_^");
				$("#textarea-tips").focus();
				return false;
			}
			$.ajax({
				type: "POST",
				data: {
					token: $.cookie('token'),
					changeCname: 1,
					cname: cname,
					courseName: mName,
					credit: mCredit,
					teacher: mTeacher,
					isCustomCourse: mIsCustomCourse,
					isCustomTeacher: mIsCustomTeacher,
					tags: JSON.stringify(mTags),
					tip: mTips,
					dataType: "jsonp"
				},
				url: UPLOAD_TIP_URL,
				dataType: "jsonp",
				jsonpCallback: "uploadTipCallback",
				success: function(response) {
					// alert(response.code);
					if (response.code == "1000") {
						alert("提交成功！");
						return;
					} else if (response.code == "1001") {
						alert("当前用户验证失败！请重新验证！");
						$.removeCookie("token");
						$.removeCookie("name");
						location.href = "./validate.html";
					} else if (response.code == "1002") {
						alert("课程识别错误，请尝试填写自定义课程名或讲师。");
						return;
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
			       alert(XMLHttpRequest.status);
			       alert(XMLHttpRequest.readyState);
			       alert(textStatus);
		     	}
			});
			
			return false;
		});

		$("form").on('keypress', function(e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode === 13) {
				if ($("#input-course-name").is(":focus")) {
	            	$("#htext-search-course").click();
	            }
	            if ($("#input-course-custom").is(":focus")) {
	            	$("#htext-add-course").click();
	            }
	            if ($("#input-teacher-custom").is(":focus")) {
	            	$("#htext-add-teacher").click();
	            }
	            if ($("#input-tag").is(":focus")) {
	            	$("#htext-add-tag").click();
	            }
	            if ($("#textarea-tips").is(":focus")) {
	            	return true;
	            }
				// e.preventDefault();
				return false;
			}
		});
	});
}