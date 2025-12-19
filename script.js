// Enhanced Portfolio Interactions - Shivam Agrahari
// PRODIGY_WD_04 - Modern UI/UX with Theme Toggle

(() => {
  // ============================================
  // Element Selectors
  // ============================================
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.nav');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const downloadResume = document.getElementById('downloadResume');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // ============================================
  // Theme Toggle Functionality
  // ============================================
  
  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }

  // Theme toggle event
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    
    // Add rotation animation
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 300);
  });

  // ============================================
  // Mobile Navigation
  // ============================================
  
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
    nav.classList.toggle('show');
    
    // Prevent body scroll when menu is open
    if (!expanded) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  });

  // Close mobile nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('show');
      nav.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('show') && 
        !nav.contains(e.target) && 
        !navToggle.contains(e.target)) {
      navList.classList.remove('show');
      nav.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }
  });

  // ============================================
  // Header Scroll Effect
  // ============================================
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    // Add scrolled class for backdrop blur effect
    if (currentScroll > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  // ============================================
  // Smooth Scrolling for Hash Links
  // ============================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (!target) return;
      
      e.preventDefault();
      
      // Calculate offset for fixed header
      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without jumping
      history.pushState(null, null, targetId);
    });
  });

  // ============================================
  // Contact Form Handling
  // ============================================
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const form = new FormData(contactForm);
    const name = form.get('name') || 'there';
    
    // Show success message
    formStatus.textContent = `Thanks ${name}! Your message has been received. I'll get back to you soon.`;
    formStatus.style.display = 'block';
    
    // Reset form
    contactForm.reset();
    
    // Hide status message after 5 seconds
    setTimeout(() => {
      formStatus.style.display = 'none';
      formStatus.textContent = '';
    }, 5000);
  });

  // ============================================
  // Download Resume
  // ============================================
  
  downloadResume.addEventListener('click', () => {
    const resumeUrl = 'assets/resume.pdf';
    
    // Try to download; if not available, show message
    fetch(resumeUrl, { method: 'HEAD' })
      .then(resp => {
        if (resp.ok) {
          window.open(resumeUrl, '_blank');
        } else {
          showNotification('Resume not found. Please upload assets/resume.pdf to enable download.');
        }
      })
      .catch(() => {
        showNotification('Resume not found. Please upload assets/resume.pdf to enable download.');
      });
  });

  // ============================================
  // Intersection Observer for Scroll Animations
  // ============================================
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  const elementsToAnimate = document.querySelectorAll('.section, .project-card, .skill-card, .info-card');
  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });

  // ============================================
  // Active Navigation Link Highlighting
  // ============================================
  
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const scrollPosition = window.scrollY + 100;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ============================================
  // Utility Functions
  // ============================================
  
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: rgba(99, 102, 241, 0.9);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(255, 255, 255, 1);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // ============================================
  // Scroll to Top Button
  // ============================================
  
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffffffff, #0080ffff);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 16px rgba(255, 255, 255, 1);
    transition: all 0.3s ease;
    z-index: 99;
  `;

  document.body.appendChild(scrollToTopBtn);

  // Show/hide scroll to top button 6366f1 8b5cf6 99, 102, 241, 0.3
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.style.display = 'flex';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  }, { passive: true });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'translateY(-5px)';
    scrollToTopBtn.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.4)';
  });

  scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'translateY(0)';
    scrollToTopBtn.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.3)';
  });

  // ============================================
  // Typing Animation for Hero Subtitle
  // ============================================
  
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    let index = 0;
    
    function type() {
      if (index < text.length) {
        heroSubtitle.textContent += text.charAt(index);
        index++;
        setTimeout(type, 50);
      }
    }
    
    // Start typing after a short delay
    setTimeout(type, 800);
  }

  // ============================================
  // Initialize
  // ============================================
  
  console.log('%c🚀 Portfolio Loaded Successfully!', 'color: #6366f1; font-size: 16px; font-weight: bold;');
  console.log('%cMade with ❤️ by Shivam Agrahari', 'color: #8b5cf6; font-size: 12px;');
  
})();
