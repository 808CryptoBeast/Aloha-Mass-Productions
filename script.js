document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = document.getElementById('exploreBtn');
    const closeBtn = document.getElementById('closeBtn');
    const introVision = document.getElementById('introVision');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const subMenu = document.querySelector('.sub-menu');
    const redeemRewardsBtn = document.getElementById('redeem-rewards');
    const rewardPoints = document.getElementById('reward-points');
    let points = parseInt(localStorage.getItem('rewardPoints')) || 0;

    rewardPoints.textContent = points;

    exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        introVision.classList.add('visible');
    });

    closeBtn.addEventListener('click', () => {
        introVision.classList.remove('visible');
    });

    dropdownBtn.addEventListener('click', () => {
        subMenu.classList.toggle('show');
        dropdownBtn.classList.toggle('rotate');
    });

    redeemRewardsBtn.addEventListener('click', () => {
        if (points >= 100) {
            points -= 100;
            localStorage.setItem('rewardPoints', points);
            rewardPoints.textContent = points;
            alert('Mahalo! You’ve redeemed 100 points for a $10 discount. Check your email for the code!');
        } else {
            alert('Aloha! You need at least 100 points to redeem. Shop at our Marketplace to earn more!');
        }
    });
});