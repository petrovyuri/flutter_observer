document.addEventListener('DOMContentLoaded', () => {
    loadChannels();
});

async function loadChannels() {
    try {
        const response = await fetch('data/channels_ru.json');
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        
        const channels = await response.json();
        const container = document.getElementById('channels-container');
        container.innerHTML = '';

        channels.forEach(channel => {
            const card = createChannelCard(channel);
            container.appendChild(card);
        });

    } catch (error) {
        handleLoadingError(error);
    }
}

function createChannelCard(channel) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    
    const avatarHTML = createAvatarTemplate(channel);
    const delay = Math.floor(Math.random() * 300);
    
    card.innerHTML = `
        <div class="card-content">
            <div class="channel-header">
                <div class="avatar-wrapper" style="animation-delay: ${delay}ms">
                    ${avatarHTML}
                </div>
                <div class="channel-info">
                    <h3 class="channel-title">${channel.name}</h3>
                    <div class="channel-url">${channel.url}</div>
                </div>
            </div>
            <p class="channel-description">${channel.desc}</p>
            <div class="card-footer">
                <a href="${channel.url}" class="open-button" target="_blank">
                    <i class="fas fa-external-link-alt"></i>
                    Открыть
                </a>
            </div>
        </div>
    `;
    
    return card;
}

function createAvatarTemplate(channel) {
    const defaultAvatar = 'assets/default_avatar.png';
    
    if (channel.photo) {
        return `
            <img src="${channel.photo}" 
                 class="channel-avatar" 
                 alt="${channel.name}"
                 loading="lazy"
                 onerror="this.src='${defaultAvatar}'; this.onerror=null;">
        `;
    }
    
    return `
        <img src="${defaultAvatar}" 
             class="channel-avatar" 
             alt="${channel.name}"
             loading="lazy">
    `;
}

function handleLoadingError(error) {
    console.error('Ошибка загрузки:', error);
    const container = document.getElementById('channels-container');
    container.innerHTML = `
        <div class="error-container">
            <div class="error-icon">⚠️</div>
            <p>Не удалось загрузить данные. Пожалуйста, проверьте подключение к интернету.</p>
        </div>
    `;
}