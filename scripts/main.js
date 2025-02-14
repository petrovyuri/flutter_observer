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
            const username = extractUsername(channel.url);
            const card = createChannelCard(channel, username);
            container.appendChild(card);
        });

    } catch (error) {
        handleLoadingError(error);
    }
}

function extractUsername(url) {
    try {
        const cleanUrl = url.replace(/\/+$/g, '');
        const parsed = new URL(cleanUrl);
        return parsed.pathname.split('/')[1] || 'unknown';
    } catch (e) {
        console.error('Некорректный URL:', url);
        return 'unknown';
    }
}

function createChannelCard(channel, username) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    
    const avatarHTML = createAvatarTemplate(username, channel.name);
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

function createAvatarTemplate(username, channelName) {
    const initial = channelName[0].toUpperCase();
    const color = getColorForName(channelName);
    
    return `
        <img src="https://t.me/i/${username}/avatar" 
             class="channel-avatar" 
             alt="${channelName}"
             loading="lazy"
             onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden')">
        <div class="avatar-fallback hidden" style="background: ${color}">
            <span>${initial}</span>
        </div>
    `;
}

function getColorForName(name) {
    const colors = [
        'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        'linear-gradient(135deg, #4ECDC4 0%, #88E0D0 100%)',
        'linear-gradient(135deg, #45B7D1 0%, #7BD3EA 100%)',
        'linear-gradient(135deg, #96CEB4 0%, #B8E994 100%)',
        'linear-gradient(135deg, #FFEEAD 0%, #FFFDA2 100%)'
    ];
    return colors[name.length % colors.length];
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