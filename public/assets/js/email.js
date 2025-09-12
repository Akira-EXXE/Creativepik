
const form = document.querySelector('.contato-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

   
    const nome = form.querySelector('input[type="text"]').value;
    const assunto = form.querySelectorAll('input[type="text"]')[1].value;
    const email = form.querySelector('input[type="email"]').value;
    const mensagem = form.querySelector('textarea').value;

    
    const data = {
        name: nome,
        subject: assunto,
        email: email,
        message: mensagem,
        _replyto: 'isis.passos10@gmail.com' 
    };

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Mensagem enviada com sucesso!');
            form.reset(); 
        } else {
            alert('Erro ao enviar a mensagem. Tente novamente mais tarde.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar a mensagem. Verifique sua conexão.');
    }
});
