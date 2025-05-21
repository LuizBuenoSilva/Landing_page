// JavaScript para a landing page RevitaLocks

document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fechar todos os itens
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Abrir o item clicado (se não estava ativo)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Testimonial slider
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            if (i === index) {
                testimonial.style.display = 'flex';
            } else {
                testimonial.style.display = 'none';
            }
        });
    }
    
    // Inicializar o slider
    if (testimonials.length > 0) {
        showTestimonial(currentIndex);
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentIndex);
            });
            
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            });
        }
    }
    
    // Formulário de leads
    const leadForm = document.getElementById('lead-form');
    const successPopup = document.getElementById('success-popup');
    
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
            
            // Simular envio para API (aqui seria integrado com N8N)
            console.log('Dados do lead:', formData);
            
            // Mostrar popup de sucesso
            if (successPopup) {
                successPopup.classList.add('active');
                
                // Limpar formulário
                leadForm.reset();
            }
        });
    }
    
    // Fechar popup
    const popupClose = document.querySelector('.popup-close');
    const popupButton = document.querySelector('.popup .btn-primary');
    
    if (popupClose && successPopup) {
        popupClose.addEventListener('click', () => {
            successPopup.classList.remove('active');
        });
    }
    
    if (popupButton && successPopup) {
        popupButton.addEventListener('click', () => {
            successPopup.classList.remove('active');
        });
    }
    
    // Efeito de scroll suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Efeito de header fixo com mudança de estilo ao scroll
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
