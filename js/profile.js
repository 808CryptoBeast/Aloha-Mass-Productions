/**
 * Profile Module - Main Controller
 * Manages user profile, settings, and related functionality
 */
class Profile {
  constructor() {
    this.domElements = {};
    this.modals = {};
    this.userData = null;
    this.isAuthenticated = false;
    this.imageState = {
      currentImage: null,
      currentRotation: 0,
      cropper: null,
      currentCropType: null,
      pendingSaveType: null
    };

    this.init();
  }

  async init() {
    try {
      this.cacheDomElements();
      this.initTheme();
      this.initEventListeners();
      await this.loadUserProfile();
    } catch (error) {
      console.error('Profile initialization failed:', error);
      this.showToast('Failed to initialize profile', 'error');
    }
  }

  cacheDomElements() {
    this.domElements = {
      loadingScreen: document.getElementById('loading-screen'),
      profileHeader: document.getElementById('profile-header'),
      themeToggle: document.getElementById('theme-toggle'),
      navButtons: document.querySelectorAll('.nav-btn'),
      profileSections: document.querySelectorAll('.profile-section'),
      toastContainer: document.getElementById('toast-container')
    };

    this.modals = {
      intro: document.getElementById('intro-modal'),
      details: document.getElementById('details-modal'),
      security: document.getElementById('security-modal'),
      profilePic: document.getElementById('profile-pic-modal'),
      coverPhoto: document.getElementById('cover-photo-modal'),
      crop: document.getElementById('crop-modal')
    };
  }

  initTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    document.body.classList.add(`${currentTheme}-mode`);
    
