document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const logoToggle = document.getElementById('logo-toggle');

  logoToggle.addEventListener('click', (e) => {
      e.preventDefault();
      sidebar.classList.toggle('close');
  });

  const dropdownButtons = document.querySelectorAll('.dropdown-btn');
  dropdownButtons.forEach(button => {
      button.addEventListener('click', () => {
          const subMenu = button.nextElementSibling;
          subMenu.classList.toggle('show');
          button.classList.toggle('rotate');
      });
  });
});