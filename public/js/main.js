const socket = io();

let currentInstance;

const $mails = document.getElementById('mails');
const mailTemplate = document.getElementById('mail-template').innerHTML;

const random = (length = 8) => {
    // Source of this random function : https://attacomsian.com/blog/javascript-generate-random-string

    // Declare all characters
    let chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
};

const userID = random(32);

// this userID is a "secret" : it allows you to know how many times the email was opened,
// and you can reset this count. This userID is never sent to the client via the image, so
// the client can't know the statistics of an email you sent.

// In a real project, this userID would be stored in a database, but since this is a free
// project, I am using sockets connexions. The problem is that you can't disconnect until
// mail is opened (which means you can't close your tab).

// BUTTONS FUNCTIONS

const addMail = () => {
    socket.emit('addMail', userID);
};

const resetMail = (mailID) => {
    socket.emit('resetMail', {ownerID: userID, mailID})
}

const removeMail = (mailID) => {
    socket.emit('removeMail', {ownerID: userID, mailID})
}

const copyText = (id) => {
    // Source of this function (I changed it a little bit) : https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    let input = document.getElementById(id);
    input.disabled = false
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    /* Copy the text inside the text field */
    document.execCommand('copy');
    input.disabled = true
};

// SOCKET FUNCTIONS

socket.on('update', (instance) => {
    currentInstance = instance;

    instance.mails.forEach((e) => {
        document.getElementById(e.id + "TO").innerText = e.nbSeen 
    });
});

socket.on('addMail', (mail) => {
    currentInstance.mails.push({id: mail.id, nbSeen: mail.nbSeen})
    const html = Mustache.render(mailTemplate, {
        mailPos: currentInstance.mails.length,
        mailID: mail.id,
        URL: `${window.location.protocol}//${window.location.host}/mailImage/${currentInstance.socketID}/${mail.id}`,
        timeOpened: mail.nbSeen,
    });

    $mails.insertAdjacentHTML('beforeend', html);

})

socket.on('fullReload', (instance) => {
    document.getElementById('mails').innerHTML = ''
    currentInstance = instance
    for (let i=0; i<instance.mails.length; i++) {
        const html = Mustache.render(mailTemplate, {
            mailPos: i + 1,
            mailID: currentInstance.mails[i].id,
            URL: `${window.location.protocol}//${window.location.host}/mailImage/${currentInstance.socketID}/${currentInstance.mails[i].id}`,
            timeOpened: currentInstance.mails[i].nbSeen,
        });
    
        $mails.insertAdjacentHTML('beforeend', html);
    }
})

socket.emit('join', { ownerID: userID }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
