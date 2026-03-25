import os
from PIL import Image
import colorsys

def remove_gray_background(filepath, outpath):
    print(f"Masking grayscale checkerboard in {filepath}")
    img = Image.open(filepath).convert("RGBA")
    data = img.getdata()
    
    newData = []
    removed = 0
    for item in data:
        r, g, b, a = item
        if a < 10:
            newData.append((0,0,0,0))
            continue
            
        # Convert RGB to HSV
        h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
        
        # Checkerboards are gray (low saturation)
        # We will make anything with saturation < 0.15 transparent
        # We also want to target the specific typical fake png checkerboard colors.
        # Often it's #fff and #ccc.
        # Specifically, if R, G, B are very close to each other.
        diff = max(r,g,b) - min(r,g,b)
        
        if diff < 20 and v > 0.3: # Grayscale and not totally black
            # Highly likely this is a checkerboard pixel.
            # Make it 100% transparent.
            newData.append((0, 0, 0, 0))
            removed += 1
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(outpath, "PNG")
    print(f"Removed {removed} grayscale pixels from {filepath}")

base_dir = r"c:\Users\utkarsh kumar singh\Desktop\Frontend-Odyssey\src\assets"
images = ["1.png", "2.png", "5.png", "15.png", "16.png"]

for img_name in images:
    fp = os.path.join(base_dir, img_name)
    outpath = os.path.join(base_dir, img_name.replace(".png", "_grayfix.png"))
    if os.path.exists(fp):
        try:
            remove_gray_background(fp, outpath)
        except Exception as e:
            print(e)
