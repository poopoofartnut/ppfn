import os
import json

def generate_game_tiles(swf_directory):
    games = []
    
    # Iterate through all files in the specified directory
    for filename in os.listdir(swf_directory):
        if filename.lower().endswith('.smc'):
            # Create a game object for each SWF file
            game = {
                "title": filename,  
                "link": f"emulator/index.html#snes/{filename}"
            }
            games.append(game)
    
    # Sort the games alphabetically by title
    games.sort(key=lambda x: x['title'].lower())
    
    # Convert the games list to a JavaScript array string
    js_array = json.dumps(games, indent=2)
    
    # Create the JavaScript code to update the gamelist
    js_code = f"var gamelist = {js_array};\n"
    js_code += "window.dataArr = gamelist;"
    
    return js_code

# Specify the directory containing SWF files
swf_directory = "emulator/snes"

# Generate the JavaScript code
generated_js = generate_game_tiles(swf_directory)

# Write the generated JavaScript to a file
output_file = "/workspaces/ppfn/retro-games/generated_games.js"
with open(output_file, "w") as f:
    f.write(generated_js)

print(f"Game tiles generated and saved to {output_file}")