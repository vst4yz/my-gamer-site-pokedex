// 1. Находим на странице нашу кнопку по её ID и сохраняем ссылку на неё в переменную 
const themeButton = document.getElementById('themeToggle'); 

// 2. Проверяем, была ли уже выбрана тема и сохранена в памяти браузера 
const savedTheme = localStorage.getItem('theme'); 

// 3. Если тема была сохранена, применяем её сразу при загрузке страницы 
if (savedTheme === 'light') { 
    document.body.classList.add('light-theme');
} 

// 4. ЛОГИКА КНОПКИ (Только если кнопка есть в HTML) --- 
if (themeButton) { 
    // Устанавливаем правильный текст кнопки при загрузке 
    if (document.body.classList.contains('light-theme')) { 
        themeButton.textContent = 'Включить тёмную тему'; 
    } else { 
        themeButton.textContent = 'Включить светлую тему'; 
    }  

    // 5. Вешаем обработчик события 'click' на нашу кнопку 
    themeButton.addEventListener('click', function() { 
        // 6. При каждом клике переключаем (toggle) класс 'light-theme' у тега <body> 
        document.body.classList.toggle('light-theme');

        // 7. В зависимости от того, есть ли сейчас класс 'light-theme', делаем две вещи: 
        if (document.body.classList.contains('light-theme')) { 
            // а) Меняем текст кнопки 
            themeButton.textContent = 'Включить тёмную тему'; 
            // б) Сохраняем выбор пользователя в память браузера 
            localStorage.setItem('theme', 'light'); 
        } else { 
            themeButton.textContent = 'Включить светлую тему'; 
            localStorage.setItem('theme', 'dark'); 
        } 
    }); 
} 

// Обработка формы подписки 
const newsForm = document.getElementById('newsForm'); 
const messageDiv = document.getElementById('message'); 
  
// Вспомогательная функция для показа сообщений 
function showMessage(text, type) { 
    if (!messageDiv) return; 
    messageDiv.textContent = text; 
    messageDiv.className = type; 
    setTimeout(() => { 
        if (messageDiv) { 
            messageDiv.textContent = ''; 
            messageDiv.className = ''; 
        } 
    }, 5000); 
} 

if (newsForm && messageDiv) { 
    newsForm.addEventListener('submit', function(event) { 
        event.preventDefault(); 
  
        const emailInput = document.getElementById('email'); 
        if (!emailInput) { 
            showMessage('Поле email не найдено на странице.', 'error'); 
            return; 
        } 
  
        const userEmail = emailInput.value.trim(); 
        if (!userEmail) { 
            showMessage('Пожалуйста, введите email.', 'error'); 
            return; 
        } 
  
        showMessage(`Спасибо за подписку, ${userEmail}! Скоро вы получите письмо.`, 'success'); 
  
        newsForm.reset(); 
        localStorage.setItem('subscribed', 'true'); 
    }); 
} 

// Проверка подписки при загрузке 
if (localStorage.getItem('subscribed') === 'true') { 
    const subscribeTitle = document.querySelector('.subscribe h2'); 
    if (subscribeTitle) { 
        subscribeTitle.textContent = 'Вы уже подписаны на новости!'; 
    } 
}

