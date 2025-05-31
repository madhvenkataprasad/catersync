document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactResult = document.getElementById('contactResult');

    if (!contactForm || !contactResult) {
        console.error('Required DOM elements not found:', { contactForm, contactResult });
        return;
    }

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        contactResult.style.display = 'block';
        contactResult.textContent = 'Enquiry submitted✓';
        contactForm.reset();
        setTimeout(() => {
            contactResult.style.display = 'none';
        }, 3000);
    });
});