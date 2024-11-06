import os
import glob

# Get the list of project directories
projects_dir = './projects'
gamelist = []

for file in os.listdir(projects_dir):
    project_path = os.path.join(projects_dir, file)

    # Check if the current item is a directory
    if os.path.isdir(project_path):
        # Check if the project has an index.html file
        index_html_path = os.path.join(project_path, 'index.html')
        if os.path.isfile(index_html_path):
            # Find the first available image file in the project directory
            image_path = glob.glob(os.path.join(project_path, '*.png'))
            if image_path:
                # Add the game to the gamelist array
                game = {
                    'link': index_html_path,
                    'imgSrc': image_path[0],
                    'title': file,
                }
                gamelist.append(game)
            else:
                print(f"No image files found in {project_path}")
        else:
            print(f"No index.html found in {project_path}")

print(gamelist)