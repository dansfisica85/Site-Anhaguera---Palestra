document.addEventListener('DOMContentLoaded', function () {

    // ==============================
    // FORMULÁRIO DE CADASTRO OBRIGATÓRIO
    // ==============================
    var formOverlay = document.getElementById('formOverlay');
    var cadastroForm = document.getElementById('cadastroForm');
    var telefoneInput = document.getElementById('telefone');
    var formSubmitBtn = document.getElementById('formSubmitBtn');

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

    cadastroForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var nome = document.getElementById('nome');
        var telefone = document.getElementById('telefone');
        var estado = document.getElementById('estado');
        var cidade = document.getElementById('cidade');
        var email = document.getElementById('email');

        // Limpar estados de erro
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
        }).then(function (response) {
            formOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }).catch(function () {
            formOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });

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
