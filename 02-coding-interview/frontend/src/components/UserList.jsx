import React from 'react';
import './UserList.css';

function UserList({ users = [] }) {
  return (
    <div className="user-list">
      <h3>Connected Users</h3>
      {users.length === 0 ? (
        <p className="no-users">No users yet</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;