document.addEventListener('DOMContentLoaded', () => {
    // Detectar se é dispositivo móvel
    const isMobile = window.innerWidth <= 768;
    
    // Efeito de hover nos pilares (apenas desktop)
    if (!isMobile) {
        const pillarSections = document.querySelectorAll('.pillar');
        
        pillarSections.forEach(section => {
            section.addEventListener('mouseover', () => {
                section.style.boxShadow = `0 12px 30px rgba(39, 98, 141, 0.15)`;
                section.style.transition = 'box-shadow 0.4s ease, transform 0.4s';
                section.style.transform = 'translateY(-8px)';
            });

            section.addEventListener('mouseout', () => {
                section.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                section.style.transform = 'translateY(0)';
            });
        });
        
        // Efeito nos cards de métrica (apenas desktop)
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            card.addEventListener('mouseover', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('mouseout', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            });
        });
    }
    
    // Botão "Voltar ao Topo"
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Efeito de digitação no subtítulo (apenas desktop)
    if (!isMobile) {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            const originalText = subtitle.textContent;
            subtitle.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    subtitle.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }
    
    // Animação para as estatísticas do hero
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target, suffix = '') => {
        if (typeof target === 'number') {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
            }, 30);
        }
    };
    
    // Observer para animar estatísticas quando visíveis
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('%')) {
                        const value = parseInt(text);
                        if (!isNaN(value)) {
                            animateCounter(stat, value, '%');
                        }
                    } else if (!isNaN(parseInt(text))) {
                        const value = parseInt(text);
                        animateCounter(stat, value);
                    }
                });
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        statsObserver.observe(heroSection);
    }
    
    // Adiciona highlight ao código nos exemplos (funcionalidade desktop)
    if (!isMobile) {
        const codeElements = document.querySelectorAll('code');
        codeElements.forEach(code => {
            // Adiciona tooltip para fórmulas
            if (code.textContent.includes('=')) {
                code.setAttribute('title', 'Fórmula técnica');
                code.style.cursor = 'help';
            }
        });
    }
    
    // Adiciona navegação suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset ajustado para mobile
                const offset = isMobile ? 20 : 80;
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ROI Calculator
    const calculateROIButton = document.getElementById('calculateROI');
    
    if (calculateROIButton) {
        // Calcular ROI inicial
        setTimeout(() => calculateROI(), 1000);
        
        calculateROIButton.addEventListener('click', function() {
            calculateROI();
        });
        
        // Calcular ROI automaticamente ao mudar valores
        document.querySelectorAll('.roi-input input').forEach(input => {
            input.addEventListener('input', function() {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => calculateROI(), 500);
            });
        });
    }
    
    function calculateROI() {
        const obraValue = parseFloat(document.getElementById('obraValue').value) || 1000000;
        const collaborators = parseInt(document.getElementById('collaborators').value) || 10;
        const currentHours = parseInt(document.getElementById('currentHours').value) || 20;
        
        // Cálculos baseados em dados empíricos
        const hoursSaved = currentHours * 0.4; // 40% de economia
        const monthlyHoursSaved = hoursSaved * 4.33; // Semanas no mês
        const costReduction = 12.5; // Redução média de 12.5% nos desvios
        const annualCostReduction = (obraValue * costReduction) / 100;
        
        const implementationHours = 40; // Horas totais de implementação
        const roiRatio = (monthlyHoursSaved * 12) / implementationHours;
        
        const paybackWeeks = Math.round(implementationHours / (monthlyHoursSaved / 4.33));
        
        // Atualizar UI
        document.getElementById('timeSaved').textContent = Math.round(monthlyHoursSaved);
        document.getElementById('costReduction').textContent = costReduction + '%';
        document.getElementById('roiValue').textContent = roiRatio.toFixed(1) + ':1';
        document.getElementById('monthlySavings').textContent = Math.round(monthlyHoursSaved);
        document.getElementById('payback').textContent = paybackWeeks;
        document.getElementById('annualSavings').textContent = Math.round(annualCostReduction).toLocaleString('pt-BR');
        
        // Adicionar efeito visual aos resultados
        const roiValues = document.querySelectorAll('.roi-value');
        roiValues.forEach(value => {
            value.style.transition = 'color 0.5s ease, transform 0.3s ease';
            value.style.color = 'var(--success-color)';
            value.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                value.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    // Adiciona data de atualização automática
    const updateDate = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    const dateElement = document.createElement('div');
    dateElement.className = 'update-date';
    dateElement.style.textAlign = 'center';
    dateElement.style.marginTop = '20px';
    dateElement.style.padding = '15px';
    dateElement.style.fontSize = '0.85rem';
    dateElement.style.color = 'var(--text-lighter)';
    dateElement.style.borderTop = '1px solid var(--border-color)';
    dateElement.innerHTML = `<i class="fas fa-sync-alt"></i> Guia atualizado em: ${updateDate}`;
    
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.appendChild(dateElement);
    }
    
    // Interatividade para checklists
    const checklistItems = document.querySelectorAll('.checklist input[type="checkbox"]');
    checklistItems.forEach(item => {
        item.addEventListener('change', function() {
            const listItem = this.closest('li');
            if (this.checked) {
                listItem.style.textDecoration = 'line-through';
                listItem.style.opacity = '0.7';
                listItem.style.transition = 'all 0.3s ease';
            } else {
                listItem.style.textDecoration = 'none';
                listItem.style.opacity = '1';
            }
        });
    });
    
    // Efeito de scroll suave para timeline
    const timelinePhases = document.querySelectorAll('.timeline-phase');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }
        });
    }, { threshold: 0.3 });
    
    timelinePhases.forEach(phase => {
        phase.style.opacity = '0';
        phase.style.transform = 'translateX(-20px)';
        timelineObserver.observe(phase);
    });
    
    // Otimização para touch em dispositivos móveis
    if (isMobile) {
        // Aumenta a área de toque para botões
        document.querySelectorAll('.whatsapp-link, .site-link, .roi-button').forEach(button => {
            button.style.padding = '12px 20px';
            button.style.minHeight = '44px';
        });
        
        // Remove transições complexas para performance
        document.querySelectorAll('.metric-card, .result-card, .practice').forEach(element => {
            element.style.transition = 'none';
        });
        
        // Previne zoom em inputs
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.style.fontSize = '16px';
            }
        }, { passive: true });
    }
    
    // Efeito de destaque nas seções quando visíveis
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Adiciona estilos CSS dinamicamente para animações
    const style = document.createElement('style');
    style.textContent = `
        .section-visible {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .update-date {
            animation: fadeIn 1s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Controle do header em scroll (apenas desktop)
    if (!isMobile) {
        let lastScroll = 0;
        const header = document.querySelector('header');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scroll para baixo
                header.style.transform = 'translateY(-100%)';
                header.style.transition = 'transform 0.3s ease';
            } else {
                // Scroll para cima
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
});