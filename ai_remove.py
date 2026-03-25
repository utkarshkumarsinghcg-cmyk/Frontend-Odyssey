import os
from rembg import remove
from PIL import Image

def process_image(filepath, outpath):
    print(f"Applying rembg to {filepath}")
    try:
        with open(filepath, 'rb') as f:
            input_data = f.read()
        output_data = remove(input_data)
        with open(outpath, 'wb') as f:
            f.write(output_data)
        print(f"Saved {outpath}")
    except Exception as e:
        print(f"Error {e}")

base_dir = r"c:\Users\utkarsh kumar singh\Desktop\Frontend-Odyssey\src\assets"
images = ["1.png", "2.png", "5.png", "10.png", "15.png", "16.png"]

for img in images:
    filepath = os.path.join(base_dir, img)
    outpath = os.path.join(base_dir, img.replace(".png", "_rembg.png"))
    if os.path.exists(filepath):
        process_image(filepath, outpath)
