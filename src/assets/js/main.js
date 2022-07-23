"user strict";

// Preloader
$(window).on("load", function () {
	$(".preloader").fadeOut(1000);
});

// Menu Click Event
let trigger = $(".header-trigger");
let dropdown = $(".menu");
if (trigger || dropdown) {
	trigger.each(function () {
		$(this).on("click", function (e) {
			e.stopPropagation();
			dropdown.toggleClass("active");
			trigger.toggleClass("active");
		});
	});
	dropdown.each(function () {
		$(this).on("click", function (e) {
			e.stopPropagation();
		});
	});
	$(document).on("click", function () {
		if (parseInt(screenSize) < parseInt(991)) {
			dropdown.removeClass("active");
			trigger.removeClass("active");
		}
	});
}

$(".menu-close").on("click", function () {
	$(".menu").slideUp();
});

//Menu Dropdown
$("ul>li>.sub-menu").parent("li").addClass("has-sub-menu");

let screenSize = window.innerWidth;
window.addEventListener("resize", function (e) {
	screenSize = window.innerWidth;
});

$(".menu li a").on("click", function (e) {
	if (parseInt(screenSize) < parseInt(991)) {
		$(this).siblings(".sub-menu").slideToggle();
	}
});

$(".footer-widget__title").on("click", function (e) {
	if (parseInt(screenSize) < parseInt(575)) {
		$(this).siblings(".links").slideToggle();
	}
});

$(".filter-widget__title").on("click", function (e) {
	$(this).siblings(".filter-widget__content").slideToggle();
});

// Sticky Menu
var header = document.querySelector(".header");
if (header) {
	window.addEventListener("scroll", function () {
		header.classList.toggle("sticky", window.scrollY > 0);
	});
}

// Scroll To Top
var scrollTop = $(".scrollToTop");
$(window).on("scroll", function () {
	if ($(this).scrollTop() < 500) {
		scrollTop.removeClass("active");
	} else {
		scrollTop.addClass("active");
	}
});

//Click event to scroll to top
$(".scrollToTop").on("click", function () {
	$("html, body").animate(
		{
			scrollTop: 0,
		},
		300
	);
	return false;
});

$(".brand-slider").slick({
	fade: false,
	slidesToShow: 6,
	slidesToScroll: 1,
	infinite: true,
	autoplay: true,
	pauseOnHover: true,
	centerMode: false,
	dots: false,
	arrows: false,
	nextArrow: '<i class="las la-arrow-right arrow-right"></i>',
	prevArrow: '<i class="las la-arrow-left arrow-left"></i> ',
	responsive: [
		{
			breakpoint: 1199,
			settings: {
				slidesToShow: 5,
			},
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 5,
			},
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 4,
			},
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 3,
			},
		},
	],
});

//Faq
$(".faq-item__title").on("click", function (e) {
	var element = $(this).parent(".faq-item");
	if (element.hasClass("open")) {
		element.removeClass("open");
		element.find(".faq-item__content").removeClass("open");
		element.find(".faq-item__content").slideUp(300, "swing");
	} else {
		element.addClass("open");
		element.children(".faq-item__content").slideDown(300, "swing");
		element.siblings(".faq-item").children(".faq-item__content").slideUp(300, "swing");
		element.siblings(".faq-item").removeClass("open");
		element.siblings(".faq-item").find(".faq-item__content").slideUp(300, "swing");
	}
});

// Active Path Active
var path = location.pathname.split("/");
var current = location.pathname.split("/")[path.length - 1];
$(".menu li a").each(function () {
	if ($(this).attr("href").indexOf(current) !== -1 && current != "") {
		$(this).addClass("active");
	}
});

let scheduleId = $("#schedule");
let nowId = $("#now");

scheduleId.on("change", function (e) {
	if ((scheduleId.checked = true)) {
		scheduleId.parent(".form-group").siblings(".form-select").removeAttr("disabled", "");
	}
});

nowId.on("change", function (e) {
	if ((nowId.checked = true)) {
		scheduleId.parent(".form-group").siblings(".form-select").attr("disabled", "");
	}
});

$("#details-item-remove-btn").on("click", function () {
	$("#details-item-remove-btn").closest(".details-item").remove();
});

$(".minus-plus").on("click", function () {
	var oldValue = $(this).siblings("input").val();
	if ($(this).hasClass("cart-plus")) {
		var newVal = parseFloat(oldValue) + 01;
	} else {
		if (oldValue > 1) {
			var newVal = parseFloat(oldValue) - 01;
		} else {
			newVal = 01;
		}
	}
	$(this).siblings("input").val(newVal);
});
