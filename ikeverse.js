// Function to start a course
function startCourse(courseName) {
  alert(`Starting course: ${courseName}`);
  // Implement course starting logic here
}

// Add interactive elements and analytics
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');

  // Search functionality
  searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const courseCategories = document.querySelectorAll('.course-category');

      courseCategories.forEach(category => {
          const courseName = category.querySelector('h3').textContent.toLowerCase();
          if (courseName.includes(query)) {
              category.style.display = 'block';
          } else {
              category.style.display = 'none';
          }
      });
  });
});