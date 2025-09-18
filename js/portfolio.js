// Portfolio Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Portfolio Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter portfolio items
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.classList.remove('hidden');
                        // Add animation
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                            item.classList.add('hidden');
                        }, 300);
                    }
                });

                // Track filter usage
                if (typeof trackEvent === 'function') {
                    trackEvent('portfolio_filter_used', {
                        filter: filter,
                        page: 'portfolio'
                    });
                }
            });
        });
    }

    // Case study animations on scroll
    const caseStudies = document.querySelectorAll('.case-study');
    const portfolioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Initially hide and observe case studies
    caseStudies.forEach(caseStudy => {
        caseStudy.style.opacity = '0';
        caseStudy.style.transform = 'translateY(30px)';
        caseStudy.style.transition = 'all 0.6s ease';
        portfolioObserver.observe(caseStudy);
    });

    // Portfolio item hover effects with cursor tracking
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        
        if (overlay) {
            item.addEventListener('mouseenter', function() {
                this.style.cursor = 'pointer';
            });

            item.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * 5;
                const rotateY = (centerX - x) / centerX * 5;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            item.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });

            // Click to view details (placeholder for future modal)
            item.addEventListener('click', function() {
                const projectTitle = this.querySelector('.portfolio-info h4').textContent;
                console.log(`Portfolio item clicked: ${projectTitle}`);
                
                // Track portfolio item clicks
                if (typeof trackEvent === 'function') {
                    trackEvent('portfolio_item_clicked', {
                        project: projectTitle,
                        category: this.getAttribute('data-category')
                    });
                }
                
                // Future: Open modal with project details
                // showProjectModal(projectTitle);
            });
        }
    });

    // Counter animation for client results
    function animatePortfolioCounters() {
        const resultNumbers = document.querySelectorAll('.result-stat .stat-number');
        
        resultNumbers.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const suffix = counter.textContent.replace(/[\d]/g, '');
            let current = 0;
            const increment = target / 100;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, 30);
        });
    }

    // Observe client results section for counter animation
    const clientResultsSection = document.querySelector('.client-results');
    if (clientResultsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animatePortfolioCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(clientResultsSection);
    }

    // Smooth scroll for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                const portfolioGrid = document.querySelector('.portfolio-grid');
                if (portfolioGrid) {
                    portfolioGrid.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        });
    });

    // Industry items hover animation
    const industryItems = document.querySelectorAll('.industry-item');
    industryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Case study expandable content (future enhancement)
    const caseStudyTexts = document.querySelectorAll('.case-study-text');
    caseStudyTexts.forEach(caseText => {
        const description = caseText.querySelector('.case-description');
        if (description && description.textContent.length > 200) {
            // Future: Add "Read More" functionality for long case studies
        }
    });

    // Portfolio item lazy loading
    if ('IntersectionObserver' in window) {
        const portfolioImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        portfolioImageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('.portfolio-img[data-src]').forEach(img => {
            portfolioImageObserver.observe(img);
        });
    }

    // Keyboard navigation for portfolio filter
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.target.click();
            }
        }
    });

    // Performance tracking
    const performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            if (entry.entryType === 'navigation') {
                console.log('Portfolio page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
            }
        });
    });

    if ('PerformanceObserver' in window) {
        performanceObserver.observe({ entryTypes: ['navigation'] });
    }

    console.log('Portfolio page initialized successfully!');
});

// Utility functions for portfolio
const PortfolioUtils = {
    // Show project modal (future feature)
    showProjectModal: function(projectData) {
        console.log('Opening project modal:', projectData);
        // Future implementation for detailed project view
    },

    // Filter portfolio by multiple categories
    filterByMultiple: function(categories) {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (categories.includes(category)) {
                item.style.display = 'block';
                item.classList.remove('hidden');
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });
    },

    // Get visible portfolio items count
    getVisibleItemsCount: function() {
        const visibleItems = document.querySelectorAll('.portfolio-item:not(.hidden)');
        return visibleItems.length;
    },

    // Reset all filters
    resetFilters: function() {
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            allButton.click();
        }
    }
};

// Export for use in other scripts
window.PortfolioUtils = PortfolioUtils;