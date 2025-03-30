document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    const logoToggle = document.getElementById('logo-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (logoToggle && sidebar) {
        logoToggle.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.toggle('close');
            
            // Store state in localStorage
            const isClosed = sidebar.classList.contains('close');
            localStorage.setItem('sidebarClosed', isClosed);
        });
        
        // Load saved state
        const savedState = localStorage.getItem('sidebarClosed');
        if (savedState === 'true') {
            sidebar.classList.add('close');
        }
    }

    // Dropdown functionality
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            this.classList.toggle('rotate');
            
            const subMenu = this.nextElementSibling;
            if (subMenu && subMenu.classList.contains('sub-menu')) {
                subMenu.classList.toggle('show');
                
                // Close other open dropdowns
                document.querySelectorAll('.sub-menu').forEach(menu => {
                    if (menu !== subMenu) {
                        menu.classList.remove('show');
                    }
                });
                
                // Reset other buttons
                document.querySelectorAll('.dropdown-btn').forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        otherBtn.classList.remove('rotate');
                    }
                });
            }
        });
    });

    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        document.querySelectorAll('.sub-menu').forEach(menu => {
            menu.classList.remove('show');
        });
        
        document.querySelectorAll('.dropdown-btn').forEach(btn => {
            btn.classList.remove('rotate');
        });
    });
});