document.addEventListener('DOMContentLoaded', () => {

    // слайдер 3d

    function slider(slider_, card, prev_, next_, cardActive, radius) {
        const slider = document.querySelector(slider_),
              cards = document.querySelectorAll(card),
              prev = document.querySelector(prev_),
              next = document.querySelector(next_);
        
        let angleRad,
            x,
            z,
            angle = 360/cards.length,
            angleSumm = 0
            counter=0;
    
        function leftOrRightCard(cardClick) {
        
            const center = document.documentElement.clientWidth / 2,
                  coord = (cardClick.getBoundingClientRect().left + (cardClick.getBoundingClientRect().width / 2));
            
            let leftOrRight;
                
            if ((coord - center) < 0) {
                leftOrRight = 'left';
            } else {
                leftOrRight = 'right';
            }
            return leftOrRight;
        }
    
        function prevSlide() {
            counter--;
            if(counter < 0) {
                counter = cards.length - 1;
            }
            angleSumm+=angle;
            slider.style.transform = `rotateY(${angleSumm}deg)`;
            cards.forEach(card => {
                card.classList.remove(cardActive);
            });
            cards.forEach((card, index)=> {
                if (counter == index) {
                    card.classList.add(cardActive);
                }
                card.style.transform = `${card.style.transform.replace(/rotate[^]*/, '')} rotateY(${-angleSumm}deg)`;
            });
        }
    
        function nextSlide() {
            counter++;
            if (counter > cards.length - 1) {
                counter = 0;
            }
            angleSumm-=angle;
            slider.style.transform = `rotateY(${angleSumm}deg)`;
            cards.forEach(card => {
                card.classList.remove(cardActive);
            });
            cards.forEach((card, index) => {
                if (counter == index) {
                    card.classList.add(cardActive);
                }
                card.style.transform = `${card.style.transform.replace(/rotate[^]*/, '')} rotateY(${-angleSumm}deg)`;
            });
        }
    
        cards.forEach((item, index) => {
        
            angleRad  = ((2 * Math.PI) / cards.length ) * index;
            item.style.zIndex = `${+cards.length - index}`;
            if (angleRad > Math.PI) {
                item.style.zIndex = `${index}`;
            }
        
            if (angleRad <= Math.PI/2) {
            
                x = Math.sin(angleRad) * radius;
                z = radius - Math.cos(angleRad) * radius;
                item.style.transform = `translateX(${x}px) translateZ(-${z}px)`;
            
            } else if (angleRad >  Math.PI/2 && angleRad <=  Math.PI) {
            
                x = Math.sin(Math.PI - angleRad) * radius;
                z = radius + Math.cos(Math.PI - angleRad) * radius;
                item.style.transform = `translateX(${x}px) translateZ(-${z}px)`;
                
            } else if (angleRad >  Math.PI && angleRad <= 1.5 * Math.PI) {
            
                x = Math.sin(angleRad - Math.PI) * radius;
                z = radius + Math.cos(angleRad - Math.PI) * radius;
                item.style.transform = `translateX(-${x}px) translateZ(-${z}px)`;
            
            } else {
            
                x = Math.sin(2 * Math.PI - angleRad) * radius;
                z = radius - Math.cos(2 * Math.PI - angleRad) * radius;
                item.style.transform = `translateX(-${x}px) translateZ(-${z}px)`;
            
            }
            
            item.addEventListener('click', () => {
                if (item.classList.contains(cardActive)) {
                    return;
                } else if (leftOrRightCard(item) == 'left') {
                    prevSlide();
                } else if (leftOrRightCard(item) == 'right') {
                    nextSlide();
                }
            });
        });
    
        prev.addEventListener('click', (e) => {
            prevSlide();
        });
        
        next.addEventListener('click', (e) => {
            nextSlide();
        });
    }

    slider('.cases__slider', '.cases__slider__card', '.cases__button--prev', '.cases__button--next', 'cases__slider__card--active', 240);

    // Слайдер линейный

    function sliderLine(window, field, cards, cardWidth, margin, dotsWrap, dotClass, dotClassActive, arrowPrev, arrowNext, arrowClass) {
        const window_ = document.querySelector(window),
              field_ = document.querySelector(field),
              cards_ = document.querySelectorAll(cards),
              arrowPrev_ = document.querySelector(arrowPrev),
              arrowNext_ = document.querySelector(arrowNext);

        let startPoint,
            swipeAction,
            endPoint,
            sliderCounter = 0,
            dots_ = [];

        // Устанавливаем фиксированную ширину поля слайдов

        field_.style.width = `${cardWidth * cards_.length + (margin * (cards_.length - 1))}px`;
        field_.style.marginLeft = 'auto';
        field_.style.marginRight = 'auto';

        // Слайд следующий

        function slideNext() {
            sliderCounter++;
            arrowNext_.classList.remove(arrowClass);
            arrowPrev_.classList.remove(arrowClass);
            if (sliderCounter >= cards_.length) {
                sliderCounter = cards_.length - 1;
            }
            if ((sliderCounter + 1) == cards_.length) {
                arrowNext_.classList.add(arrowClass);
            }
            if (dotsWrap) {
                dots_.forEach((item, index)=> {
                    item.classList.remove(dotClassActive);
                    if (index == sliderCounter) {
                        item.classList.add(dotClassActive);
                    }
                });
            }
            field_.style.transform = `translateX(-${(cardWidth + margin) * sliderCounter}px)`;
        }

        // Слайд предыдущий

        function slidePrev() {
            sliderCounter--;
            arrowNext_.classList.remove(arrowClass);
            arrowPrev_.classList.remove(arrowClass);
            if (sliderCounter <= 0) {
                sliderCounter = 0;
            }
            if (sliderCounter == 0) {
                arrowPrev_.classList.add(arrowClass);
            }
            if (dotsWrap) {
                dots_.forEach((item, index)=> {
                    item.classList.remove(dotClassActive);
                    if (index == sliderCounter) {
                        item.classList.add(dotClassActive);
                    }
                });
            }
            field_.style.transform = `translateX(-${(cardWidth + margin) * sliderCounter}px)`;
        }

        // Рендер точек

        if (dotsWrap) {
            const dotsWrap_ = document.querySelector(dotsWrap);

            cards_.forEach(() => {
                const dot = document.createElement('div');
                dot.classList.add(dotClass);
                dotsWrap_.appendChild(dot);
                dots_.push(dot);
            });
            dots_[0].classList.add(dotClassActive);
            dots_.forEach((item, index) => {
                item.addEventListener('click', () => {
                    sliderCounter = index;
                    arrowNext_.classList.remove(arrowClass);
                    arrowPrev_.classList.remove(arrowClass);
                    if (sliderCounter == 0) {
                        arrowPrev_.classList.add(arrowClass);
                    }
                    if ((sliderCounter + 1) == cards_.length) {
                        arrowNext_.classList.add(arrowClass);
                    }
                    dots_.forEach(item_ => {
                        item_.classList.remove(dotClassActive);
                    });
                    item.classList.add(dotClassActive);
                    field_.style.transform = `translateX(-${(cardWidth + margin) * sliderCounter}px)`;
                });
            });
        }

        // Переключение на стрелки

        arrowPrev_.addEventListener('click', () => {
            slidePrev();
        });

        arrowNext_.addEventListener('click', () => {
            slideNext();
        });

        // Свайп слайдов тач-событиями

        window_.addEventListener('touchstart', (e) => {
            startPoint = e.changedTouches[0].pageX;
        });

        window_.addEventListener('touchmove', (e) => {
            swipeAction = e.changedTouches[0].pageX - startPoint;
            field_.style.transform = `translateX(${swipeAction + (-(cardWidth + margin) * sliderCounter)}px)`;
        });

        window_.addEventListener('touchend', (e) => {
            endPoint = e.changedTouches[0].pageX;
            if (Math.abs(startPoint - endPoint) > 50) {
                arrowNext_.classList.remove(arrowClass);
                arrowPrev_.classList.remove(arrowClass);
                if (endPoint < startPoint) {
                    slideNext();
                } else {
                    slidePrev();
                }
            } else {
                field_.style.transform = `translateX(-${(cardWidth + margin) * sliderCounter}px)`;
            }
        });

        // Свайп слайдов маус-событиями

        function mouseMove(e) {
            swipeAction = e.pageX - startPoint;
            field_.style.transform = `translateX(${swipeAction + (-(cardWidth + margin) * sliderCounter)}px)`;
        }

        window_.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startPoint = e.pageX;
            window_.addEventListener('mousemove', mouseMove);
        });

        window_.addEventListener('mouseup', (e) => {
            window_.removeEventListener('mousemove', mouseMove);
            endPoint = e.pageX;
            if (Math.abs(startPoint - endPoint) > 50) {
                arrowNext_.classList.remove(arrowClass);
                arrowPrev_.classList.remove(arrowClass);
                if (endPoint < startPoint) {
                    slideNext();
                } else {
                    slidePrev();
                }
            } else {
                field_.style.transform = `translateX(-${(cardWidth + margin) * sliderCounter}px)`;
            }
        });

    }

    sliderLine(
        '.cases__window--center', 
         '.cases__field--center', 
         '.cases__field__card--center', 
         500,
         25, 
         false, 
         false, 
         false, 
         '.cases__button--prev--center', 
         '.cases__button--next--center', 
         'cases__button--small--inactive'
    );

    sliderLine(
        '.cases__window--mobile', 
         '.cases__field--mobile', 
         '.cases__field__card--mobile', 
         280,
         20, 
         false, 
         false, 
         false, 
         '.cases__button--prev--mobile', 
         '.cases__button--next--mobile', 
         'cases__button--small--inactive'
    );

});