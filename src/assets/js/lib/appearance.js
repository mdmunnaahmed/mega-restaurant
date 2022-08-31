class VideoPlayer {
	constructor() {
		var self = this;

		this.video = document.getElementById("video_playback");
		this.videoControls = document.getElementById("video-controls");
		this.playButton = document.getElementById("play");
		this.playbackIcons = document.querySelectorAll(".playback-icons use");
		this.timeElapsed = document.getElementById("time-elapsed");
		this.progressBar = document.getElementById("progress-bar");
		this.seek = document.getElementById("seek");
		this.seekTooltip = document.getElementById("seek-tooltip");
		this.volumeButton = document.getElementById("volume-button");
		this.volumeIcons = document.querySelectorAll(".volume-button use");
		this.volumeMute = document.querySelector('use[href="#volume-mute"]');
		this.volumeLow = document.querySelector('use[href="#volume-low"]');
		this.volumeHigh = document.querySelector('use[href="#volume-high"]');
		this.volume = document.getElementById("volume");
		this.playbackAnimation = document.getElementById("playback-animation");
		this.fullscreenButton = document.getElementById("fullscreen-button");
		this.videoContainer = document.getElementById("video-container");
		this.fullscreenIcons = this.fullscreenButton.querySelectorAll("use");
		this.speedButton = document.getElementById("speed-button");
		this.speedMenu = document.getElementById("speed-menu");
		this.speedMenuItems = document.querySelectorAll(".speed-menu li");
		this.subtitlesButton = document.getElementById("subtitles-button");
		this.subtitlesMenu = document.getElementById("subtitles-menu");
		this.subtitlesMenuItems = document.querySelectorAll(".subtitles-menu li");

		this.spinner = document.getElementById("spinner");
		this.started = false;

		this.videoWorks = !!document.createElement("video").canPlayType;

		if (this.videoWorks) {
			this.video.controls = false;
			this.videoControls.classList.remove("hidden");
		}

		this.playButton.addEventListener("click", this.togglePlay.bind(this));
		this.video.addEventListener("play", this.updatePlayButton.bind(this));
		this.video.addEventListener("pause", this.updatePlayButton.bind(this));
		this.video.addEventListener("durationchange", this.initializeVideo.bind(this));
		this.video.addEventListener("timeupdate", this.updateTimeElapsed.bind(this));
		this.video.addEventListener("timeupdate", this.updateProgress.bind(this));
		this.video.addEventListener("volumechange", this.updateVolumeIcon.bind(this));
		this.video.addEventListener("click", this.togglePlay.bind(this));
		this.video.addEventListener("mouseenter", this.showControls.bind(this));
		this.video.addEventListener("mouseleave", this.hideControls.bind(this));
		this.videoControls.addEventListener("mouseenter", this.showControls.bind(this));
		this.videoControls.addEventListener("mouseleave", this.hideControls.bind(this));
		this.seek.addEventListener("mousemove", this.updateSeekTooltip.bind(this));
		this.video.addEventListener("mousemove", this.checkControls.bind(this));
		this.seek.addEventListener("input", this.skipAhead.bind(this));
		this.volume.addEventListener("input", this.updateVolume.bind(this));
		this.volumeButton.addEventListener("click", this.toggleMute.bind(this));
		this.fullscreenButton.addEventListener("click", this.toggleFullScreen.bind(this));
		this.videoContainer.addEventListener("fullscreenchange", this.updateFullscreenButton.bind(this));
		this.videoContainer.addEventListener("mouseleave", this.hideSubtitleMenu.bind(this));

		if (this.speedButton) {
			this.speedButton.addEventListener("click", this.toggleSpeedMenu.bind(this));
		}

		if (this.subtitlesButton) {
			this.subtitlesButton.addEventListener("click", this.toggleSubtitleMenu.bind(this));
		}

		if (window.screenfull.isEnabled) {
			var videoPlayback = document.getElementById("video_playback");

			window.screenfull.on("change", () => {
				if (window.screenfull.isFullscreen) {
					videoPlayback.classList.add("video-playback-fullscreen");
				} else {
					videoPlayback.classList.remove("video-playback-fullscreen");
				}
			});
		}

		// hide subtitle dialog when clicked outside
		window.addEventListener("click", function (e) {
			if (self.speedMenu && self.speedButton && !self.speedMenu.contains(e.target) && !self.speedButton.contains(e.target)) {
				self.speedButton.classList.remove("button-active");
				self.speedButton.classList.add("button-inactive");
				document.getElementById("speed").getElementsByTagName("path")[0].setAttribute("fill", "#fff");
				document.getElementById("speed").getElementsByTagName("path")[1].setAttribute("fill", "#fff");
				self.speedMenu.classList.add("hidden");
			}

			if (self.subtitlesMenu && self.subtitlesButton && !self.subtitlesMenu.contains(e.target) && !self.subtitlesButton.contains(e.target)) {
				self.subtitlesButton.classList.remove("button-active");
				self.subtitlesButton.classList.add("button-inactive");
				document.getElementById("captions").getElementsByTagName("path")[0].setAttribute("fill", "#fff");
				document.getElementById("captions").getElementsByTagName("path")[1].setAttribute("fill", "#fff");
				self.subtitlesMenu.classList.add("hidden");
			}
		});

		this.speedMenuItems.forEach(function (item) {
			item.addEventListener("click", self.setVideoSpeed.bind(self));
		});

		this.subtitlesMenuItems.forEach(function (item) {
			item.addEventListener("click", self.showTranslations.bind(self));
		});

		setTimeout(function () {
			self.showVideoModalButtons = document.querySelectorAll(".show-video-modal");
			self.showVideoModalButtons.forEach(function (item) {
				item.addEventListener("click", self.showVideoModal.bind(self));
			});
		}, 1000);
	}

	togglePlay() {
		if (this.video.paused || this.video.ended) {
			this.video.play();
			this.playbackAnimation.classList.add("hidden");
		} else {
			this.video.pause();
			this.playbackAnimation.classList.remove("hidden");
		}
	}

	updatePlayButton() {
		this.playbackIcons.forEach((icon) => icon.classList.toggle("hidden"));

		if (this.video.paused) {
			this.playbackAnimation.classList.remove("hidden");
			this.playButton.setAttribute("data-title", "Play");
			this.showControls();
		} else {
			this.playbackAnimation.classList.add("hidden");
			this.playButton.setAttribute("data-title", "Pause");
			this.hideControls();
		}
	}

	formatTime(timeInSeconds = 0) {
		if (isNaN(timeInSeconds)) {
			timeInSeconds = 0;
		}
		const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

		return {
			minutes: result.substr(3, 2),
			seconds: result.substr(6, 2),
		};
	}

	initializeVideo() {
		if (isFinite(this.video.duration)) {
			let videoDuration = Math.round(this.video.duration);
			this.seek.setAttribute("max", videoDuration);
			this.progressBar.setAttribute("max", videoDuration);
			this.playbackAnimation.classList.remove("hidden");
		}

		if (!this.started) {
			this.videoControls.classList.remove("hide");
		}
	}
	updateTimeElapsed() {
		const time = this.formatTime(Math.round(this.video.currentTime));
		this.timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
		this.timeElapsed.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
	}

	updateProgress() {
		this.seek.value = this.video.currentTime;
		this.progressBar.value = this.video.currentTime;
	}

	updateSeekTooltip(event) {
		const skipTo = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute("max"), 10));
		this.seek.setAttribute("data-seek", skipTo);
		const t = this.formatTime(skipTo);
		this.seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
		const rect = this.progressBar.getBoundingClientRect();
		this.seekTooltip.style.left = `${event.pageX - rect.left}px`;
	}

	skipAhead(event) {
		const skipTo = event.target.dataset.seek;
		this.video.currentTime = skipTo;
		this.progressBar.value = skipTo;
		this.seek.value = skipTo;
	}

	updateVolume() {
		if (this.video.muted) {
			this.video.muted = false;
		}

		this.video.volume = this.volume.value;
	}

	updateVolumeIcon() {
		this.volumeIcons.forEach((icon) => {
			icon.classList.add("hidden");
		});

		this.volumeButton.setAttribute("data-title", "Mute");

		if (this.video.muted || this.video.volume === 0) {
			this.volumeMute.classList.remove("hidden");
			this.volumeButton.setAttribute("data-title", "Unmute");
		} else if (this.video.volume > 0 && this.video.volume <= 0.5) {
			this.volumeLow.classList.remove("hidden");
		} else {
			this.volumeHigh.classList.remove("hidden");
		}
	}

	toggleMute() {
		this.video.muted = !this.video.muted;

		if (this.video.muted) {
			this.volume.setAttribute("data-volume", this.volume.value);
			this.volume.value = 0;
		} else {
			this.volume.value = this.volume.dataset.volume;
		}
	}

	toggleFullScreen() {
		const isIOS = /iPhone|iPod/.test(navigator.userAgent);

		const videoContainer = document.getElementById("video-container");
		if (!isIOS && window.screenfull && window.screenfull.isEnabled) {
			window.screenfull.toggle(videoContainer);
		}

		if (isIOS && this.video.webkitSupportsFullscreen) {
			this.video.webkitEnterFullscreen();
		}
	}

	updateFullscreenButton() {
		this.fullscreenIcons.forEach((icon) => icon.classList.toggle("hidden"));

		if (document.fullscreenElement) {
			this.fullscreenButton.setAttribute("data-title", "Exit full screen");
		} else {
			this.fullscreenButton.setAttribute("data-title", "Full screen");
		}
	}

	hideControls() {
		if (this.video.paused) {
			return;
		}

		this.videoControls.classList.add("hide");
	}

	showControls() {
		this.videoControls.classList.remove("hide");
	}

	checkControls() {
		if (!this.video.paused) {
			this.videoControls.classList.remove("hide");
		}
	}

	toggleSpeedMenu() {
		if (this.speedMenu.classList.contains("hidden")) {
			this.speedButton.classList.remove("button-inactive");
			this.speedButton.classList.add("button-active");
			document.getElementById("speed").getElementsByTagName("path")[0].setAttribute("fill", "rgba(41, 41, 41, 0.8)");
			document.getElementById("speed").getElementsByTagName("path")[1].setAttribute("fill", "rgba(41, 41, 41, 0.8)");
			this.speedMenu.classList.remove("hidden");
		} else {
			this.speedButton.classList.remove("button-active");
			this.speedButton.classList.add("button-inactive");
			document.getElementById("speed").getElementsByTagName("path")[0].setAttribute("fill", "#fff");
			document.getElementById("speed").getElementsByTagName("path")[1].setAttribute("fill", "#fff");
			this.speedMenu.classList.add("hidden");
		}
	}

	setVideoSpeed(event) {
		if (event && event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.value) {
			var playback_rate = event.currentTarget.dataset.value;
			this.video.playbackRate = playback_rate;

			event.currentTarget.appendChild(document.getElementById("active-speed-checkmark"));

			this.speedButton.classList.remove("button-active");
			this.speedButton.classList.add("button-inactive");
			document.getElementById("speed").getElementsByTagName("path")[0].setAttribute("fill", "#fff");
			document.getElementById("speed").getElementsByTagName("path")[1].setAttribute("fill", "#fff");
		}

		this.speedMenu.classList.add("hidden");
	}

	toggleSubtitleMenu() {
		if (this.subtitlesMenu.classList.contains("hidden")) {
			this.subtitlesButton.classList.remove("button-inactive");
			this.subtitlesButton.classList.add("button-active");
			document.getElementById("captions").getElementsByTagName("path")[0].setAttribute("fill", "rgba(41, 41, 41, 0.8)");
			document.getElementById("captions").getElementsByTagName("path")[1].setAttribute("fill", "rgba(41, 41, 41, 0.8)");
			this.subtitlesMenu.classList.remove("hidden");
		} else {
			this.subtitlesButton.classList.remove("button-active");
			this.subtitlesButton.classList.add("button-inactive");
			document.getElementById("captions").getElementsByTagName("path")[0].setAttribute("fill", "#fff");
			document.getElementById("captions").getElementsByTagName("path")[1].setAttribute("fill", "#fff");
			this.subtitlesMenu.classList.add("hidden");
		}
	}

	hideSubtitleMenu() {
		// this.subtitlesMenu.classList.add('hidden');
	}

	showTranslations(event) {
		if (event && event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.value) {
			var languageCode = event.currentTarget.dataset.value;
			var languageText = event.currentTarget.dataset.text;

			event.currentTarget.appendChild(document.getElementById("active-language-checkmark"));
			window.translateText(languageCode, languageText);

			this.subtitlesButton.classList.remove("button-active");
			this.subtitlesButton.classList.add("button-inactive");
			document.getElementById("captions").getElementsByTagName("path")[0].setAttribute("fill", "#fff");
			document.getElementById("captions").getElementsByTagName("path")[1].setAttribute("fill", "#fff");
		}

		this.subtitlesMenu.classList.add("hidden");
	}

	showVideoModal(event) {
		event.preventDefault();
		if (event && event.target) {
			const link = event.target.getAttribute("href");

			if (link) {
				// open tracking analytics
				$.get(link);
			}
			const videoSource = event.target.getAttribute("data-videosource");
			if (videoSource) {
				basicLightbox
					.create(
						`
            <video width='560' height='315' controls autoplay>
              <source src='${videoSource}' type="video/mp4">
            Your browser does not support the video tag.
            </video>
          `
					)
					.show();
			}
		}
	}
}
new VideoPlayer();
