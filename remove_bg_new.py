import os
from rembg import remove

def process_image(filepath, outpath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'rb') as f:
            input_data = f.read()
        output_data = remove(input_data)
        with open(outpath, 'wb') as f:
            f.write(output_data)
        print(f"Successfully processed {filepath} to {outpath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

if __name__ == '__main__':
    base_dir = r"c:\Users\utkarsh kumar singh\Desktop\Frontend-Odyssey\src\assets"
    images_to_process = ["1.png", "2.png", "5.png", "15.png", "16.png"]
    for filename in images_to_process:
        filepath = os.path.join(base_dir, filename)
        outpath = os.path.join(base_dir, filename.replace(".png", "_cleared.png"))
        if os.path.exists(filepath):
            process_image(filepath, outpath)
