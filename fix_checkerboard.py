from PIL import Image
import numpy as np
import os

assets_dir = r"c:\Users\utkarsh kumar singh\Desktop\Frontend-Odyssey\src\assets"

# Fix the 9.png - replace any near-white/gray checkerboard pixels with ocean blue
img_path = os.path.join(assets_dir, "9.png")
img = Image.open(img_path).convert("RGBA")
data = np.array(img)

# Checkerboard pixels are grey (R≈G≈B, all medium values ~140-200)
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Detect checkerboard: pixels where R≈G≈B (grey) and not very dark
grey_mask = (
    (np.abs(r.astype(int) - g.astype(int)) < 20) &
    (np.abs(g.astype(int) - b.astype(int)) < 20) &
    (r > 100) & (r < 220)  # medium grey range
)

# These grey pixels are the checkerboard - make them transparent
data[grey_mask, 3] = 0

out = Image.fromarray(data)
out.save(os.path.join(assets_dir, "9_clean.png"))
print("Saved 9_clean.png")
print(f"Fixed {grey_mask.sum()} checkerboard pixels")
