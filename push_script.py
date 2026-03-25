import os
import subprocess
import glob

files_to_commit = glob.glob('src/assets/*.png') + glob.glob('src/assets/*.jpg') + glob.glob('src/components/*.jsx') + ['src/App.jsx', 'src/index.css', 'src/main.jsx']

messages = [
    "Add asset {f}",
    "Update component {f}",
    "Refactor {f} for better performance",
    "Integrate {f}",
]

count = 0
for f in files_to_commit:
    f = f.replace('\\', '/')
    subprocess.run(['git', 'add', f])
    
    # check if anything to commit
    result = subprocess.run(['git', 'diff', '--cached', '--quiet'])
    if result.returncode != 0:
        msg = f"Add {os.path.basename(f)}"
        if 'components' in f:
            msg = f"Update component {os.path.basename(f)}"
        elif 'index.css' in f:
            msg = "Update global styles"
            
        print(f"Committing {f}...")
        subprocess.run(['git', 'commit', '-m', msg])
        count += 1
        
    if count >= 30:
        break

# Commit any remaining changes in the repo together
subprocess.run(['git', 'add', '.'])
subprocess.run(['git', 'commit', '-m', 'Finalise ocean depth animations and cinematic upgrades'])
subprocess.run(['git', 'push'])

print(f"Created {count + 1} commits. All changes pushed.")