// Управление списком желаемых игр (Wishlist) 
// 1. Ищем все необходимые элементы на странице 
const wishlistContainer = document.getElementById('wishlistContainer'); 
// 2. Проверяем, есть ли на странице контейнер для wishlist 
if (wishlistContainer) { 
    // 3. Ключ для localStorage 
    const STORAGE_KEY = 'gameWishlist'; 
    // 4. Начальные данные (если в хранилище пусто) 
    let games = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; 
    let currentFilter = 'all'; // Сохраняем текущий фильтр 
    
    // 5. Функция для сохранения списка в localStorage 
    function saveWishlist() { 
        localStorage.setItem(STORAGE_KEY, JSON.stringify(games)); 
        renderWishlist(currentFilter); // Перерисовываем с текущим фильтром 
    } 
    
    // 6. Функция для отрисовки списка 
    function renderWishlist(filter = 'all') { 
        // Очищаем контейнер 
        wishlistContainer.innerHTML = ''; 
        
        // Фильтруем игры 
        let filteredGames = games; 
        if (filter === 'high') { 
            filteredGames = games.filter(game => game.priority >= 8); 
        } else if (filter === 'low') { 
            filteredGames = games.filter(game => game.priority < 8); 
        } 
        
        // Если список пуст 
        if (filteredGames.length === 0) { 
            const message = document.createElement('p'); 
            message.className = 'empty-message'; 
            let messageText = 'Список пока пуст. Добавьте первую игру!'; 
            if (filter === 'high') { 
                messageText = 'Нет игр с высоким приоритетом (8-10)'; 
            } else if (filter === 'low') { 
                messageText = 'Нет игр с низким приоритетом (1-7)'; 
            } 
            message.textContent = messageText; 
            wishlistContainer.appendChild(message); 
            return; 
        } 
         
        // Создаём контейнер для элементов 
        const itemsContainer = document.createElement('div'); 
        itemsContainer.className = 'wishlist-items'; 
         
        // Сортируем по приоритету (сначала высокий) 
        filteredGames.sort((a, b) => b.priority - a.priority); 
         
        // Для каждой игры создаём элемент 
        filteredGames.forEach((game) => { 
            const gameElement = document.createElement('div'); 
            // Находим реальный индекс в исходном массиве 
            const realIndex = games.findIndex(g => g.id === game.id); 
            const priorityClass = game.priority >= 8 ? 'high-priority' : 'low-priority'; 
            gameElement.className = `wishlist-item ${priorityClass}`; 
             
            gameElement.innerHTML = ` 
                <div class="item-info"> 
                    <h4>${escapeHtml(game.name)}</h4> 
                    <span class="priority">Приоритет: ${game.priority}/10</span> 
                    <small style="display: block; color: #666; font-size: 0.7em;">Добавлена: ${new Date(game.added).toLocaleDateString()}</small> 
                </div> 
                <div class="item-actions"> 
                    <button data-action="increase" data-index="${realIndex}" 
title="Повысить приоритет">⬆️</button> 
                    <button data-action="decrease" data-index="${realIndex}" 
title="Понизить приоритет">⬇️</button> 
                    <button data-action="remove" data-index="${realIndex}" 
title="Удалить">❌</button> 
                </div> 
            `; 
             
            itemsContainer.appendChild(gameElement); 
        }); 
         
        wishlistContainer.appendChild(itemsContainer); 
        
        // Добавляем обработчики событий для кнопок
        document.querySelectorAll('[data-action="increase"]').forEach(btn => { 
            btn.removeEventListener('click', handleIncrease); 
            btn.addEventListener('click', handleIncrease); 
        }); 
         
        document.querySelectorAll('[data-action="decrease"]').forEach(btn => { 
            btn.removeEventListener('click', handleDecrease); 
            btn.addEventListener('click', handleDecrease); 
        }); 
         
        document.querySelectorAll('[data-action="remove"]').forEach(btn => { 
            btn.removeEventListener('click', handleRemove); 
            btn.addEventListener('click', handleRemove); 
        }); 
    } 
     
    // Вспомогательная функция для экранирования HTML 
    function escapeHtml(str) { 
        const div = document.createElement('div'); 
        div.textContent = str; 
        return div.innerHTML; 
    } 
     
    // Обработчики действий 
    function handleIncrease(e) { 
        const index = parseInt(e.currentTarget.dataset.index); 
        if (games[index] && games[index].priority < 10) { 
            games[index].priority++; 
            saveWishlist(); 
        } 
    } 
     
    function handleDecrease(e) { 
        const index = parseInt(e.currentTarget.dataset.index); 
        if (games[index] && games[index].priority > 1) { 
            games[index].priority--; 
            saveWishlist(); 
        } 
    } 
     
    function handleRemove(e) { 
        const index = parseInt(e.currentTarget.dataset.index); 
        if (confirm(`Удалить игру "${games[index].name}" из списка?`)) { 
            games.splice(index, 1); 
            saveWishlist(); 
        } 
    } 
     
    // 8. Обработчик добавления новой игры 
    const addGameBtn = document.getElementById('addGameBtn'); 
    if (addGameBtn) { 
        addGameBtn.addEventListener('click', function() { 
            const nameInput = document.getElementById('gameInput'); 
            const priorityInput = document.getElementById('priorityInput'); 
             
            const name = nameInput.value.trim(); 
            const priority = parseInt(priorityInput.value); 
             
            // Валидация 
            if (!name) { 
                alert('Введите название игры'); 
                return; 
            } 
             
            if (isNaN(priority) || priority < 1 || priority > 10) { 
                alert('Приоритет должен быть числом от 1 до 10'); 
                return; 
            } 
             
            // Добавляем игру с уникальным ID 
            games.push({ 
                id: Date.now(), // Уникальный идентификатор 
                name: name, 
                priority: priority, 
                added: new Date().toISOString() 
            }); 
             
            // Очищаем поля и сохраняем 
            nameInput.value = ''; 
            priorityInput.value = ''; 
            saveWishlist(); 
        }); 
    } 
     
    // 9. Обработчики фильтров 
    document.querySelectorAll('.filter-btn').forEach(btn => { 
        btn.addEventListener('click', function() { 
            // Убираем активный класс у всех кнопок 
            document.querySelectorAll('.filter-btn').forEach(b => 
                b.classList.remove('active')); 
            // Добавляем активный класс текущей кнопке 
            this.classList.add('active'); 
            // Сохраняем и применяем фильтр 
            currentFilter = this.dataset.filter; 
            renderWishlist(currentFilter); 
        }); 
    }); 
     
    // 10. Очистка всего списка 
    const clearAllBtn = document.getElementById('clearAllBtn'); 
    if (clearAllBtn) { 
        clearAllBtn.addEventListener('click', function() { 
            if (games.length > 0 && confirm('Удалить ВЕСЬ список игр?')) { 
                games = []; 
                saveWishlist(); 
            } 
        }); 
    } 
     
    // 11. Экспорт в JSON 
    const exportBtn = document.getElementById('exportBtn'); 
    if (exportBtn) { 
        exportBtn.addEventListener('click', function() { 
            if (games.length === 0) { 
                alert('Список пуст'); 
                return; 
            } 
             
            const dataStr = JSON.stringify(games, null, 2); 
            const dataUri = 'data:application/json;charset=utf-8,' + 
                encodeURIComponent(dataStr); 
            const exportFileDefaultName = `wishlist_${new 
                Date().toISOString().slice(0, 19)}.json`; 
             
            const linkElement = document.createElement('a'); 
            linkElement.setAttribute('href', dataUri); 
            linkElement.setAttribute('download', exportFileDefaultName); 
            document.body.appendChild(linkElement); 
            linkElement.click(); 
            document.body.removeChild(linkElement); 
        }); 
    } 
    // 12. Инициализация - отрисовка списка при загрузке 
    renderWishlist(currentFilter); 
}