    this.domElements.themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      document.body.classList.toggle('dark-mode', !isDark);
      document.body.classList.toggle('light-mode', isDark);
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      this.showToast(`Switched to ${isDark ? 'light' : 'dark'} mode`, 'success');
    });
  }

  initEventListeners() {
    this.domElements.navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const sectionId = `${button.dataset.section}-section`;
        this.switchSection(sectionId);
      });
    });

    this.setupModalEventListeners();
    this.initImageUploadListeners();
  }

  setupModalEventListeners() {
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });

    this.addClickListener('edit-intro-btn', () => this.openIntroModal());
    this.addClickListener('edit-details-btn', () => this.openDetailsModal());
    this.addClickListener('cancel-intro-edit', () => this.closeAllModals());
    this.addClickListener('cancel-details-edit', () => this.closeAllModals());
    this.addClickListener('cancel-verification', () => this.closeAllModals());
    this.addClickListener('save-intro-edit', () => this.saveIntroChanges());
    this.addClickListener('save-details-edit', () => this.verifyBeforeSave('details'));
    this.addClickListener('confirm-verification', () => this.verifyPassword());
    this.addClickListener('toggle-password', () => this.togglePasswordVisibility());

    document.querySelectorAll('.formatting-tools button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.applyFormatting(e.target.dataset.format);
      });
    });
  }

  initImageUploadListeners() {
    this.delegateEvent('.upload-pic-btn', 'click', (e) => {
      e.preventDefault();
      this.openImageUploadModal('profile');
    });

    this.delegateEvent('.edit-profile-btn', 'click', (e) => {
      e.preventDefault();
      this.openImageUploadModal('cover');
    });

    ['profile', 'cover'].forEach(type => {
      this.addClickListener(`take-${type}-photo-btn`, () => this.takePhoto(type));
      this.addClickListener(`choose-${type}-photo-btn`, () => this.choosePhoto(type));
    });

    ['', 'cover-'].forEach(prefix => {
      this.addClickListener(`${prefix}rotate-left-btn`, () => this.rotateImage(-90));
      this.addClickListener(`${prefix}rotate-right-btn`, () => this.rotateImage(90));
      this.addClickListener(`${prefix}crop-btn`, () => this.openCropTool());
    });

    this.addClickListener('save-profile-pic', () => this.saveProfilePicture());
    this.addClickListener('save-cover-photo', () => this.saveCoverPhoto());
    this.addClickListener('apply-crop', () => this.applyCrop());
    this.addClickListener('cancel-crop', () => this.closeCropTool());

    document.querySelectorAll('.aspect-ratio-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.aspect-ratio-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (this.imageState.cropper) {
          const ratio = btn.dataset.ratio;
          this.imageState.cropper.setAspectRatio(ratio === 'free' ? NaN : parseFloat(ratio));
        }
      });
    });
  }

  addClickListener(id, handler) {
    const element = document.getElementById(id);
    if (element) element.addEventListener('click', handler);
  }

  delegateEvent(selector, event, handler) {
    document.addEventListener(event, (e) => {
      if (e.target.matches(selector)) handler(e);
    });
  }

  async loadUserProfile() {
    try {
      this.showLoading();
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.userData = this.getMockUserData();
      this.isAuthenticated = true;
      this.renderProfile();
      this.hideLoading();
    } catch (error) {
      console.error('Error loading profile:', error);
      this.showToast('Failed to load profile data', 'error');
      this.hideLoading();
    }
  }

  getMockUserData() {
    return {
      id: 'user_123456',
      username: 'aloha_creator',
      name: 'Alex Johnson',
      bio: 'Digital artist and Hawaiian culture enthusiast. Creating meaningful connections through technology and tradition.',
      location: 'Honolulu, HI',
      occupation: 'Digital Creator',
      interests: ['Blockchain', 'Hawaiian Culture', 'Sustainable Fashion', 'XRPL'],
      website: 'https://alexjohnson.design',
      memberSince: '2022-06-15',
      profilePic: '/components/pics/default-profile.jpg',
      coverPhoto: '/components/pics/AMP Rabbit Island.jpg',
      learningStats: {
        progress: 78,
        coursesInProgress: 4,
        coursesCompleted: 14,
        learningHours: 42
      },
      wallet: {
        balance: 1250,
        assets: [
          { name: 'XRP', amount: 1250, value: 625 },
          { name: 'AMP', amount: 5000, value: 250 },
          { name: 'USD', amount: 100, value: 100 }
        ]
      },
      recentActivity: [
        {
          type: 'course_completed',
          title: 'Completed "Introduction to Hawaiian Language"',
          time: '2 hours ago',
          icon: 'fluent:book-24-filled'
        },
        {
          type: 'badge_earned',
          title: 'Earned "Culture Explorer" badge',
          time: '1 day ago',
          icon: 'fluent:medal-24-filled'
        }
      ]
    };
  }

  renderProfile() {
    if (!this.userData) return;
    
    this.domElements.profileHeader.innerHTML = `
      <div class="cover-photo" style="background-image: url('${this.userData.coverPhoto}')">
        <div class="profile-actions">
          <button class="edit-profile-btn">Edit Profile</button>
        </div>
      </div>
      <div class="profile-info">
        <div class="profile-pic-container">
          <img src="${this.userData.profilePic}" alt="Profile Picture" class="profile-pic">
          <button class="upload-pic-btn">
            <iconify-icon icon="fluent:camera-add-24-filled"></iconify-icon>
          </button>
        </div>
        <div class="profile-details">
          <h1 class="profile-name">${this.userData.name}</h1>
          <p class="profile-username">@${this.userData.username}</p>
          <p class="profile-bio">${this.userData.bio}</p>
          <div class="profile-stats">
            ${this.renderProfileStats()}
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('intro-text').textContent = this.userData.bio;
    document.getElementById('member-since').textContent = new Date(this.userData.memberSince).toLocaleDateString();
    document.getElementById('user-location').textContent = this.userData.location;
    document.getElementById('user-occupation').textContent = this.userData.occupation;
    document.getElementById('user-interests').textContent = this.userData.interests.join(', ');
    
    const activityList = document.getElementById('recent-activity-list');
    activityList.innerHTML = this.userData.recentActivity.map(activity => `
      <div class="activity-item">
        <iconify-icon icon="${activity.icon}"></iconify-icon>
        <div class="activity-content">
          <p class="activity-text">${activity.title}</p>
          <span class="activity-time">${activity.time}</span>
        </div>
      </div>
    `).join('');
    
    this.domElements.profileHeader.style.display = 'block';
    this.initDynamicEventListeners();
  }

  renderProfileStats() {
    return `
      <div class="stat">
        <span class="stat-number">${this.userData.learningStats.progress}%</span>
        <span class="stat-label">Learning Progress</span>
      </div>
      <div class="stat">
        <span class="stat-number">${this.userData.learningStats.coursesCompleted}</span>
        <span class="stat-label">Courses Completed</span>
      </div>
      <div class="stat">
        <span class="stat-number">${this.userData.wallet.balance}</span>
        <span class="stat-label">AMP Points</span>
      </div>
    `;
  }

  switchSection(sectionId) {
    this.domElements.profileSections.forEach(section => {
      section.classList.remove('active');
    });
    
    this.domElements.navButtons.forEach(button => {
      button.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    const activeButton = Array.from(this.domElements.navButtons).find(button => 
      `${button.dataset.section}-section` === sectionId
    );
    
    if (activeButton) {
      activeButton.classList.add('active');
    }
    
    this.loadSectionContent(sectionId);
  }

  loadSectionContent(sectionId) {
    const sectionHandlers = {
      'learning-section': () => this.loadLearningContent(),
      'wallet-section': () => this.loadWalletContent(),
      'achievements-section': () => this.loadAchievementsContent(),
      'community-section': () => this.loadCommunityContent()
    };

    if (sectionHandlers[sectionId]) {
      sectionHandlers[sectionId]();
    }
  }

  /* Image Handling Methods */
  openImageUploadModal(type) {
    this.closeAllModals();
    this.imageState.currentCropType = type;
    const modal = type === 'profile' ? this.modals.profilePic : this.modals.coverPhoto;
    modal.classList.add('active');
  }

  async takePhoto(type) {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.showToast('Camera access not supported in your browser', 'error');
      return;
    }

    this.imageState.currentCropType = type;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.closeAllModals();
      
      const cameraModal = document.createElement('div');
      cameraModal.className = 'modal active';
      cameraModal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>Take Photo</h3>
            <button class="close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <video id="camera-preview" autoplay playsinline></video>
          </div>
          <div class="modal-footer">
            <button id="capture-btn" class="btn-primary">
              <iconify-icon icon="fluent:camera-24-filled"></iconify-icon>
              Capture
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(cameraModal);
      
      const video = cameraModal.querySelector('#camera-preview');
      video.srcObject = stream;
      
      cameraModal.querySelector('#capture-btn').addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        stream.getTracks().forEach(track => track.stop());
        
        canvas.toBlob(blob => {
          this.processImage(blob, type);
          cameraModal.remove();
        }, 'image/jpeg', 0.9);
      });
      
      cameraModal.querySelector('.close-modal').addEventListener('click', () => {
        stream.getTracks().forEach(track => track.stop());
        cameraModal.remove();
      });
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      this.showToast('Could not access camera. Please check permissions.', 'error');
    }
  }

  choosePhoto(type) {
    this.imageState.currentCropType = type;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.processImage(file, type);
      }
    };
    
    input.click();
  }

  processImage(fileOrBlob, type) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      this.imageState.currentImage = e.target.result;
      this.imageState.currentRotation = 0;
      
      const previewId = type === 'profile' ? 'profile-pic-preview-img' : 'cover-photo-preview-img';
      const previewContainer = type === 'profile' 
        ? '#profile-pic-modal .image-preview-container' 
        : '#cover-photo-modal .image-preview-container';
      
      document.getElementById(previewId).src = this.imageState.currentImage;
      document.querySelector(previewContainer).style.display = 'block';
    };
    
    if (fileOrBlob instanceof Blob) {
      reader.readAsDataURL(fileOrBlob);
    } else {
      reader.readAsDataURL(new Blob([fileOrBlob]));
    }
  }

  rotateImage(degrees) {
    this.imageState.currentRotation += degrees;
    const previewImg = this.imageState.currentCropType === 'profile' 
      ? document.getElementById('profile-pic-preview-img')
      : document.getElementById('cover-photo-preview-img');
    previewImg.style.transform = `rotate(${this.imageState.currentRotation}deg)`;
  }

  openCropTool() {
    if (!this.imageState.currentImage) return;
    
    const previewImg = this.imageState.currentCropType === 'profile' 
      ? document.getElementById('profile-pic-preview-img')
      : document.getElementById('cover-photo-preview-img');
    
    this.closeAllModals();
    
    const cropContainer = document.getElementById('crop-container');
    cropContainer.innerHTML = `<img id="crop-image" src="${this.imageState.currentImage}" style="max-width: 100%; max-height: 400px;">`;
    
    const image = document.getElementById('crop-image');
    this.imageState.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      autoCropArea: 0.8,
      responsive: true,
      rotatable: true,
      scalable: true,
      ready: () => {
        if (this.imageState.currentRotation !== 0) {
          this.imageState.cropper.rotateTo(this.imageState.currentRotation);
        }
      }
    });
    
    this.modals.crop.classList.add('active');
  }

  applyCrop() {
    if (!this.imageState.cropper) return;
    
    const canvas = this.imageState.cropper.getCroppedCanvas({
      width: this.imageState.currentCropType === 'profile' ? 500 : 1500,
      height: this.imageState.currentCropType === 'profile' ? 500 : 500,
      minWidth: 256,
      minHeight: 256,
      maxWidth: 2000,
      maxHeight: 2000,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    });
    
    this.imageState.currentImage = canvas.toDataURL('image/jpeg', 0.9);
    this.imageState.currentRotation = 0;
    
    const previewImg = this.imageState.currentCropType === 'profile' 
      ? document.getElementById('profile-pic-preview-img')
      : document.getElementById('cover-photo-preview-img');
    
    previewImg.src = this.imageState.currentImage;
    previewImg.style.transform = 'rotate(0deg)';
    
    this.closeCropTool();
    this.openImageUploadModal(this.imageState.currentCropType);
  }

  closeCropTool() {
    if (this.imageState.cropper) {
      this.imageState.cropper.destroy();
      this.imageState.cropper = null;
    }
    this.modals.crop.classList.remove('active');
  }

  async saveProfilePicture() {
    if (!this.imageState.currentImage) {
      this.showToast('Please select an image first', 'warning');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.userData.profilePic = this.imageState.currentImage;
      document.querySelector('.profile-pic').src = this.imageState.currentImage;
      this.closeAllModals();
      this.showToast('Profile picture updated successfully', 'success');
    } catch (error) {
      console.error('Error saving profile picture:', error);
      this.showToast('Failed to update profile picture', 'error');
    }
  }

  async saveCoverPhoto() {
    if (!this.imageState.currentImage) {
      this.showToast('Please select an image first', 'warning');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.userData.coverPhoto = this.imageState.currentImage;
      document.querySelector('.cover-photo').style.backgroundImage = `url('${this.imageState.currentImage}')`;
      this.closeAllModals();
      this.showToast('Cover photo updated successfully', 'success');
    } catch (error) {
      console.error('Error saving cover photo:', error);
      this.showToast('Failed to update cover photo', 'error');
    }
  }

  /* Profile Editing Methods */
  openIntroModal() {
    document.getElementById('intro-edit-textarea').value = this.userData.bio;
    this.modals.intro.classList.add('active');
  }
  
  openDetailsModal() {
    document.getElementById('edit-location').value = this.userData.location || '';
    document.getElementById('edit-occupation').value = this.userData.occupation || '';
    document.getElementById('edit-interests').value = this.userData.interests?.join(', ') || '';
    document.getElementById('edit-website').value = this.userData.website || '';
    this.modals.details.classList.add('active');
  }
  
  applyFormatting(format) {
    const textarea = document.getElementById('intro-edit-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let newText = '';
    
    const formattingMap = {
      'bold': `**${selectedText}**`,
      'italic': `_${selectedText}_`,
      'link': `[${selectedText}](url)`,
      'list': `- ${selectedText.replace(/\n/g, '\n- ')}`
    };
    
    if (formattingMap[format]) {
      newText = formattingMap[format];
      textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
      textarea.selectionStart = start + newText.length;
      textarea.selectionEnd = start + newText.length;
      textarea.focus();
    }
  }
  
  async saveIntroChanges() {
    const newIntro = document.getElementById('intro-edit-textarea').value;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      this.userData.bio = newIntro;
      document.getElementById('intro-text').textContent = newIntro;
      this.closeAllModals();
      this.showToast('Introduction updated successfully', 'success');
    } catch (error) {
      console.error('Error saving introduction:', error);
      this.showToast('Failed to update introduction', 'error');
    }
  }
  
  verifyBeforeSave(type) {
    this.imageState.pendingSaveType = type;
    this.closeAllModals();
    this.modals.security.classList.add('active');
  }
  
  togglePasswordVisibility() {
    const passwordInput = document.getElementById('verify-password');
    const toggleBtn = document.getElementById('toggle-password');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleBtn.innerHTML = '<iconify-icon icon="fluent:eye-off-24-filled"></iconify-icon>';
    } else {
      passwordInput.type = 'password';
      toggleBtn.innerHTML = '<iconify-icon icon="fluent:eye-24-filled"></iconify-icon>';
    }
  }
  
  async verifyPassword() {
    const password = document.getElementById('verify-password').value;
    
    if (!password) {
      this.showToast('Please enter your password', 'warning');
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (password.length > 0) {
        this.closeAllModals();
        
        if (this.imageState.pendingSaveType === 'details') {
          await this.saveDetailsChanges();
        }
        
        this.showToast('Changes saved successfully', 'success');
      } else {
        this.showToast('Incorrect password', 'error');
      }
      
    } catch (error) {
      console.error('Error verifying password:', error);
      this.showToast('Error verifying password', 'error');
    }
  }
  
  async saveDetailsChanges() {
    const newLocation = document.getElementById('edit-location').value;
    const newOccupation = document.getElementById('edit-occupation').value;
    const newInterests = document.getElementById('edit-interests').value;
    const newWebsite = document.getElementById('edit-website').value;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      this.userData.location = newLocation;
      this.userData.occupation = newOccupation;
      this.userData.interests = newInterests.split(',').map(item => item.trim());
      this.userData.website = newWebsite;
      
      document.getElementById('user-location').textContent = newLocation;
      document.getElementById('user-occupation').textContent = newOccupation;
      document.getElementById('user-interests').textContent = newInterests;
      
      this.closeAllModals();
      
    } catch (error) {
      console.error('Error saving details:', error);
      this.showToast('Failed to update details', 'error');
    }
  }

  /* Section Content Loading */
  loadLearningContent() {
    const learningContent = document.querySelector('.learning-content');
    if (learningContent.innerHTML.trim() !== '') return;
    
    const courses = [
      {
        title: "Advanced Hawaiian Culture",
        category: "Cultural Studies",
        progress: 45,
        icon: "fluent:book-globe-24-filled"
      },
      {
        title: "XRPL Development",
        category: "Technology",
        progress: 30,
        icon: "fluent:code-24-filled"
      }
    ];
    
    const completedCourses = [
      {
        title: "Introduction to Hawaiian Language",
        date: "Completed on May 15, 2023",
        icon: "fluent:book-24-filled"
      }
    ];
    
    learningContent.innerHTML = this.renderLearningContent(courses, completedCourses);
    
    document.querySelectorAll('.continue-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const courseTitle = btn.closest('.course-card').querySelector('.course-title').textContent;
        this.showToast(`Continuing "${courseTitle}"`, 'success');
      });
    });
  }

  renderLearningContent(courses, completedCourses) {
    return `
      <div class="learning-header">
        <h2>Your Learning Journey</h2>
        <div class="learning-summary">
          <div class="progress-circle">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <path class="circle-progress" stroke-dasharray="${this.userData.learningStats.progress}, 100" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <text x="18" y="20.5" class="percentage">${this.userData.learningStats.progress}%</text>
            </svg>
          </div>
          <div class="learning-stats">
            <div class="stat-item">
              <iconify-icon icon="fluent:book-24-filled"></iconify-icon>
              <span>${this.userData.learningStats.coursesInProgress} Courses in Progress</span>
            </div>
            <div class="stat-item">
              <iconify-icon icon="fluent:checkmark-24-filled"></iconify-icon>
              <span>${this.userData.learningStats.coursesCompleted} Courses Completed</span>
            </div>
            <div class="stat-item">
              <iconify-icon icon="fluent:clock-24-filled"></iconify-icon>
              <span>${this.userData.learningStats.learningHours} Learning Hours</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="learning-progress">
        <h3>Current Courses</h3>
        <div class="courses-grid">
          ${courses.map(course => this.renderCourseCard(course)).join('')}
        </div>
        
        <h3>Completed Courses</h3>
        <div class="completed-courses">
          ${completedCourses.map(course => this.renderCompletedCourse(course)).join('')}
        </div>
      </div>
    `;
  }

  renderCourseCard(course) {
    return `
      <div class="course-card">
        <div class="course-header">
          <div class="course-icon">
            <iconify-icon icon="${course.icon}"></iconify-icon>
          </div>
          <div>
            <h3 class="course-title">${course.title}</h3>
            <p class="course-category">${course.category}</p>
          </div>
        </div>
        <div class="course-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${course.progress}%"></div>
          </div>
          <div class="progress-text">
            <span>${course.progress}% complete</span>
            <span>${100 - course.progress}% remaining</span>
          </div>
          <button class="continue-btn">Continue Learning</button>
        </div>
      </div>
    `;
  }

  renderCompletedCourse(course) {
    return `
      <div class="completed-course">
        <div class="completed-icon">
          <iconify-icon icon="${course.icon}"></iconify-icon>
        </div>
        <div class="completed-info">
          <h4>${course.title}</h4>
          <p class="completed-date">${course.date}</p>
        </div>
        <iconify-icon icon="fluent:checkmark-24-filled"></iconify-icon>
      </div>
    `;
  }
  
  loadWalletContent() {
    const walletContent = document.querySelector('.wallet-content');
    if (walletContent.innerHTML.trim() !== '') return;
    
    walletContent.innerHTML = this.renderWalletContent();
    
    document.querySelectorAll('.wallet-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.textContent.trim();
        this.showToast(`${action} functionality coming soon`, 'warning');
      });
    });
  }

  renderWalletContent() {
    return `
      <div class="wallet-header">
        <h2>XRPL Wallet</h2>
        <div class="wallet-actions">
          <button class="wallet-btn primary">
            <iconify-icon icon="fluent:send-24-filled"></iconify-icon>
            Send
          </button>
          <button class="wallet-btn">
            <iconify-icon icon="fluent:arrow-down-24-filled"></iconify-icon>
            Receive
          </button>
          <button class="wallet-btn">
            <iconify-icon icon="fluent:history-24-filled"></iconify-icon>
            History
          </button>
        </div>
      </div>
      
      <div class="wallet-balance">
        <div class="balance-card">
          <div class="balance-info">
            <h3>Total Balance</h3>
            <p class="amount">${this.userData.wallet.balance} XRP</p>
            <p class="equivalent">≈ $${this.userData.wallet.balance * 0.5} USD</p>
          </div>
          <iconify-icon icon="fluent:wallet-credit-card-24-filled" class="wallet-icon"></iconify-icon>
        </div>
      </div>
      
      <div class="wallet-assets">
        <h3>Your Assets</h3>
        <div class="assets-list">
          ${this.userData.wallet.assets.map(asset => this.renderAssetItem(asset)).join('')}
        </div>
      </div>
    `;
  }

  renderAssetItem(asset) {
    return `
      <div class="asset-item">
        <div class="asset-info">
          <div class="asset-icon">${asset.name.charAt(0)}</div>
          <div>
            <div class="asset-name">${asset.name}</div>
          </div>
        </div>
        <div class="asset-balance">
          <div class="asset-amount">${asset.amount}</div>
          <div class="asset-value">$${asset.value} USD</div>
        </div>
      </div>
    `;
  }
  
  loadAchievementsContent() {
    const achievementsContent = document.querySelector('.achievements-content');
    if (achievementsContent.innerHTML.trim() !== '') return;
    
    const badges = [
      {
        name: "Fast Learner",
        icon: "fluent:rocket-24-filled",
        earned: true
      }
    ];
    
    const milestones = [
      {
        title: "Completed first course",
        date: "January 5, 2023",
        icon: "fluent:checkmark-24-filled"
      }
    ];
    
    const earnedBadges = badges.filter(badge => badge.earned).length;
    const totalBadges = badges.length;
    const progressPercentage = Math.round((earnedBadges / totalBadges) * 100);
    
    achievementsContent.innerHTML = this.renderAchievementsContent(badges, milestones, earnedBadges, totalBadges, progressPercentage);
  }

  renderAchievementsContent(badges, milestones, earnedBadges, totalBadges, progressPercentage) {
    return `
      <div class="achievements-header">
        <h2>Your Achievements</h2>
        <div class="achievements-summary">
          <div class="badges-earned">
            <iconify-icon icon="fluent:medal-24-filled"></iconify-icon>
            <span>${earnedBadges} of ${totalBadges} Badges Earned</span>
          </div>
          <div class="achievement-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <span>${progressPercentage}% to completion</span>
          </div>
        </div>
      </div>
      
      <div class="achievements-grid">
        <h3>Your Badges</h3>
        <div class="badges-grid">
          ${badges.map(badge => this.renderBadgeItem(badge)).join('')}
        </div>
        
        <h3>Milestones</h3>
        <div class="milestones-list">
          ${milestones.map(milestone => this.renderMilestoneItem(milestone)).join('')}
        </div>
      </div>
    `;
  }

  renderBadgeItem(badge) {
    return `
      <div class="badge-item ${badge.earned ? '' : 'locked'}">
        <div class="badge-icon ${badge.earned ? '' : 'locked'}">
          <iconify-icon icon="${badge.icon}"></iconify-icon>
        </div>
        <div class="badge-name">${badge.name}</div>
        ${badge.earned ? '' : '<div class="badge-lock">Locked</div>'}
      </div>
    `;
  }

  renderMilestoneItem(milestone) {
    return `
      <div class="milestone-item">
        <div class="milestone-icon">
          <iconify-icon icon="${milestone.icon}"></iconify-icon>
        </div>
        <div class="milestone-info">
          <h4>${milestone.title}</h4>
          <p class="milestone-date">${milestone.date}</p>
        </div>
      </div>
    `;
  }
  
  loadCommunityContent() {
    const communityContent = document.querySelector('.community-content');
    if (communityContent.innerHTML.trim() !== '') return;
    
    const groups = [
      {
        name: "Hawaiian Culture Enthusiasts",
        members: "1.2k members",
        bannerColor: "#4CAF50"
      }
    ];
    
    const communityActivity = [
      {
        type: "post",
        content: "Shared a new resource about traditional Hawaiian weaving techniques",
        time: "2 hours ago",
        icon: "fluent:document-24-filled"
      }
    ];
    
    communityContent.innerHTML = this.renderCommunityContent(groups, communityActivity);
  }

  renderCommunityContent(groups, communityActivity) {
    return `
      <div class="community-header">
        <h2>Community Engagement</h2>
        <div class="community-stats">
          <div class="stat-card">
            <iconify-icon icon="fluent:people-community-24-filled"></iconify-icon>
            <span>3 Groups Joined</span>
          </div>
          <div class="stat-card">
            <iconify-icon icon="fluent:chat-24-filled"></iconify-icon>
            <span>42 Discussions</span>
          </div>
        </div>
      </div>
      
      <div class="community-content">
        <div class="community-groups">
          <h3>Your Groups</h3>
          <div class="groups-grid">
            ${groups.map(group => this.renderGroupCard(group)).join('')}
          </div>
        </div>
        
        <div class="community-activity">
          <h3>Recent Activity</h3>
          <div class="activity-feed">
            ${communityActivity.map(activity => this.renderActivityItem(activity)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderGroupCard(group) {
    return `
      <div class="group-card">
        <div class="group-banner" style="background: ${group.bannerColor}"></div>
        <div class="group-info">
          <h4 class="group-name">${group.name}</h4>
          <p class="group-members">${group.members}</p>
        </div>
      </div>
    `;
  }

  renderActivityItem(activity) {
    return `
      <div class="activity-item">
        <iconify-icon icon="${activity.icon}"></iconify-icon>
        <div class="activity-content">
          <p class="activity-text">${activity.content}</p>
          <span class="activity-time">${activity.time}</span>
        </div>
      </div>
    `;
  }

  initDynamicEventListeners() {
    this.delegateEvent('.upload-pic-btn', 'click', (e) => {
      e.preventDefault();
      this.openImageUploadModal('profile');
    });
    
    this.delegateEvent('.edit-profile-btn', 'click', (e) => {
      e.preventDefault();
      this.openImageUploadModal('cover');
    });
  }

  showLoading() {
    this.domElements.loadingScreen.style.display = 'flex';
    this.domElements.loadingScreen.style.opacity = '1';
  }

  hideLoading() {
    this.domElements.loadingScreen.style.opacity = '0';
    setTimeout(() => {
      this.domElements.loadingScreen.style.display = 'none';
    }, 300);
  }

  showToast(message, type = 'info') {
    const toastIcon = this.getToastIcon(type);
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <iconify-icon icon="${toastIcon}"></iconify-icon>
      <div class="toast-message">${message}</div>
      <button class="close-toast">&times;</button>
    `;
    
    this.domElements.toastContainer.appendChild(toast);
    
    const removeToast = () => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    };
    
    setTimeout(removeToast, 5000);
    toast.querySelector('.close-toast').addEventListener('click', removeToast);
  }

  getToastIcon(type) {
    const iconMap = {
      'success': 'fluent:checkmark-circle-24-filled',
      'error': 'fluent:error-circle-24-filled',
      'warning': 'fluent:warning-24-filled',
      'info': 'fluent:info-24-filled'
    };
    return iconMap[type] || iconMap.info;
  }

  closeAllModals() {
    Object.values(this.modals).forEach(modal => modal.classList.remove('active'));
    const passwordInput = document.getElementById('verify-password');
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.type = 'password';
      document.getElementById('toggle-password').innerHTML = '<iconify-icon icon="fluent:eye-24-filled"></iconify-icon>';
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new Profile();
});