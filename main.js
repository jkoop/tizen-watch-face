(function () {
	var dom = -1;
	var hourAngle = 0;
	var minuteAngle = 0;
	var secondAngle = 0;
	var stepCount = -1;
	var batt = '?';

	/**
	 * @param {string} elementId - ID of the element to be rotated
	 * @param {number} angle - angle of rotation, in turns
	 */
	function rotateElement(elementId, angle) {
		const element = document.getElementById(elementId);
		element.style.transform = 'rotate(' + angle + 'turn)';
	}

	// set the text of stuff and rotate things
	function draw() {
		document.getElementById('dom').innerText = dom;
		rotateElement('hand-hour', hourAngle);
		rotateElement('hand-minute', minuteAngle);
		rotateElement('hand-second', secondAngle);
		// document.getElementById("step-count").innerText = stepCount + ' steps';
		document.getElementById('batt').innerHTML = batt;
	}

	/**
	 * Updates the hour/minute/second hands according to the current time
	 */
	function updateTime() {
		const datetime = tizen.time.getCurrentDateTime(),
			hour = datetime.getHours(),
			minute = datetime.getMinutes(),
			second = datetime.getSeconds(),
			_dom = datetime.getDate();

		dom = _dom;
		hourAngle = (hour + minute / 60 + second / 60 / 60) / 12;
		minuteAngle = (minute + second / 60) / 60;
		secondAngle = second / 60;

		draw();
	}

	function updateStepCount(pedometerInfo) {
		stepCount = pedometerInfo.accumulativeTotalStepCount;
		draw();
	}

	function updateBatt(batteryInfo) {
		//    	if (batteryInfo.timeToDischarge > 0.05) {
		//    		batt = batteryInfo.timeToDischarge + 'm';
		//    	} else if (batteryInfo.timeToFullCharge > 0.05) {
		//    		batt = batteryInfo.timeToFullCharge + 'm';
		//    	} else {
		batt = Math.round(batteryInfo.level * 100) + '%';
		//    	}
	}

	/**
	 * Initiates the application
	 */
	function init() {
		// update the screen immediately when the device wakes up
		document.addEventListener('visibilitychange', function () {
			if (!document.hidden) {
				updateTime();
			}
		});

		try {
			// battery level
			tizen.systeminfo.getPropertyValue('BATTERY', updateBatt, null);
			tizen.systeminfo.addPropertyValueChangeListener('BATTERY', updateBatt);

			// step counter
			//        tizen.humanactivitymonitor.setAccumulativePedometerListener(updateStepCount);

			// update the screen when the time zone is changed
			tizen.time.setTimezoneChangeListener(function () {
				updateTime();
			});
		} catch (err) {}

		// Update the watch hands every second
		setInterval(function () {
			updateTime();
		}, 1000);
	}

	window.onload = init();
})();
