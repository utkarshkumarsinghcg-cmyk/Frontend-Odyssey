import os
from rembg import remove

brain_dir = r"C:\Users\utkarsh kumar singh\.gemini\antigravity\brain\56f16d2b-a1b7-49df-a14c-9727a6bdd21f"
out_dir = r"c:\Users\utkarsh kumar singh\Desktop\Frontend-Odyssey\src\assets"

files = {
    "titanic_raw_1774417630401.png": "titanic.png"
}

for src_name, out_name in files.items():
    src_path = os.path.join(brain_dir, src_name)
    out_path = os.path.join(out_dir, out_name)
    
    if os.path.exists(src_path):
        print(f"Removing background from {src_name}...")
        with open(src_path, 'rb') as f:
            output_data = remove(f.read())
        with open(out_path, 'wb') as f:
            f.write(output_data)
        print(f"Saved {out_path} properly.")
    else:
        print(f"Missing {src_path}")
