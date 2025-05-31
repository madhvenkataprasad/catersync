function showLoading(url) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        setTimeout(() => {
            window.location.href = url;
        }, 1000); // Simulate loading for 1 second
    } else {
        window.location.href = url;
    }
}