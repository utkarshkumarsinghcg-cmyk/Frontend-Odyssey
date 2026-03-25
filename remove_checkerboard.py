from PIL import Image

def remove_checkerboard(img_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    # Checkerboards are usually a mix of white (255) and light grey (like 204, 211, etc.)
    # Let's remove any pixel that is very close to grey or white to clear the background.
    newData = []
    for item in data:
        r, g, b, a = item
        # Fish is yellow/blue, Jelly is blue/pink, Bubble is dark/blue.
        # Only remove if it's very light grey and not heavily saturated.
        if (r > 180 and g > 180 and b > 180 and abs(r-g) <= 15 and abs(g-b) <= 15):
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    img.save(img_path, "PNG")

for i in ['1.png', '2.png', '5.png']:
    try:
        remove_checkerboard(r"c:\Users\utkarsh kumar singh\Desktop\Frontend-Odyssey\src\assets\\" + i)
        print(f"Processed {i}")
    except Exception as e:
        print(f"Error on {i}: {e}")
