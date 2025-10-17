(function() {
    emailjs.init("gNgbsBK2JjwW8c28X");
})();

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contatoForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const serviceID = "service_ef66j6w";
        const templateID = "template_mh4ll6x";

        document.getElementById("time").value = new Date().toLocaleString("pt-BR", {
        dateStyle: "full",
        timeStyle: "short"
        });

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
                form.reset();
            })
            .catch((error) => {
                console.error("Erro:", error);
                alert("Erro ao enviar mensagem. Tente novamente mais tarde.");
            });
    });
});