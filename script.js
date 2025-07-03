document.addEventListener('DOMContentLoaded', () => {
    // --- Slide Navigation ---
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progress-bar');
    const backArrow = document.getElementById('back-arrow');
    const continueBtn = document.getElementById('continue-btn');
    const progressHeader = document.getElementById('progress-header');
    const pageFooter = document.getElementById('page-footer');
    const mainHeader = document.getElementById('main-header');
    const getStartedButtons = document.querySelectorAll('.get-started-btn');
    const alreadyHaveAccountBtn = document.getElementById('already-have-account-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobilePrevBtn = document.getElementById('mobile-prev-btn');
    const mobileNextBtn = document.getElementById('mobile-next-btn');
    const scrollIndicator = document.getElementById('scroll-indicator');
    let currentSlide = 0;

    function updateUI(index) {
        document.querySelectorAll('.mockup-after').forEach(el => {
            el.classList.remove('visible');
        });
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            if (i === index) {
                // When the new slide's fade-in transition finishes, scroll it to the top.
                // This is the most reliable way to handle the timing.
                slide.addEventListener('transitionend', () => {
                    slide.scrollTo({ top: 0, behavior: 'smooth' });
                }, { once: true });
            }
        });

        const isFirstSlide = index === 0;
        mainHeader.style.display = isFirstSlide ? 'flex' : 'none';
        progressHeader.style.display = isFirstSlide ? 'none' : 'flex';
        pageFooter.style.display = isFirstSlide ? 'none' : 'block';

        // Manage mobile navigation state
        if (mobileNav) {
            mobileNav.style.display = isFirstSlide ? 'none' : 'flex';
            mobileNextBtn.disabled = index === slides.length - 1;
        }

        // Manage scroll indicator for specific slides on mobile
        if (scrollIndicator) {
            const scrollSlides = [2, 3]; // Slides 3 and 4
            const isMobile = window.innerWidth <= 768;
            const needsIndicator = isMobile && scrollSlides.includes(index);
            const activeSlide = slides[index];

            if (needsIndicator && activeSlide) {
                scrollIndicator.classList.remove('hidden');

                const hideOnScroll = () => {
                    scrollIndicator.classList.add('hidden');
                };

                // Delay attaching the listener to avoid the programmatic scroll-to-top
                setTimeout(() => {
                    activeSlide.addEventListener('scroll', hideOnScroll, { once: true });
                }, 100);
            } else {
                scrollIndicator.classList.add('hidden');
            }
        }

        if (slides.length > 1) {
            const progressPercentage = (index / (slides.length - 1)) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }
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
        if (activeSlide.classList.contains('mockup-slide')) {
            const afterMockup = activeSlide.querySelector('.mockup-after');
            if (afterMockup && !afterMockup.classList.contains('visible')) {
                afterMockup.classList.add('visible');
                // On mobile, scroll to the "After" view when it appears
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        afterMockup.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100); // Delay to ensure the element is rendered before scrolling
                }
                return;
            }
        }
        nextSlide();
    }

    continueBtn.addEventListener('click', attemptNextStep);
    backArrow.addEventListener('click', prevSlide);
    if (mobilePrevBtn) mobilePrevBtn.addEventListener('click', prevSlide);
    if (mobileNextBtn) mobileNextBtn.addEventListener('click', attemptNextStep);
    getStartedButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentSlide === slides.length - 1) {
                currentSlide = 0;
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
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') attemptNextStep();
        else if (e.key === 'ArrowLeft') prevSlide();
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
            e.stopPropagation();
            accessibilityMenu.classList.toggle('hidden');
        });
    }
    if (contrastToggle) {
        contrastToggle.addEventListener('click', () => body.classList.toggle('high-contrast'));
    }
    if (fontToggle) {
        fontToggle.addEventListener('click', () => body.classList.toggle('readable-font'));
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
    document.addEventListener('click', (e) => {
        if (accessibilityMenu && !accessibilityMenu.classList.contains('hidden') && !accessibilityMenu.contains(e.target) && !accessibilityToggle.contains(e.target)) {
            accessibilityMenu.classList.add('hidden');
        }
    });

    // --- Quiz Settings Logic ---
    const quizSettingsBtn = document.getElementById('quiz-settings-btn');
    const quizSettingsDropdown = document.getElementById('quiz-settings-dropdown');
    const romanizationCheckbox = document.getElementById('romanization-checkbox');

    const hintCheckbox = document.getElementById('hint-checkbox');
    const quizHint = document.getElementById('quiz-hint');

    if (quizSettingsBtn) {
        quizSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            quizSettingsDropdown.classList.toggle('hidden');
        });
    }
    document.addEventListener('click', (e) => {
        if (quizSettingsDropdown && !quizSettingsDropdown.classList.contains('hidden') && !quizSettingsBtn.contains(e.target) && !quizSettingsDropdown.contains(e.target)) {
            quizSettingsDropdown.classList.add('hidden');
        }
    });

    if (romanizationCheckbox) {
        romanizationCheckbox.addEventListener('change', () => {
            const quizOptions = document.querySelectorAll('.quiz-option');
            quizOptions.forEach(option => {
                const romanization = option.dataset.romanization;
                let romanizationEl = option.querySelector('.romanization');
                if (romanizationCheckbox.checked) {
                    if (!romanizationEl) {
                        romanizationEl = document.createElement('span');
                        romanizationEl.className = 'romanization block text-sm text-gray-500';
                        option.appendChild(romanizationEl);
                    }
                    romanizationEl.textContent = romanization;
                } else {
                    if (romanizationEl) {
                        option.removeChild(romanizationEl);
                    }
                }
            });
            const sentenceRomanization = document.getElementById('sentence-romanization');
            const quizFeedback = document.getElementById('quiz-feedback');
            const isQuizAnswered = quizFeedback && !quizFeedback.classList.contains('invisible');
            if (isQuizAnswered) {
                if (romanizationCheckbox.checked) {
                    const sentenceTextContent = document.getElementById('sentence-text').textContent;
                    const selectedWord = sentenceTextContent.split(' ')[0];
                    let selectedRomanization = '';
                    document.querySelectorAll('.quiz-option').forEach(opt => {
                        if (opt.firstChild.textContent.trim() === selectedWord) {
                            selectedRomanization = opt.dataset.romanization;
                        }
                    });
                    if (selectedRomanization) {
                        sentenceRomanization.textContent = `[${selectedRomanization} juseyo]`;
                        sentenceRomanization.classList.remove('invisible');
                    }
                } else {
                    sentenceRomanization.classList.add('invisible');
                }
            }
        });
    }

    if (hintCheckbox) {
        hintCheckbox.addEventListener('change', () => {
            quizHint.classList.toggle('hidden', !hintCheckbox.checked);
        });
    }

    // --- Heuristic Quiz Logic ---
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    const retryBtn = document.getElementById('retry-quiz-btn');
    const tipButton = document.getElementById('tip-button');
    const sentenceText = document.getElementById('sentence-text');
    const sentenceRomanization = document.getElementById('sentence-romanization');
    const sentenceTranslation = document.getElementById('sentence-translation');
    const quizTip = document.getElementById('quiz-tip');
    const playSentenceBtn = document.getElementById('play-sentence-btn');
    let currentSentenceSound = null;

    if (quizOptions && retryBtn) {
        const options = quizOptions.querySelectorAll('.quiz-option');

        const resetQuiz = () => {
            options.forEach(opt => {
                opt.disabled = false;
                opt.classList.remove('border-green-500', 'bg-green-100', 'border-red-500', 'bg-red-100');
            });
            quizFeedback.classList.add('invisible');
            tipButton.classList.add('hidden');
            quizTip.classList.add('hidden');
            sentenceText.textContent = '_______ 주세요.';
            sentenceRomanization.innerHTML = '&nbsp;';
            sentenceRomanization.classList.add('invisible');
            sentenceTranslation.innerHTML = '&nbsp;';
            sentenceTranslation.classList.add('invisible');
            playSentenceBtn.classList.add('hidden');
            currentSentenceSound = null;
        };

        const handleOptionClick = (option) => {
            const soundSrc = option.dataset.sound;
            if (soundSrc) {
                const audio = new Audio(soundSrc);
                audio.play().catch(e => console.error("Audio play failed:", e));
            }
            options.forEach(opt => opt.disabled = true);
            const selectedWord = option.firstChild.textContent.trim();
            const isCorrect = option.getAttribute('data-correct') === 'true';
            sentenceText.textContent = `${selectedWord} 주세요.`;
            currentSentenceSound = option.dataset.sentenceSound;
            playSentenceBtn.classList.remove('hidden');
            if (romanizationCheckbox && romanizationCheckbox.checked) {
                const selectedRomanization = option.dataset.romanization;
                sentenceRomanization.textContent = `[${selectedRomanization} juseyo]`;
                sentenceRomanization.classList.remove('invisible');
            }
            const englishMeaning = option.dataset.english;
            sentenceTranslation.textContent = `(Please give me ${englishMeaning}.)`;
            sentenceTranslation.classList.remove('invisible');
            const feedbackText = quizFeedback.querySelector('.font-bold');
            const explanationText = quizFeedback.querySelector('.explanation-text');
            if (isCorrect) {
                feedbackText.textContent = 'Correct!';
                feedbackText.className = 'font-bold text-green-500';
                explanationText.innerHTML = '&nbsp;';
                option.classList.add('border-green-500', 'bg-green-100');
                tipButton.classList.remove('hidden');
            } else {
                feedbackText.textContent = 'Incorrect.';
                feedbackText.className = 'font-bold text-red-500';
                explanationText.textContent = 'The correct answer is "커피".';
                option.classList.add('border-red-500', 'bg-red-100');
                quizOptions.querySelector('[data-correct="true"]').classList.add('border-green-500', 'bg-green-100');
            }
            quizFeedback.classList.remove('invisible');
        };

        options.forEach(option => {
            option.addEventListener('click', () => handleOptionClick(option));
        });
        retryBtn.addEventListener('click', resetQuiz);
        tipButton.addEventListener('click', (e) => {
            e.stopPropagation();
            quizTip.classList.toggle('hidden');
        });
        playSentenceBtn.addEventListener('click', () => {
            if (currentSentenceSound) {
                const audio = new Audio(currentSentenceSound);
                audio.play().catch(e => console.error("Audio play promise rejected:", e));
            }
        });
    }

    // --- Image Modal Logic ---
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalBtn = document.getElementById('modal-close');
    const clickableImages = document.querySelectorAll('.clickable-image');

    if (imageModal && modalImage && closeModalBtn) {
        clickableImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                modalImage.src = img.src;
                imageModal.classList.remove('hidden');
                imageModal.classList.add('flex');
            });
        });
        const closeModal = () => {
            imageModal.classList.add('hidden');
            imageModal.classList.remove('flex');
            modalImage.src = '';
        };
        closeModalBtn.addEventListener('click', closeModal);
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // Initial setup
    updateUI(currentSlide);
});
