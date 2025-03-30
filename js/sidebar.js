
// Toggle sidebar
document.getElementById('logo-toggle').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('sidebar').classList.toggle('close');
});

// Dropdown functionality
const dropdownBtns = document.querySelectorAll('.dropdown-btn');
dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        this.classList.toggle('rotate');
        const subMenu = this.nextElementSibling;
        subMenu.classList.toggle('show');
    });
});

// Close dropdown when clicking elsewhere
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown-btn')) {
        document.querySelectorAll('.sub-menu').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.dropdown-btn').forEach(btn => {
            btn.classList.remove('rotate');
        });
    }
});
