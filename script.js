document.addEventListener('DOMContentLoaded', function () {

    // ==============================
    // FORMULÁRIO 3D FLUTUANTE DRAGGABLE
    // ==============================
    var formOverlay = document.getElementById('formOverlay');
    var formBox = formOverlay.querySelector('.form-box');
    var cadastroForm = document.getElementById('cadastroForm');
    var telefoneInput = document.getElementById('telefone');
    var formSubmitBtn = document.getElementById('formSubmitBtn');

    // --- Posição inicial aleatória ---
    var fw = 340, fh = 420;
    var posX = Math.random() * (window.innerWidth - fw - 20) + 10;
    var posY = Math.random() * (window.innerHeight - fh - 20) + 10;
    posX = Math.max(10, Math.min(posX, window.innerWidth - fw - 10));
    posY = Math.max(10, Math.min(posY, window.innerHeight - fh - 10));
    formOverlay.style.left = posX + 'px';
    formOverlay.style.top = posY + 'px';

    // --- Movimento flutuante aleatório ---
    var velX = (Math.random() * 1.2 + 0.4) * (Math.random() < 0.5 ? 1 : -1);
    var velY = (Math.random() * 1.2 + 0.4) * (Math.random() < 0.5 ? 1 : -1);
    var isFloating = true;
    var isDragging = false;
    var isFilling = false;
    var animFrameId;

    function floatForm() {
        if (!isFloating || isDragging || isFilling) {
            animFrameId = requestAnimationFrame(floatForm);
            return;
        }

        posX += velX;
        posY += velY;

        var maxX = window.innerWidth - formOverlay.offsetWidth - 5;
        var maxY = window.innerHeight - formOverlay.offsetHeight - 5;

        if (posX <= 5) { posX = 5; velX = Math.abs(velX); }
        if (posX >= maxX) { posX = maxX; velX = -Math.abs(velX); }
        if (posY <= 5) { posY = 5; velY = Math.abs(velY); }
        if (posY >= maxY) { posY = maxY; velY = -Math.abs(velY); }

        formOverlay.style.left = posX + 'px';
        formOverlay.style.top = posY + 'px';

        animFrameId = requestAnimationFrame(floatForm);
    }
    animFrameId = requestAnimationFrame(floatForm);

    // --- Drag & Drop ---
    var dragOffsetX = 0, dragOffsetY = 0;

    formOverlay.addEventListener('mousedown', function (e) {
        if (isFilling) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'LABEL') return;
        isDragging = true;
        dragOffsetX = e.clientX - posX;
        dragOffsetY = e.clientY - posY;
        formOverlay.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        posX = e.clientX - dragOffsetX;
        posY = e.clientY - dragOffsetY;
        var maxX = window.innerWidth - formOverlay.offsetWidth - 5;
        var maxY = window.innerHeight - formOverlay.offsetHeight - 5;
        posX = Math.max(5, Math.min(posX, maxX));
        posY = Math.max(5, Math.min(posY, maxY));
        formOverlay.style.left = posX + 'px';
        formOverlay.style.top = posY + 'px';
    });

    document.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            formOverlay.style.cursor = isFilling ? 'default' : 'grab';
        }
    });

    // --- Touch drag ---
    formOverlay.addEventListener('touchstart', function (e) {
        if (isFilling) return;
        var t = e.target;
        if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'BUTTON' || t.tagName === 'LABEL') return;
        isDragging = true;
        var touch = e.touches[0];
        dragOffsetX = touch.clientX - posX;
        dragOffsetY = touch.clientY - posY;
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        var touch = e.touches[0];
        posX = touch.clientX - dragOffsetX;
        posY = touch.clientY - dragOffsetY;
        var maxX = window.innerWidth - formOverlay.offsetWidth - 5;
        var maxY = window.innerHeight - formOverlay.offsetHeight - 5;
        posX = Math.max(5, Math.min(posX, maxX));
        posY = Math.max(5, Math.min(posY, maxY));
        formOverlay.style.left = posX + 'px';
        formOverlay.style.top = posY + 'px';
    }, { passive: true });

    document.addEventListener('touchend', function () {
        isDragging = false;
    });

    // --- Para de flutuar ao interagir com campos ---
    var formInputs = cadastroForm.querySelectorAll('input, select');
    formInputs.forEach(function (inp) {
        inp.addEventListener('focus', function () {
            isFilling = true;
            formOverlay.classList.add('filling');
        });
    });

    // Máscara de telefone
    telefoneInput.addEventListener('input', function () {
        var v = this.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 6) {
            this.value = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
        } else if (v.length > 2) {
            this.value = '(' + v.slice(0, 2) + ') ' + v.slice(2);
        } else if (v.length > 0) {
            this.value = '(' + v;
        }
    });

    // Envio do formulário
    cadastroForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var nome = document.getElementById('nome');
        var telefone = document.getElementById('telefone');
        var estado = document.getElementById('estado');
        var cidade = document.getElementById('cidade');
        var email = document.getElementById('email');

        [nome, telefone, estado, cidade, email].forEach(function (el) {
            el.classList.remove('invalid');
        });

        var valid = true;
        if (!nome.value.trim()) { nome.classList.add('invalid'); valid = false; }
        if (telefone.value.replace(/\D/g, '').length < 10) { telefone.classList.add('invalid'); valid = false; }
        if (!estado.value) { estado.classList.add('invalid'); valid = false; }
        if (!cidade.value.trim()) { cidade.classList.add('invalid'); valid = false; }
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.classList.add('invalid'); valid = false; }

        if (!valid) return;

        formSubmitBtn.disabled = true;
        formSubmitBtn.textContent = 'Enviando...';

        var estadoTexto = estado.options[estado.selectedIndex].text;

        var formData = new FormData();
        formData.append('nome', nome.value.trim());
        formData.append('telefone', telefone.value.trim());
        formData.append('cidade_estado', cidade.value.trim() + '/' + estadoTexto);
        formData.append('email', email.value.trim());

        fetch('https://formtorch.com/f/iqv46bhy5k', {
            method: 'POST',
            body: formData
        }).then(function () {
            showSuccess();
        }).catch(function () {
            showSuccess();
        });
    });

    function showSuccess() {
        isFloating = false;
        cancelAnimationFrame(animFrameId);
        formBox.innerHTML = '<div class="form-success-msg">' +
            '<div class="success-icon">✅</div>' +
            '<h3>Enviado com sucesso!</h3>' +
            '<p>Em breve entraremos em contato.</p>' +
            '</div>';
        setTimeout(function () {
            formOverlay.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            formOverlay.style.opacity = '0';
            formOverlay.style.transform = 'scale(0.8)';
            setTimeout(function () {
                formOverlay.classList.add('hidden');
            }, 600);
        }, 2000);
    }

    // ==============================
    // ABAS PRINCIPAIS (Currículo / Empreendedorismo)
    // ==============================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetTab = this.getAttribute('data-tab');
            tabBtns.forEach(function (b) { b.classList.remove('active'); });
            tabContents.forEach(function (c) { c.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // ==============================
    // ABAS DOS MODELOS DE CURRÍCULO
    // ==============================
    var modeloTabBtns = document.querySelectorAll('.modelo-tab-btn');
    var modeloPanels = document.querySelectorAll('.modelo-panel');

    modeloTabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetModelo = this.getAttribute('data-modelo');
            modeloTabBtns.forEach(function (b) { b.classList.remove('active'); });
            modeloPanels.forEach(function (p) { p.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById(targetModelo).classList.add('active');
        });
    });

    // ==============================
    // MODAL — CARD EXPANDIDO
    // ==============================
    var modal = document.getElementById('cardModal');
    var modalBody = modal.querySelector('.modal-body');
    var modalClose = modal.querySelector('.modal-close');

    // Abrir modal ao clicar nos cards
    var allCards = document.querySelectorAll('.grid-cards .card, .tip-item, .lei-item, .step-content');
    allCards.forEach(function (card) {
        card.addEventListener('click', function () {
            modalBody.innerHTML = this.innerHTML;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Fechar com botão X
    modalClose.addEventListener('click', function () {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Fechar clicando fora do modal
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
