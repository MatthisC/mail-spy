const mailInstances = [];

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

const getMailPos = (instance, id) => {};

const addMailInstance = ({ socketID, ownerID }) => {
    if (!ownerID) {
        return {
            error: 'The socket must have an ownerID',
        };
    }

    const existingInstance = mailInstances.find(
        (mailInstance) => mailInstance.ownerID === ownerID
    );

    if (existingInstance) {
        return { error: 'ownerID already used' };
    }

    const instance = { socketID, ownerID, mails: [] };

    mailInstances.push(instance);
    return { instance };
};

const removeMailInstance = (ownerID) => {
    const index = mailInstances.findIndex(
        (mailInstance) => mailInstance.ownerID === ownerID
    );

    if (index != -1) {
        return mailInstances.splice(index, 1)[0];
    }
};

const addMailToInstance = (ownerID) => {
    const index = mailInstances.findIndex(
        (mailInstance) => mailInstance.ownerID === ownerID
    );
    if (index != -1) {
        mailInstances[index].mails.push({ nbSeen: 0, id: random() });
        return mailInstances[index];
    }
};

const openMail = (socketID, mailID) => {
    const index = mailInstances.findIndex(
        (mailInstance) => mailInstance.socketID === socketID
    );
    if (index != -1) {
        const indexMail = mailInstances[index].mails.findIndex(
            (mail) => mail.id === mailID
        );
        if (indexMail != -1) {
            mailInstances[index].mails[indexMail].nbSeen += 1;
            return mailInstances[index];
        }
        return false;
    }

    return false;
};

const resetMail = (ownerID, mailID) => {
    const index = mailInstances.findIndex(
        (mailInstance) => mailInstance.ownerID === ownerID
    );
    if (index != -1) {
        const indexMail = mailInstances[index].mails.findIndex(
            (mail) => mail.id === mailID
        );
        if (indexMail != -1) {
            mailInstances[index].mails[indexMail].nbSeen = 0;
            return mailInstances[index]
        }
    }
};

const removeMail = (ownerID, mailID) => {
    const index = mailInstances.findIndex(
        (mailInstance) => mailInstance.ownerID === ownerID
    );
    if (index != -1) {
        const indexMail = mailInstances[index].mails.findIndex(
            (mail) => mail.id === mailID
        );
        if (indexMail != -1) {
            mailInstances[index].mails.splice(indexMail, 1);
            return mailInstances[index]
        }
       
    }
};

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required',
        };
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    if (existingUser) {
        return {
            error: 'Username already used :/',
        };
    }
    const user = { id, username, room };
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index != -1) {
        return users.splice(index, 1)[0];
    }
};

const findUser = (id) => {
    return users.find((user) => {
        return user.id === id;
    });
};

const getUserInRoom = (room) => {
    return users.filter((user) => {
        return user.room === room;
    });
};

module.exports = {
    addMailInstance,
    removeMailInstance,
    addMailToInstance,
    removeMailInstance,
    openMail,
    resetMail,
    removeMail,
};
