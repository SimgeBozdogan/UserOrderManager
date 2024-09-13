export const fetchUsers = async () => {
    const response = await fetch('https://dummyjson.com/users');
    return response.json();
};

export const fetchUserById = async (id) => {
    const response = await fetch(`https://dummyjson.com/users/${id}`);
    return response.json();
};

export const saveUser = async (user) => {
    const response = await fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    return response.json();
};

export const updateUser = async (id, user) => {
    const response = await fetch(`https://dummyjson.com/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    return response.json();
};

export const deleteUser = async (id) => {
    await fetch(`https://dummyjson.com/users/${id}`, { method: 'DELETE' });
};
