import os
import shutil

src_dir = r"C:\Users\utkarsh kumar singh\.gemini\antigravity\brain\56f16d2b-a1b7-49df-a14c-9727a6bdd21f"
dest_dir = r"C:\Users\utkarsh kumar singh\Desktop\Frontend-Odyssey\public\images"

files = {
    "hero_bg_1774414700230.png": "hero_bg.png",
    "mid_bg_1774414717567.png": "mid_bg.png",
    "deep_bg_1774414736933.png": "deep_bg.png",
    "particle_tex_1774414754451.png": "particle.png",
    "fish_asset_1774414952182.png": "fish.png",
    "sunken_ship_1774415034690.png": "ship.png"
}

os.makedirs(dest_dir, exist_ok=True)

for src_name, dest_name in files.items():
    src_file = os.path.join(src_dir, src_name)
    dest_file = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_file):
        shutil.copy2(src_file, dest_file)
        print(f"Copied {src_name} to {dest_name}")
    else:
        print(f"Missing: {src_file}")
