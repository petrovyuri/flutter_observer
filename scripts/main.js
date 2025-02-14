document.addEventListener('DOMContentLoaded', () => {
    loadData("chats_ru");
    loadData("chats_en");
    loadData("channels_ru");
    loadData("channels_en");
});

async function loadData(str) {
    try {
        const response = await fetch(`data/${str}.json`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const channels = await response.json();
        const container = document.getElementById(`${str}-container`);
        container.innerHTML = '';

        channels.forEach(channel => {
            const card = createCard(channel);
            container.appendChild(card);
        });

    } catch (error) {
        handleLoadingError(error);
    }
}

function createCard(data) {
    const card = document.createElement('a'); 
    card.className = 'channel-card';
    card.href = `https://t.me/${data.url.replace(/^@/, '')}`;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const avatarHTML = createAvatarTemplate(data);
    const delay = Math.floor(Math.random() * 300);

    card.innerHTML = `
        <div class="card-content">
            <div class="channel-header">
                <div class="avatar-wrapper" style="animation-delay: ${delay}ms">
                    ${avatarHTML}
                </div>
                <div class="channel-info">
                    <h3 class="channel-title">${data.name}</h3>
                    ${data.link ? `<span class="channel-link">${data.link}</span>` : ''}
                </div>
            </div>
            <p class="channel-description">${data.desc}</p>
        </div>
    `;

    return card;
}

function createAvatarTemplate(data) {
    const defaultAvatar = 'assets/default_avatar.png';

    if (data.photo) {
        return `
            <img src="${data.photo}" 
                 class="channel-avatar" 
                 alt="${data.name}"
                 loading="lazy"
                 onerror="this.src='${defaultAvatar}'; this.onerror=null;">
        `;
    }

    return `
        <img src="${defaultAvatar}" 
             class="channel-avatar" 
             alt="${data.name}"
             loading="lazy">
    `;
}

function handleLoadingError(error, container) {
    console.error('Ошибка загрузки:', error);
    container.innerHTML = `
        <div class="error-container">    
            <h2>Ошибка загрузки данных</h2>
            <p>${error.message}</p>
        </div>
    `;
}