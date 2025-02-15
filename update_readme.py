import json
import re

README_FILE = "README.md"
JSON_FILES = {
    "CHANNELS RU": "data/channels_ru.json",
    "CHANNELS EN": "data/channels_en.json",
    "CHATS RU": "data/chats_ru.json",
    "CHATS EN": "data/chats_en.json",
}

def load_json(filename):
    try:
        with open(filename, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def generate_table(items):
    if not items:
        return "_Данных пока нет_\n\n"

    default_photo = "assets/default_avatar.png"

    table = """<table style="table-layout: fixed; width: 100%; border-collapse: collapse;">
    <colgroup>
        <col style="width: 100px;">
        <col style="width: 50%;">
        <col style="width: 40%;">
    </colgroup>
    """

    table += "  <tr>\n"
    table += '    <th>Фото</th>\n'
    table += '    <th>Название</th>\n'
    table += '    <th>Описание</th>\n'
    table += "  </tr>\n"

    for item in items:
        if not isinstance(item, dict):
            continue 
        
        name = item.get("name", "Без названия")
        url = item.get("url", "#")
        desc = item.get("desc", "").replace("\n", " ")
        photo = item.get("photo", "").strip() or default_photo

        photo_html = f"""
        <div style="width:100px; height:100px; display:flex; justify-content:center; align-items:center; overflow:hidden; border-radius:8px;">
            <img src="{photo}" alt="Фото" style="width:100px; height:100px; object-fit:cover;"/>
        </div>"""

        table += f"  <tr>\n"
        table += f"    <td style='text-align:center; vertical-align:middle;'>{photo_html}</td>\n"
        table += f"    <td><a href='{url}'>{name}</a></td>\n"
        table += f"    <td>{desc}</td>\n"
        table += f"  </tr>\n"

    table += "</table>\n\n"
    return table
with open(README_FILE, "r", encoding="utf-8") as f:
    readme_content = f.read()

for marker, json_file in JSON_FILES.items():
    data = load_json(json_file)
    table_md = generate_table(data)

    marker_start = f"<!-- START {marker} -->"
    marker_end = f"<!-- END {marker} -->"
    pattern = re.compile(f"{marker_start}.*?{marker_end}", re.DOTALL)
    replacement = f"{marker_start}\n{table_md}{marker_end}"
    
    readme_content = pattern.sub(replacement, readme_content)

with open(README_FILE, "w", encoding="utf-8") as f:
    f.write(readme_content)

print("✅ README.md успешно обновлён!")