// ===== Pokédex =====
let currentOffset = 0;
const limit = 20;
let allPokemon = [];

const pokedexContainer = document.getElementById('pokedexContainer'); 
const loadMoreBtn = document.getElementById('loadMoreBtn'); 
const resetBtn = document.getElementById('resetBtn'); 
const searchBtn = document.getElementById('searchBtn'); 
const searchInput = document.getElementById('pokemonSearch'); 
const shownCount = document.getElementById('shownCount'); 
const totalCount = document.getElementById('totalCount');

// ===== Загрузка покемонов =====
async function loadPokemon(offset = 0) {
    try {
        if (offset === 0) pokedexContainer.innerHTML = '<div class="loading">Загрузка покемонов...</div>';

        const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const listData = await listRes.json();

        // Получаем детали только для этих 20 покемонов
        const detailsPromises = listData.results.map(p => fetch(p.url).then(res => res.json()));
        const details = await Promise.all(detailsPromises);

        if (offset === 0) allPokemon = details;
        else allPokemon = [...allPokemon, ...details];

        renderPokemon(allPokemon);
        updateCounters();
    } catch (err) {
        console.error(err);
        showError('Не удалось загрузить данные. Проверьте соединение.');
    }
}

// ===== Поиск покемона =====
async function searchPokemon() { 
    const query = searchInput.value.trim().toLowerCase(); 
     
    if (!query) { 
        loadPokemon(0); // Исправлено: сбрасываем offset при пустом поиске
        return; 
    } 
     
    try { 
        pokedexContainer.innerHTML = '<div class="loading">Поиск покемона...</div>'; 
         
        // Пробуем поиск по ID или имени 
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`); 
         
        if (!response.ok) { 
            throw new Error('Покемон не найден'); 
        } 
         
        const pokemonData = await response.json(); 
         
        // Отображаем найденного покемона 
        allPokemon = [pokemonData]; 
        renderPokemon(allPokemon); 
        updateCounters(); 
         
    } catch (error) { 
        showError(`Покемон "${query}" не найден. Попробуйте другое имя или ID.`); 
    } 
} 

// ===== Отрисовка покемонов =====
function renderPokemon(pokemonList) { 
    if (!pokedexContainer) return; // Добавлена проверка
    
    pokedexContainer.innerHTML = ''; 
     
    if (pokemonList.length === 0) { 
        pokedexContainer.innerHTML = '<div class="error">Покемоны не найдены</div>'; 
        return; 
    } 
     
    pokemonList.forEach(pokemon => { 
        const card = document.createElement('div'); 
        card.className = 'pokemon-card'; 
        card.dataset.id = pokemon.id; 
         
        // Получаем типы покемона 
        const types = pokemon.types.map(typeInfo => typeInfo.type.name); 
         
        // Основные характеристики 
        const hp = pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0; 
        const attack = pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0; 
        const defense = pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0; 
         
        // Получаем URL изображения с fallback 
        const imgUrl = pokemon.sprites.other?.['official-artwork']?.front_default ||  
                      pokemon.sprites.front_default ||  
                      'https://via.placeholder.com/140?text=No+Image'; 
         
        card.innerHTML = ` 
            <div class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</div> 
            <img src="${imgUrl}"  
                 alt="${pokemon.name}" 
                 onerror="this.src='https://via.placeholder.com/140?text=Error'"> 
            <h3>${pokemon.name}</h3> 
             
            <div class="types"> 
                ${types.map(type =>  
                    `<span class="type-badge type-${type}">${type}</span>` 
                ).join('')} 
            </div> 
             
            <div class="stats"> 
                <div class="stat"> 
                    <div class="stat-value">${hp}</div> 
                    <div class="stat-label">HP</div> 
                </div> 
                <div class="stat"> 
                    <div class="stat-value">${attack}</div> 
                    <div class="stat-label">ATK</div> 
                </div> 
                <div class="stat"> 
                    <div class="stat-value">${defense}</div> 
                    <div class="stat-label">DEF</div> 
                </div> 
            </div> 
        `; 
         
        // Добавляем обработчик клика для деталей 
        card.addEventListener('click', () => showPokemonDetails(pokemon)); 
         
        pokedexContainer.appendChild(card); 
    }); 
} 

// ===== Модальное окно с деталями =====
function showPokemonDetails(pokemon) { 
    // Создаем модальное окно 
    const modal = document.createElement('div'); 
    modal.className = 'modal'; 
    modal.id = 'pokemonModal'; 
     
    const abilities = pokemon.abilities.map(a => a.ability.name).join(', '); 
    const height = pokemon.height / 10; // в метрах 
    const weight = pokemon.weight / 10; // в кг 
     
    const imgUrl = pokemon.sprites.other?.['official-artwork']?.front_default ||  
                  pokemon.sprites.front_default ||  
                  'https://via.placeholder.com/200?text=No+Image'; 
     
    modal.innerHTML = ` 
        <div class="modal-content"> 
            <button class="close-modal">&times;</button> 
             
            <div style="text-align: center"> 
                <h2>${pokemon.name.toUpperCase()} #${String(pokemon.id).padStart(3, '0')}</h2> 
                <img src="${imgUrl}"  
                     alt="${pokemon.name}" 
                     style="width: 200px; height: 200px;"> 
                 
                <div style="margin: 20px 0"> 
                    ${pokemon.types.map(type =>  
                        `<span class="type-badge type-${type.type.name}" style="margin: 5px"> 
                            ${type.type.name} 
                        </span>` 
                    ).join('')} 
                </div> 
                 
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0"> 
                    <div> 
                        <h4 style="color: #00eeff">Характеристики</h4> 
                        <p>Рост: ${height} м</p> 
                        <p>Вес: ${weight} кг</p> 
                        <p>Базовый опыт: ${pokemon.base_experience || '—'}</p> 
                    </div> 
                    <div> 
                        <h4 style="color: #00eeff">Способности</h4> 
                        <p>${abilities}</p> 
                    </div> 
                </div> 
                 
                <div> 
                    <h4 style="color: #00eeff">Статистика</h4> 
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center"> 
                        ${pokemon.stats.map(stat =>  
                            `<div style="background: rgba(0,238,255,0.1); padding: 10px; border-radius: 10px; min-width: 80px"> 
                                <div style="font-weight: bold; color: #00eeff">${stat.base_stat}</div> 
                                <div style="font-size: 0.8em; color: #aaa">${stat.stat.name}</div> 
                            </div>` 
                        ).join('')} 
                    </div> 
                </div> 
            </div> 
        </div> 
    `; 
     
    document.body.appendChild(modal); 
    modal.style.display = 'flex'; 
     
    // Закрытие модального окна 
    modal.querySelector('.close-modal').addEventListener('click', () => { 
        document.body.removeChild(modal); 
    }); 
     
    modal.addEventListener('click', (e) => { 
        if (e.target === modal) { 
            document.body.removeChild(modal); 
        } 
    }); 
} 

// ===== Вспомогательные функции =====
function updateCounters() { 
    if (shownCount) shownCount.textContent = allPokemon.length; 
    if (totalCount) totalCount.textContent = '898'; // Общее количество покемонов (можно получить из API) 
} 
  
function showError(message) { 
    if (!pokedexContainer) return; // Добавлена проверка
    
    pokedexContainer.innerHTML = ` 
        <div class="error"> 
            <p>${message}</p> 
            <button onclick="resetAndLoad()" style="margin-top: 15px; padding: 10px 20px; background: #00eeff; border: none; border-radius: 30px; cursor: pointer;">Вернуться к списку</button> 
        </div> 
    `; 
} 
  
// Вспомогательная функция для сброса 
function resetAndLoad() { 
    currentOffset = 0; 
    if (searchInput) searchInput.value = ''; 
    loadPokemon(0); 
} 

// ===== Инициализация =====
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, существуют ли элементы Pokédex на странице
    if (pokedexContainer) {
        // Загружаем первых покемонов 
        loadPokemon(currentOffset); 
        
        // Кнопка "Загрузить ещё" 
        loadMoreBtn?.addEventListener('click', () => { 
            currentOffset += limit; 
            loadPokemon(currentOffset); 
        }); 
        
        // Кнопка "Сбросить" 
        resetBtn?.addEventListener('click', () => { 
            currentOffset = 0; 
            if (searchInput) searchInput.value = ''; 
            loadPokemon(0); 
        }); 
        
        // Поиск по кнопке 
        searchBtn?.addEventListener('click', searchPokemon); 
        
        // Поиск по Enter 
        searchInput?.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') { 
                searchPokemon(); 
            } 
        }); 
    }
}); 
  
// Глобальная функция для кнопки в ошибке 
window.resetAndLoad = resetAndLoad;