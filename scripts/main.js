
const submitBtn = document.getElementById('submitBtn');

async function getMessage() {
    console.log('clicked');
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello!" }],
            max_tokens: 100,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json();
        console.log(data);
    }
    catch (error) {
        console.log(error);
    }
}

// const populateMessage = (data) => {
//     console.log(data);
//     const message = data.usage.choices.message.content;
//     console.log(message);
//     const messageDiv = document.getElementById('roadmapGoesHere');
//     messageDiv.innerHTML = message;
// }

submitBtn.addEventListener('click', getMessage);