/**
 * --------------------------------------------------------------------------
 * Tailstart Kit - Documentation v0.1.0: app.js
 * Licensed under MIT (https://github.com/mkfizi/tailstart-kit-documentation/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


(function () {
    'use strict';

    const app = {};

    app.name = 'Tailstart Kit - Documentation';
    app.version = '0.1.0';
    app.breakpointSize = 1024;

    app.element = {
        navbar: document.getElementById('navbar'),
        navbarMenu: document.getElementById('navbar-menu'),
        navbarMenuOpen: document.getElementById('navbar-menu-open'),
        navbarMenuClose: document.getElementById('navbar-menu-close'),
        sidebarMenu: document.getElementById('sidebar-menu'),
        sidebarMenuOpen: document.getElementById('sidebar-menu-open'),
        sidebarMenuClose: document.getElementById('sidebar-menu-close'),
        darkModeToggle: document.getElementById('dark-mode-toggle'),
        sections: document.querySelectorAll('section'),
        footerCurrentYear: document.getElementById('footer-year'),
        footerAppName: document.getElementById('footer-app-name'),
        footerAppVersion: document.getElementById('footer-app-version'),
    }
    
    app.view = {
        // Workaround fix to handle viewport height issue on mobile browsers
        viewportHeight: {
            // https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser
            toggle: () => {
                document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
            }
        },

        footer: {
            // Toggle footer content with current year, app name and version
            toggle: () => {
                if (app.element.footerCurrentYear) {
                    app.element.footerCurrentYear.innerHTML = new Date().getFullYear();
                }

                if (app.element.footerAppName) {
                    app.element.footerAppName.innerHTML = app.name;
                }
                
                if (app.element.footerAppVersion) {
                    app.element.footerAppVersion.innerHTML = app.version;
                }
            }
        },


        darkMode: {
            // Toggle dark mode
            toggle: () => {
                const isDarkMode = localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches);
                localStorage.theme = isDarkMode ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', isDarkMode);
            }
        },

        menu: {
            // Toggle menu view
            toggle: (isOpen, targetElement) => {
                if (targetElement) {
                    targetElement.classList[isOpen? 'remove' : 'add']('hidden', 'invisible');
                    targetElement.setAttribute('aria-hidden', !isOpen);

                    const id = targetElement.id
                    document.querySelectorAll(`[aria-controls="${id}"]`).forEach(currentToggleElement => {
                        currentToggleElement.setAttribute('aria-expanded', isOpen);
                    });
                }
            },

            // Open menu
            open: targetElement => {
                if (targetElement) {
                    app.view.menu.toggle(true, targetElement);
                    app.view.menu.focusTrap = event => { 
                        app.view.menu.handleFocusTrap(event,targetElement); 
                    }
                    window.addEventListener('keydown', app.view.menu.focusTrap);
                    
                    // Force focus to trigger focus trap
                    targetElement.setAttribute('tabindex', 1);
                    targetElement.focus();
                    setTimeout(() => {
                        targetElement.removeAttribute('tabindex');
                    }, 100);
                }
            },

            // Close menu
            close: targetElement => {
                if (targetElement) {
                    app.view.menu.toggle(false, targetElement);
                    window.removeEventListener('keydown', app.view.menu.focusTrap);
                }
            },

            // Handle focus trap
            handleFocusTrap: (event, targetElement) => {
                const focusableElements = targetElement.querySelectorAll('a:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"]), textarea:not([tabindex="-1"]), select:not([tabindex="-1"]), details:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                if (event.type === "keydown" && event.keyCode === 9) {
                    if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === document.body)) {
                        event.preventDefault();
                        lastElement.focus();

                    } else if (!event.shiftKey && document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        },

        sidebar: {
            menu: {
                // Open sidebar menu
                open: () => {
                    document.addEventListener('click', app.view.sidebar.menu.handleClickOutside);
                },

                // Close sidebar menu
                close: () => {
                    document.addEventListener('click',  app.view.sidebar.menu.handleClickOutside);
                },

                // Toggle sidebar menu link
                toggleLink: () => {
                    const scrollPosition = window.scrollY;
                    app.element.sections.forEach((targetSection) => {
                        const sectionTop = targetSection.offsetTop - app.element.navbar.offsetHeight - parseFloat(getComputedStyle(targetSection).marginTop);
                        const sectionHeight = targetSection.offsetHeight + parseFloat(getComputedStyle(targetSection).marginTop);
                        const targetLink = document.querySelector(`a[href="#${targetSection.id}"]`);
                        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                            app.view.sidebar.menu.toggleActiveLink(true, targetLink);
                        } else {
                            app.view.sidebar.menu.toggleActiveLink(false, targetLink);
                        }
                    });
                },

                // Toggle active sidebar menu link
                toggleActiveLink: (isActive, targetLink)=> {
                    if (targetLink) {
                        targetLink.classList[isActive ? 'add' : 'remove']('text-black', 'dark:text-white');
                        targetLink.classList[isActive ? 'remove' : 'add']('text-neutral-600', 'dark:text-neutral-400');
                    }
                },


                // Handle click outside
                handleClickOutside: event => {
                    if (app.element.sidebarMenu) {
                        if (!event.target.closest(`[aria-labelledby="${app.element.sidebarMenu.id}"]`) && !event.target.closest(`[aria-controls="${app.element.sidebarMenu.id}"]`)) {
                            app.view.menu.close(app.element.sidebarMenu);
                            app.view.sidebar.menu.close();
                        }
                    }
                },
            }
        },

        // Initialize view
        init: () => {
            app.view.viewportHeight.toggle();
            app.view.footer.toggle();
            app.view.sidebar.menu.toggleLink();
        }
    }

    app.event = {
        document: {
            // Handle document 'click event
            click: event => {
                const targetElement = event.target.closest('[id]');
                if (targetElement) {
                    switch (targetElement.id) {
                        case app.element.darkModeToggle.id:
                            app.view.darkMode.toggle();
                            break;
                        case app.element.navbarMenuOpen.id:
                            app.view.menu.open(app.element.navbarMenu);
                            break;
                        case app.element.navbarMenuClose.id:
                            app.view.menu.close(app.element.navbarMenu);
                            break;
                        case app.element.sidebarMenuOpen.id:
                            app.view.menu.open(app.element.sidebarMenu);
                            app.view.sidebar.menu.open();
                            break;
                        case app.element.sidebarMenuClose.id:
                            app.view.menu.close(app.element.sidebarMenu);
                            app.view.sidebar.menu.close();
                            break;
                    }
                }
            }
        },

        window: {
            // Handle window 'resize' event
            resize: () => {
                app.view.viewportHeight.toggle();

                // Close menu if window size is more than breakpoint size
                if (window.innerWidth >= app.breakpointSize) {
                    if (app.element.navbarMenu && app.element.navbarMenu.getAttribute('aria-hidden') === 'false') {
                        app.view.menu.close(app.element.navbarMenu);
                    }
                    if (app.element.sidebarMenu && app.element.sidebarMenu.getAttribute('aria-hidden') === 'false') {
                        app.view.menu.close(app.element.sidebarMenu);
                    }
                }
            },

            // Handle window 'scroll' event
            scroll: () => {
                app.view.sidebar.menu.toggleLink();
            }
        },

        init: () => {
            document.addEventListener('click', app.event.document.click);
            window.addEventListener('resize', app.event.window.resize);
            window.addEventListener('scroll', app.event.window.scroll);
        }
    },

    app.init = () => {
        app.view.init();
        app.event.init();
    }

    app.init();
})();