document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('gallery-container');
    const imagePath = 'images/gallery/'; 

    fetch('gallery_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(images => {
            // Check if gallery is empty
            if (images.length === 0) {
                container.innerHTML = '<p>No images found.</p>';
                return;
            }

            // Loop through the list and create HTML for each image
            images.forEach(filename => {
                // Create the div wrapper
                const itemDiv = document.createElement('div');
                itemDiv.className = 'gallery-item'; // Matches your CSS class

                // Create the image tag
                const img = document.createElement('img');
                img.src = imagePath + filename;
                img.alt = filename;
                img.loading = "lazy"; // Improves load speed

                // Append image to div, and div to container
                itemDiv.appendChild(img);
                container.appendChild(itemDiv);
            });
        })
        .catch(error => {
            console.error('Error loading gallery:', error);
            container.innerHTML = '<p>Error loading images. Check console for details.</p>';
        });
});