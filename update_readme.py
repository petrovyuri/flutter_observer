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
    """Загрузка данных из JSON файла"""
    try:
        with open(filename, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"⚠️ Файл {filename} не найден")
        return []
    except json.JSONDecodeError:
        print(f"⚠️ Ошибка декодирования {filename}")
        return []

def generate_table(items):
    """Генерация HTML-таблицы с фиксированными размерами изображений"""
    if not items:
        return "_Данных пока нет_\n\n"

    default_photo = "assets/default_avatar.png"

    table = """<table style="table-layout: fixed; width: 100%; border-collapse: collapse;">
    <colgroup>
        <col style="width: 100px;">
        <col style="width: 50%;">
        <col style="width: 40%;">
    </colgroup>
    <tr>
        <th>Фото</th>
        <th>Название</th>
        <th>Описание</th>
    </tr>
    """

    for item in items:
        if not isinstance(item, dict):
            continue

        name = item.get("name", "Без названия")
        url = item.get("url", "#")
        desc = item.get("desc", "").replace("\n", " ")
        photo = item.get("photo", "").strip() or default_photo

        photo_html = f"""
        <div style="
            width: 100px;
            height: 100px;
            min-width: 100px;
            min-height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            border-radius: 8px;
            background: #f0f0f0;
            border: 1px solid #ddd;">
            <img src="{photo}"
                 alt="Фото"
                 style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;">
        </div>"""

        table += f"""
        <tr>
            <td style='text-align:center; vertical-align:middle;'>{photo_html}</td>
            <td><a href="{url}">{name}</a></td>
            <td>{desc}</td>
        </tr>
        """

    table += "</table>\n\n"
    return table

def main():
    """Основная функция обработки"""
    with open(README_FILE, "r", encoding="utf-8") as f:
        readme_content = f.read()

    for marker, json_file in JSON_FILES.items():
        data = load_json(json_file)
        table_md = generate_table(data)

        marker_start = f"<!-- START {marker} -->"
        marker_end = f"<!-- END {marker} -->"
        pattern = re.compile(f"{re.escape(marker_start)}.*?{re.escape(marker_end)}", re.DOTALL)
        replacement = f"{marker_start}\n{table_md}{marker_end}"
        
        readme_content = pattern.sub(replacement, readme_content)

    with open(README_FILE, "w", encoding="utf-8") as f:
        f.write(readme_content)

    print("✅ README.md успешно обновлён!")

if __name__ == "__main__":
    main()