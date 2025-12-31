import os
import json

# Configuration
IMAGE_FOLDER = 'images/gallery'     # Where your images live
OUTPUT_FILE = 'gallery_data.json'   # The file JS will read
VALID_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.webp')

def update_json():
    # 1. Check if folder exists
    if not os.path.exists(IMAGE_FOLDER):
        print(f"Error: Folder '{IMAGE_FOLDER}' not found.")
        return

    # 2. Get all valid image files
    images = []
    for filename in os.listdir(IMAGE_FOLDER):
        if filename.lower().endswith(VALID_EXTENSIONS):
            images.append(filename)
    
    # Optional: Sort them alphabetically or by date
    images.sort() 

    # 3. Write list to JSON
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(images, f, indent=4)

    print(f"Success! Found {len(images)} images. Saved to {OUTPUT_FILE}.")

if __name__ == "__main__":
    update_json()