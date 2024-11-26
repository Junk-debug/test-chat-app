let users = [];

const findUser = (user) => {
  return users.find(
    ({ name, roomId }) => name === user.name && roomId === user.roomId
  );
};

const addUser = (user) => {
  const username = user.name;
  const roomId = user.roomId;
  const isExist = findUser(user);

  if (!isExist) {
    users.push({ name: username, roomId });
  }

  console.log(users);

  const currentUser = isExist || user;

  return { isExist, user: currentUser };
};

const getRoomUsers = (roomId) => users.filter((user) => user.roomId === roomId);

const removeUser = (user) => {
  const isExist = findUser(user);

  if (isExist) {
    users = users.filter(
      ({ name, roomId }) => name === user.name && roomId !== user.roomId
    );
  }

  return isExist;
};

module.exports = { addUser, findUser, getRoomUsers, removeUser };
