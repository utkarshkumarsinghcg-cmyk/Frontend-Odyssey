from PIL import Image
import os

def force_transparent(filepath, outpath):
    print(f"Masking checkerboard in {filepath} into {outpath}")
    img = Image.open(filepath).convert("RGBA")
    data = img.getdata()
    width, height = img.size
    
    p1 = img.getpixel((0, 0))
    p2 = img.getpixel((min(15, width-1), 0))
    p3 = img.getpixel((0, min(15, height-1)))
    p4 = img.getpixel((min(8, width-1), min(8, height-1)))
    
    bg_colors = [p1, p2, p3, p4, (255,255,255,255), (191,191,191,255), (204,204,204,255), (211,211,211,255), (153,153,153,255), (76,76,76,255), (85,85,85,255), (51,51,51,255)]
    
    def is_checkerboard(c):
        if c[3] < 50: return False # already transparent
        for bg in bg_colors:
            if abs(c[0]-bg[0]) <= 20 and abs(c[1]-bg[1]) <= 20 and abs(c[2]-bg[2]) <= 20:
                if abs(c[0]-c[1]) <= 20 and abs(c[1]-c[2]) <= 20: # grayscale
                    return True
        return False

    newData = []
    removed_count = 0
    for item in data:
        if is_checkerboard(item):
            # Check if background is mostly opaque, make it fully transparent
            newData.append((0, 0, 0, 0))
            removed_count += 1
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(outpath, "PNG")
    print(f"Removed {removed_count} checkerboard pixels from {filepath}")

base_dir = r"c:\Users\utkarsh kumar singh\Desktop\Frontend-Odyssey\src\assets"
images = ["1.png", "2.png", "5.png", "15.png", "16.png"]

for img_name in images:
    fp = os.path.join(base_dir, img_name)
    outpath = os.path.join(base_dir, img_name.replace(".png", "_final.png"))
    if os.path.exists(fp):
        try:
            force_transparent(fp, outpath)
        except Exception as e:
            print(e)
