async function loadChannels() {
    try {
        let response = await fetch('data/channels_ru.json');
        let channels = await response.json();

        let tableBody = document.getElementById('channels-ru-list');

        tableBody.innerHTML = '';

        channels.forEach(channel => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="${channel.url}" target="_blank">${channel.name}</a></td>
                <td>${channel.desc}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Ошибка загрузки JSON:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadChannels);