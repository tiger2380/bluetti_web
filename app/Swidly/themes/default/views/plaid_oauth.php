{@include 'inc/header'}
<div style="font-size: 3rem;">
    <section class="py-5 mt-5">
        <div class="container">
            <h1>Plaid OAuth</h1>
            <button id="connect" class="btn btn-primary">Connect My Bank</button>
        </div>
    </section>
</div>

<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
<script type="text/javascript">
const connectBtn = document.getElementById('connect');

connectBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const response = await fetch('/api/plaid/link/token/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.error != null) {
        throw new Error(data.error);
    }

    const linkToken = data.link_token;

    localStorage.setItem('link_token', linkToken);

    const handler = Plaid.create({
        token: linkToken,
        onSuccess: async (public_token, metadata) => {
            const response = await fetch('/api/plaid/public_token/exchange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    public_token: public_token
                })
            });

            console.log(await response.json());
        },
        onLoad: () => {},
        onExit: (err, metadata) => {
            if (err != null) {
                console.log(err);
            }
        },
        onEvent: (eventName, metadata) => {
            console.log(eventName, metadata);
        }
    });
    handler.open();
}, false);
</script>
{@include 'inc/footer'}