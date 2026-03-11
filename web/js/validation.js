/**
 * validation.js — Feedback Form Validation & Interactive Star Rating
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===== Interactive Star Rating =====
    const starRating = document.getElementById('starRating');
    const ratingInput = document.getElementById('rating');
    const stars = starRating ? starRating.querySelectorAll('.star') : [];
    let selectedRating = 0;

    stars.forEach(star => {
        // Hover preview
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.value);
            stars.forEach(s => {
                const v = parseInt(s.dataset.value);
                s.classList.toggle('hover-preview', v <= val);
            });
        });

        // Mouse leave — restore selection
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hover-preview'));
        });

        // Click — set rating
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            ratingInput.value = selectedRating;
            stars.forEach(s => {
                const v = parseInt(s.dataset.value);
                s.classList.toggle('active', v <= selectedRating);
            });
            hideError('ratingError');
        });
    });

    // Restore on leave the container
    if (starRating) {
        starRating.addEventListener('mouseleave', () => {
            stars.forEach(s => {
                s.classList.remove('hover-preview');
            });
        });
    }

    // ===== Form Submission =====
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset errors
        hideAllErrors();

        // Get values
        const name = document.getElementById('name').value.trim();
        const faculty = document.getElementById('faculty').value.trim();
        const course = document.getElementById('course').value.trim();
        const rating = parseInt(ratingInput.value);
        const comment = document.getElementById('comment').value.trim();

        // Validate
        let valid = true;

        if (!name) {
            showError('nameError', 'Please enter your name');
            valid = false;
        }

        if (!faculty) {
            showError('facultyError', 'Please enter faculty name');
            valid = false;
        }

        if (!course) {
            showError('courseError', 'Please enter course name');
            valid = false;
        }

        if (!rating || rating < 1 || rating > 5) {
            showError('ratingError', 'Please select a rating');
            valid = false;
        }

        if (comment.length < 10) {
            showError('commentError', 'Comment must be at least 10 characters long');
            valid = false;
        }

        if (!valid) return;

        // Show loading
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.classList.add('btn-loading');
        submitBtn.textContent = 'Submitting...';

        try {
            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('faculty', faculty);
            formData.append('course', course);
            formData.append('rating', rating);
            formData.append('comment', comment);

            const response = await fetch('submitFeedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            const data = await response.json();

            if (data.success) {
                // Show success state
                document.getElementById('formContent').style.display = 'none';
                const successState = document.getElementById('successState');
                successState.classList.add('show');

                // Show sentiment badge
                const sentimentDiv = document.getElementById('sentimentResult');
                const sentiment = data.sentiment || 'Neutral';
                const sentimentClass = sentiment.toLowerCase();
                sentimentDiv.innerHTML = `
                    <div class="sentiment-badge ${sentimentClass}">
                        ${sentiment === 'Positive' ? '😊' : sentiment === 'Negative' ? '😟' : '😐'}
                        AI Sentiment: ${sentiment}
                    </div>
                `;
            } else {
                alert(data.message || 'Failed to submit feedback.');
                submitBtn.classList.remove('btn-loading');
                submitBtn.textContent = 'Submit Feedback';
            }
        } catch (error) {
            alert('Connection error. Please make sure the server is running.');
            submitBtn.classList.remove('btn-loading');
            submitBtn.textContent = 'Submit Feedback';
        }
    });

    // ===== Helper Functions =====
    function showError(id, message) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = message;
            el.classList.add('show');
        }
    }

    function hideError(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('show');
    }

    function hideAllErrors() {
        document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
    }

    // Real-time validation — clear errors on input
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const errorId = input.id + 'Error';
            hideError(errorId);
        });
    });
});
