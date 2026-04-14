document.addEventListener('DOMContentLoaded', function () {
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
