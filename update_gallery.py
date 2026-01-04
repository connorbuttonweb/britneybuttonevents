import os
import json
from PIL import Image, ImageOps  # pip install pillow

# Configuration
IMAGE_FOLDER = 'images/gallery'     # Where your images live
OUTPUT_FILE = 'gallery_data.json'   # The file JS will read
VALID_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.webp')

# Low‑res settings
LOW_SUFFIX     = '-low'                # e.g., photo.jpg -> photo-low.jpg
LOW_MAX_WIDTH  = 400                   # px (adjust as you like)
JPEG_QUALITY   = 40                    # compression for low‑res

def make_low_res(src_path, dst_path):
    if os.path.exists(dst_path):
        return

    with Image.open(src_path) as img:
        # Normalize based on EXIF so pixels match how the image should look
        img = ImageOps.exif_transpose(img)

        w, h = img.size
        if w > LOW_MAX_WIDTH:
            new_h = int(h * (LOW_MAX_WIDTH / w))
            img = img.resize((LOW_MAX_WIDTH, new_h), Image.LANCZOS)

        os.makedirs(os.path.dirname(dst_path), exist_ok=True)

        ext = os.path.splitext(dst_path)[1].lower()
        if ext in ('.jpg', '.jpeg', '.webp'):
            img.save(dst_path, quality=JPEG_QUALITY, optimize=True)
        else:
            img.save(dst_path)

def update_json():
    # 1. Check if folder exists
    if not os.path.exists(IMAGE_FOLDER):
        print(f"Error: Folder '{IMAGE_FOLDER}' not found.")
        return

    # 2. Get all valid original image files
    images = []
    for filename in os.listdir(IMAGE_FOLDER):
        name, ext = os.path.splitext(filename)
        if ext.lower() in VALID_EXTENSIONS:
            # Ignore any files that are already marked as low‑res
            if name.endswith(LOW_SUFFIX):
                continue

            full_path = os.path.join(IMAGE_FOLDER, filename)

            # Build low‑res filename/path
            low_name = f"{name}{LOW_SUFFIX}{ext}"
            low_path = os.path.join(IMAGE_FOLDER, low_name)

            # Create low‑res copy if needed
            make_low_res(full_path, low_path)

            # Store both paths (relative) for JS
            images.append({
                "full": os.path.join(IMAGE_FOLDER, filename).replace('\\', '/'),
                "low":  os.path.join(IMAGE_FOLDER, low_name).replace('\\', '/')
            })

    # Optional: Sort by filename
    images.sort(key=lambda x: x["full"])

    # 3. Write list to JSON
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(images, f, indent=4)

    print(f"Success! Found {len(images)} images. Saved to {OUTPUT_FILE}.")

if __name__ == "__main__":
    update_json()