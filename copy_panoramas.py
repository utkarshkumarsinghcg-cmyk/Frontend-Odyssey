import shutil, os

brain = r"C:\Users\utkarsh kumar singh\.gemini\antigravity\brain\56f16d2b-a1b7-49df-a14c-9727a6bdd21f"
assets = r"c:\Users\utkarsh kumar singh\Desktop\Frontend-Odyssey\src\assets"

files = {
    "ocean_panorama_1_1774436967139.png": "bg_surface.jpg",
    "ocean_panorama_2_1774436985370.png": "bg_mid.jpg",
    "ocean_panorama_3_1774437002306.png": "bg_deep.jpg",
}

from PIL import Image
for src, dst in files.items():
    img = Image.open(os.path.join(brain, src)).convert("RGB")
    img.save(os.path.join(assets, dst), "JPEG", quality=95)
    print(f"Saved {dst}")
