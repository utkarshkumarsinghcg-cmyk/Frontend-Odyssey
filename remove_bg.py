import os
from PIL import Image
from rembg import remove

def process_image(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'rb') as f:
            input_data = f.read()
        output_data = remove(input_data)
        with open(filepath, 'wb') as f:
            f.write(output_data)
        print(f"Successfully processed {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

if __name__ == '__main__':
    base_dir = r"c:\Users\utkarsh kumar singh\Desktop\Frontend-Odyssey\src\assets"
    images_to_process = [f"{i}.png" for i in range(10, 17)]
    for filename in images_to_process:
        filepath = os.path.join(base_dir, filename)
        if os.path.exists(filepath):
            process_image(filepath)
