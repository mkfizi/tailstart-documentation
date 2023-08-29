/**
 * --------------------------------------------------------------------------
 * Tailstart - Documentation Starter Kit v0.3.0: app.js
 * Licensed under MIT (https://github.com/tailstart/starterkit-documentation/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


(function () {
    'use strict';

    const app = {};

    app.name = 'Tailstart - Documentation Starter Kit';
    app.version = '0.3.0';
    app.breakpointSize = 1024;

    app.element = {
        navbar: document.getElementById('navbar'),
        navbarMenu: document.getElementById('navbar-menu'),
        navbarMenuToggle: document.getElementById('navbar-menu-toggle'),
        navbarMenuClose: document.getElementById('navbar-menu-close'),
        sidebarMenu: document.getElementById('sidebar-menu'),
        sidebarMenuToggle: document.getElementById('sidebar-menu-toggle'),
        sidebarMenuClose: document.getElementById('sidebar-menu-close'),
        pageMenu: document.getElementById('page-menu'),
        pageMenuToggle: document.getElementById('page-menu-toggle'),
        darkModeToggle: document.getElementById('dark-mode-toggle'),
        sections: document.querySelectorAll('section'),
        footerCurrentYear: document.getElementById('footer-year'),
        footerAppName: document.getElementById('footer-app-name'),
        footerAppVersion: document.getElementById('footer-app-version'),
    }

    app.view = {
        viewportHeight: {
            // Workaround fix to handle viewport height issue on mobile browsers
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
            // Toggle menu
            toggle: (targetElement, isOpen = null) => {
                if (isOpen == null) isOpen = (targetElement.getAttribute('aria-hidden') === 'true');
                targetElement.classList[isOpen ? 'remove' : 'add']('hidden', 'invisible');
                targetElement.setAttribute('aria-hidden', !isOpen);

                // Set toggle element `[aria-expanded]` attribute value
                document.querySelectorAll(`[aria-controls="${targetElement.id}"]`).forEach(currentToggleElement => {
                    currentToggleElement.setAttribute('aria-expanded', isOpen);
                });

                // Execute event handlers
                if (isOpen) {
                    // Force focus for focus trap
                    targetElement.setAttribute('tabindex', 1);
                    targetElement.focus();
                    setTimeout(() => {
                        targetElement.removeAttribute('tabindex');
                    }, 100);

                    if (!app.view.menu[targetElement.id]) {
                        app.view.menu[targetElement.id] = {
                            clickOutside: (event) => app.view.menu.clickOutsideHandler(targetElement, event),
                            escape: (event) => app.view.menu.escapeHandler(targetElement, event),
                            focusTrap: (event) => app.view.menu.focusTrapHandler(targetElement, event),
                        };
                        document.addEventListener('click', app.view.menu[targetElement.id].clickOutside);
                        window.addEventListener('keydown', app.view.menu[targetElement.id].escape);
                        window.addEventListener('keydown', app.view.menu[targetElement.id].focusTrap);
                    }
                } else if (app.view.menu[targetElement.id]) {
                    document.removeEventListener('click', app.view.menu[targetElement.id].clickOutside);
                    window.removeEventListener('keydown', app.view.menu[targetElement.id].escape);
                    window.removeEventListener('keydown', app.view.menu[targetElement.id].focusTrap);
                    delete app.view.menu[targetElement.id];
                }
            },

            // Click outside offcanvas handler
            clickOutsideHandler: (targetElement, event) => {
                if (!event.target.closest(`[aria-labelledby="${targetElement.id}"]`) && !event.target.closest(`[aria-controls="${targetElement.id}"]`)) {
                    app.view.menu.toggle(targetElement, false);
                }
            },

            // Escape key handler
            escapeHandler: (targetElement, event) => {
                if (event.key === 'Escape') {
                    app.view.menu.toggle(targetElement, false);
                }
            },

            // Focus trap handler
            focusTrapHandler: (targetElement, event) => {
                if (event.key === 'Tab') {
                    const focusableElements = Array.from(targetElement.querySelectorAll('a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]')).filter(currentElement => {
                        return !currentElement.closest('[tabindex="-1"], .hidden, .invisible') || null;
                    });
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

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

        page: {
            menu: {
                // Toggle active on this page menu link
                toggleActiveLink: () => {
                    const scrollPosition = window.scrollY;
                    app.element.sections.forEach((targetSection) => {
                        const sectionTop = targetSection.offsetTop - app.element.navbar.offsetHeight - parseFloat(getComputedStyle(targetSection).marginTop);
                        const sectionHeight = targetSection.offsetHeight + parseFloat(getComputedStyle(targetSection).marginTop);

                        let isActive = false;
                        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                            isActive = true;
                        }

                        const targetLink = document.querySelector(`a[href="#${targetSection.id}"]`);
                        if (targetLink) {
                            targetLink.classList[isActive ? 'add' : 'remove']('text-black', 'dark:text-white');
                            targetLink.classList[isActive ? 'remove' : 'add']('text-neutral-600', 'dark:text-neutral-400');
                            if (!targetLink.classList.contains('font-semibold')) {
                                targetLink.classList[isActive ? 'add' : 'remove']('font-medium');
                            }
                        }
                    });
                },
            }
        },

        // Initialize view
        init: () => {
            app.view.viewportHeight.toggle();
            app.view.footer.toggle();
            app.view.page.menu.toggleActiveLink();
        }
    }

    app.event = {
        document: {
            // Handle document 'click event
            click: event => {
                const targetElement = event.target.closest('[id]');
                if (targetElement) {
                    switch (targetElement.id) {
                        case app.element.darkModeToggle?.id:
                            app.view.darkMode.toggle();
                            break;
                        case app.element.navbarMenuToggle?.id:
                            app.view.menu.toggle(app.element.navbarMenu);
                            break;
                        case app.element.navbarMenuClose?.id:
                            app.view.menu.toggle(app.element.navbarMenu, false);
                            break;
                        case app.element.sidebarMenuToggle?.id:
                            app.view.menu.toggle(app.element.sidebarMenu);
                            break;
                        case app.element.sidebarMenuClose?.id:
                            app.view.menu.toggle(app.element.sidebarMenu, false);
                            break;
                        case app.element.pageMenuToggle?.id:
                            app.view.menu.toggle(app.element.pageMenu);
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
                        app.view.menu.toggle(app.element.navbarMenu, false);
                    }
                    if (app.element.sidebarMenu && app.element.sidebarMenu.getAttribute('aria-hidden') === 'false') {
                        app.view.menu.toggle(app.element.sidebarMenu, false);
                    }
                    if (app.element.pageMenu && app.element.pageMenu.getAttribute('aria-hidden') === 'false') {
                        app.view.menu.toggle(app.element.pageMenu, false);
                    }
                }
            },

            // Handle window 'scroll' event
            scroll: () => {
                app.view.page.menu.toggleActiveLink();
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