/**
 * Gets the absolute offset of an element relative to the document
 * @param {HTMLElement} element - The element to get offset for
 * @returns {{top: number, left: number}} The offset coordinates
 */
const getOffset = (element) => {
	const rect = element.getBoundingClientRect();
	return {
		top: rect.top + window.scrollY,
		left: rect.left + window.scrollX
	};
};

/**
 * Creates a zoom functionality for images
 * @returns {Object} Zoom controller
 */
export const imageZoom = () => {
	let activeZoom = null;
	let initialScrollPosition = null;
	let initialTouchPosition = null;
	let offset = 0;

	const handleScroll = () => {
		if (initialScrollPosition === null) {
			initialScrollPosition = window.scrollY;
		}
		const deltaY = initialScrollPosition - window.scrollY;
		if (Math.abs(deltaY) >= 40) closeActiveZoom();
	};

	const handleEscPressed = (event) => {
		if (event.key === 'Escape') closeActiveZoom();
	};

	const handleClick = (event) => {
		event.stopPropagation();
		event.preventDefault();
		closeActiveZoom();
	};

	const handleTouchStart = (event) => {
		initialTouchPosition = event.touches[0].pageY;
		event.target.addEventListener('touchmove', handleTouchMove);
	};

	const handleTouchMove = (event) => {
		if (Math.abs(event.touches[0].pageY - initialTouchPosition) <= 10) return;
		closeActiveZoom();
		event.target.removeEventListener('touchmove', handleTouchMove);
	};

	const addCloseListeners = () => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		document.addEventListener('click', handleClick);
		document.addEventListener('keyup', handleEscPressed);
		document.addEventListener('touchstart', handleTouchStart, { passive: true });
		document.addEventListener('touchend', handleClick);
	};

	const removeCloseListeners = () => {
		window.removeEventListener('scroll', handleScroll);
		document.removeEventListener('keyup', handleEscPressed);
		document.removeEventListener('click', handleClick);
		document.removeEventListener('touchstart', handleTouchStart);
		document.removeEventListener('touchend', handleClick);
	};

	const openInNewWindow = (target) => {
		window.open(
			target.dataset.original || target.currentSrc || target.src,
			'_blank'
		);
	};

	const closeActiveZoom = (options = { forceDispose: false }) => {
		if (!activeZoom) return;
		activeZoom[options.forceDispose ? 'dispose' : 'close']();
		removeCloseListeners();
		activeZoom = null;
	};

	const createZoomInstance = (() => {
		let fullHeight = null;
		let fullWidth = null;
		let overlay = null;
		let imgScaleFactor = null;
		let targetImage = null;
		let targetImageWrap = null;
		let targetImageClone = null;

		const calculateZoom = () => {
			// Force repaint
			void targetImage.offsetWidth;

			const viewportHeight = window.innerHeight - offset;
			const viewportWidth = window.innerWidth - offset;

			const maxScaleFactor = fullWidth / targetImage.width;
			const imageAspectRatio = fullWidth / fullHeight;
			const viewportAspectRatio = viewportWidth / viewportHeight;

			if (fullWidth < viewportWidth && fullHeight < viewportHeight) {
				imgScaleFactor = maxScaleFactor;
			} else if (imageAspectRatio < viewportAspectRatio) {
				imgScaleFactor = (viewportHeight / fullHeight) * maxScaleFactor;
			} else {
				imgScaleFactor = (viewportWidth / fullWidth) * maxScaleFactor;
			}
		};

		const triggerAnimation = () => {
			// Force repaint
			void targetImage.offsetWidth;

			const imageOffset = getOffset(targetImage);
			const scrollTop = window.scrollY;

			const viewportY = scrollTop + (window.innerHeight / 2);
			const viewportX = window.innerWidth / 2;

			const imageCenterY = imageOffset.top + (targetImage.height / 2);
			const imageCenterX = imageOffset.left + (targetImage.width / 2);

			const translateY = Math.round(viewportY - imageCenterY);
			const translateX = Math.round(viewportX - imageCenterX);

			const transform = {
				image: `scale(${imgScaleFactor})`,
				wrap: `translate(${translateX}px, ${translateY}px) translateZ(0)`
			};

			Object.assign(targetImage.style, {
				transform: transform.image,
				WebkitTransform: transform.image,
			});

			Object.assign(targetImageWrap.style, {
				transform: transform.wrap,
				WebkitTransform: transform.wrap,
			});

			document.body.classList.add('zoom-overlay-open');
		};

		const zoomOriginal = () => {
			targetImageWrap = document.createElement('div');
			targetImageWrap.className = 'zoom-img-wrap';
			Object.assign(targetImageWrap.style, {
				position: 'absolute',
				top: `${getOffset(targetImage).top}px`,
				left: `${getOffset(targetImage).left}px`
			});

			targetImageClone = targetImage.cloneNode();
			targetImageClone.style.visibility = 'hidden';

			targetImage.style.width = `${targetImage.offsetWidth}px`;
			targetImage.parentNode.replaceChild(targetImageClone, targetImage);

			document.body.appendChild(targetImageWrap);
			targetImageWrap.appendChild(targetImage);

			targetImage.classList.add('zoom-img');
			targetImage.dataset.action = 'zoom-out';

			overlay = document.createElement('div');
			overlay.className = 'zoom-overlay';
			document.body.appendChild(overlay);

			calculateZoom();
			triggerAnimation();
		};

		const dispose = () => {
			targetImage?.removeEventListener('transitionend', dispose);
			targetImage?.removeEventListener('webkitTransitionEnd', dispose);

			if (!targetImageWrap?.parentNode) return;

			targetImage.classList.remove('zoom-img');
			targetImage.style.width = '';
			targetImage.dataset.action = 'zoom';

			targetImageClone.parentNode.replaceChild(targetImage, targetImageClone);
			targetImageWrap.parentNode.removeChild(targetImageWrap);
			overlay.parentNode.removeChild(overlay);

			document.body.classList.remove('zoom-overlay-transitioning');
		};

		const close = () => {
			document.body.classList.remove('zoom-overlay-open');
			document.body.classList.add('zoom-overlay-transitioning');

			['transform', 'WebkitTransform', 'msTransform'].forEach(prop => {
				targetImage.style[prop] = '';
				targetImageWrap.style[prop] = '';
			});

			if (!('transition' in document.body.style)) return dispose();

			targetImageWrap.addEventListener('transitionend', dispose);
			targetImageWrap.addEventListener('webkitTransitionEnd', dispose);
		};

		return (target) => {
			targetImage = target;
			
			const zoomImage = () => {
				const img = new Image();
				img.onload = () => {
					fullHeight = Number(img.height);
					fullWidth = Number(img.width);
					zoomOriginal();
				};
				img.src = targetImage.currentSrc || targetImage.src;
			};

			return { zoomImage, close, dispose };
		};
	})();

	const zoom = (event) => {
		event.stopPropagation();

		if (document.body.classList.contains('zoom-overlay-open')) return;
		if (event.metaKey || event.ctrlKey) return openInNewWindow(event.target);

		closeActiveZoom({ forceDispose: true });

		activeZoom = createZoomInstance(event.target);
		activeZoom.zoomImage();

		addCloseListeners();
	};

	const init = (options = { selector: 'img[data-action="zoom"]', offset: 0 }) => {
		const { selector, offset: offsetValue } = options;
		offset = offsetValue;
		document.body.addEventListener('click', (event) => {
			const target = event.target;
			if (!target.matches(selector) || target.tagName !== 'IMG') return;
			
			zoom(event);
		});
	};

	return { init };
};