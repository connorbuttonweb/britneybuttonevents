import os

# CONFIGURATION
# ------------------------------------------
GALLERY_FOLDER = 'images/gallery'  # Where your photos live
HTML_FILE = 'gallery.html'         # The file to update
# ------------------------------------------

def generate_html():
    # 1. Get all images from the folder
    try:
        files = os.listdir(GALLERY_FOLDER)
    except FileNotFoundError:
        print(f"Error: Could not find folder '{GALLERY_FOLDER}'")
        return

    # Filter for image files only (jpg, png, jpeg, webp)
    images = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif'))]
    images.sort() # Sort alphabetically

    print(f"Found {len(images)} images in {GALLERY_FOLDER}...")

    # 2. Build the HTML string
    html_content = ""
    
    for img in images:
        # Create a "pretty" caption from the filename
        # Example: "wedding-cake-toronto.jpg" -> "Wedding Cake Toronto"
        caption = os.path.splitext(img)[0]  # Remove .jpg
        caption = caption.replace("-", " ") # Replace dashes with spaces
        caption = caption.replace("_", " ") # Replace underscores with spaces
        caption = caption.title()           # Capitalize First Letter

        # HTML Block
        html_block = f"""
            <figure class="gallery-item" data-type="image" data-src="{GALLERY_FOLDER}/{img}">
                <img loading="lazy" src="{GALLERY_FOLDER}/{img}" alt="{caption}" />
                <figcaption>{caption}</figcaption>
            </figure>"""
        
        html_content += html_block

    # 3. Read the existing HTML file
    with open(HTML_FILE, 'r', encoding='utf-8') as file:
        content = file.read()

    # 4. Inject the new HTML between the markers
    start_marker = ''
    end_marker = ''

    if start_marker not in content or end_marker not in content:
        print("Error: Could not find the markers in your HTML file.")
        return

    # Split the file and rebuild it
    pre_content = content.split(start_marker)[0]
    post_content = content.split(end_marker)[1]

    new_full_content = pre_content + start_marker + "\n" + html_content + "\n            " + end_marker + post_content

    # 5. Save the file
    with open(HTML_FILE, 'w', encoding='utf-8') as file:
        file.write(new_full_content)

    print("Success! gallery.html has been updated.")

if __name__ == "__main__":
    generate_html()