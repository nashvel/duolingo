document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progress-bar');
    const backArrow = document.getElementById('back-arrow');
    const continueBtn = document.getElementById('continue-btn');
    const progressHeader = document.getElementById('progress-header');
    const pageFooter = document.getElementById('page-footer');
    const mainHeader = document.getElementById('main-header');
    const getStartedButtons = document.querySelectorAll('.get-started-btn');
    const alreadyHaveAccountBtn = document.getElementById('already-have-account-btn');

    let currentSlide = 0;

    function updateUI(index) {
        // Reset all mockup animations before showing the new slide
        document.querySelectorAll('.mockup-after').forEach(el => {
            el.classList.remove('visible');
        });

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Show/hide headers and footers
        const isFirstSlide = index === 0;
        mainHeader.style.display = isFirstSlide ? 'flex' : 'none';
        progressHeader.style.display = isFirstSlide ? 'none' : 'flex';
        pageFooter.style.display = isFirstSlide ? 'none' : 'block';

        // Update progress bar
        if (slides.length > 1) {
            const progressPercentage = (index / (slides.length - 1)) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }

        // Disable continue button on the last slide
        continueBtn.disabled = index === slides.length - 1;
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateUI(currentSlide);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateUI(currentSlide);
        }
    }

    function attemptNextStep() {
        const activeSlide = slides[currentSlide];

        // Check if it's a mockup slide with a hidden 'after' part
        if (activeSlide.classList.contains('mockup-slide')) {
            const afterMockup = activeSlide.querySelector('.mockup-after');
            if (afterMockup && !afterMockup.classList.contains('visible')) {
                afterMockup.classList.add('visible');
                return; // Reveal the 'after' part and wait for the next action
            }
        }

        // Otherwise, proceed to the next slide
        nextSlide();
    }

    // Event Listeners
    continueBtn.addEventListener('click', attemptNextStep);
    backArrow.addEventListener('click', prevSlide);

    getStartedButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentSlide === slides.length - 1) {
                currentSlide = 0; // Restart if on last slide
            } else {
                currentSlide++;
            }
            updateUI(currentSlide);
        });
    });

    if (alreadyHaveAccountBtn) {
        alreadyHaveAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('no you don`t have');
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            attemptNextStep();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // --- Accessibility Widget Logic ---
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    const accessibilityMenu = document.getElementById('accessibility-menu');
    const contrastToggle = document.getElementById('contrast-toggle');
    const fontIncrease = document.getElementById('font-increase');
    const fontDecrease = document.getElementById('font-decrease');
    const fontToggle = document.getElementById('font-toggle');
    const body = document.body;
    const html = document.documentElement;

    if (accessibilityToggle) {
        accessibilityToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from closing menu immediately
            accessibilityMenu.classList.toggle('hidden');
        });
    }

    if (contrastToggle) {
        contrastToggle.addEventListener('click', () => {
            body.classList.toggle('high-contrast');
        });
    }
    
    if (fontToggle) {
        fontToggle.addEventListener('click', () => {
            body.classList.toggle('readable-font');
        });
    }

    if (fontIncrease) {
        fontIncrease.addEventListener('click', () => {
            const currentSize = parseFloat(getComputedStyle(html).fontSize);
            html.style.fontSize = `${currentSize + 1}px`;
        });
    }

    if (fontDecrease) {
        fontDecrease.addEventListener('click', () => {
            const currentSize = parseFloat(getComputedStyle(html).fontSize);
            html.style.fontSize = `${currentSize - 1}px`;
        });
    }

    // Close menu if clicking outside
    document.addEventListener('click', (e) => {
        if (accessibilityMenu && !accessibilityMenu.classList.contains('hidden') && !accessibilityMenu.contains(e.target) && !accessibilityToggle.contains(e.target)) {
            accessibilityMenu.classList.add('hidden');
        }
    });

    // --- Heuristic Quiz Logic ---
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    const retryBtn = document.getElementById('retry-quiz-btn');

    if (quizOptions && retryBtn) {
        const options = quizOptions.querySelectorAll('.quiz-option');

        const handleOptionClick = (option) => {
            // Put selected word in the blank
            const selectedWord = option.textContent;
            const sentenceLine = document.getElementById('sentence-line');
            if (sentenceLine) {
                sentenceLine.innerHTML = `<span class="font-bold">${selectedWord} 주세요.</span>`;
            }

            // Disable all options after one is clicked
            options.forEach(opt => opt.disabled = true);

            const isCorrect = option.getAttribute('data-correct') === 'true';
            const feedbackText = quizFeedback.querySelector('p:first-of-type');
            const explanationText = quizFeedback.querySelector('p:last-of-type');

            if (isCorrect) {
                option.classList.add('correct');
                feedbackText.textContent = 'Correct!';
                explanationText.textContent = '"커피" (keopi) means coffee.';
            } else {
                option.classList.add('incorrect');
                feedbackText.textContent = 'Incorrect.';
                explanationText.textContent = 'The correct answer is highlighted.'; // This is intentionally unhelpful to prove the point
                // Highlight the correct answer
                quizOptions.querySelector('[data-correct="true"]').classList.add('correct');
            }
            quizFeedback.classList.remove('hidden');
        };

        const resetQuiz = () => {
            options.forEach(opt => {
                opt.disabled = false;
                opt.classList.remove('correct', 'incorrect');
            });
            quizFeedback.classList.add('hidden');

            // Reset sentence
            const sentenceLine = document.getElementById('sentence-line');
            if (sentenceLine) {
                sentenceLine.innerHTML = `<span class="font-bold">_______ 주세요.</span>`;
            }
        };

        options.forEach(option => {
            option.addEventListener('click', () => handleOptionClick(option));
        });

        retryBtn.addEventListener('click', resetQuiz);
    }

    // --- Image Modal Logic ---
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalBtn = document.getElementById('modal-close');
    const clickableImages = document.querySelectorAll('.clickable-image');

    if (imageModal && modalImage && closeModalBtn) {
        clickableImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent slide navigation if the parent is clickable
                modalImage.src = img.src;
                imageModal.classList.remove('hidden');
                imageModal.classList.add('flex');
            });
        });

        const closeModal = () => {
            imageModal.classList.add('hidden');
            imageModal.classList.remove('flex');
            modalImage.src = ''; // Clear src to avoid showing old image briefly
        };

        closeModalBtn.addEventListener('click', closeModal);

        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeModal();
            }
        });

        // Close with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // Initial setup
    updateUI(currentSlide);
});
