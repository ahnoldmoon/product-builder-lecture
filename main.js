const recommendBtn = document.getElementById('recommend-btn');
const menuContainer = document.getElementById('menu-container');

const menuData = [
    "김치찌개",
    "된장찌개",
    "비빔밥",
    "불고기",
    "떡볶이",
    "치킨",
    "피자",
    "파스타",
    "초밥",
    "라멘"
];

recommendBtn.addEventListener('click', () => {
    // Clear previous recommendations
    menuContainer.innerHTML = '';

    // Get 3 random menu items
    const recommendations = getRandomItems(menuData, 3);

    // Show the menu container
    menuContainer.classList.remove('hidden');

    // Display each recommended item
    recommendations.forEach(item => {
        createMenuItem(item);
    });
});

function getRandomItems(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function createMenuItem(name) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';

    if (name === '피자') {
        const image = document.createElement('img');
        // Using a free-to-use image from Pexels.
        image.src = 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
        image.alt = name;
        menuItem.appendChild(image);
    }

    const title = document.createElement('h3');
    title.textContent = name;
    menuItem.appendChild(title);

    if (name !== '피자') {
        menuItem.classList.add('text-only');
    }

    menuContainer.appendChild(menuItem);
}
