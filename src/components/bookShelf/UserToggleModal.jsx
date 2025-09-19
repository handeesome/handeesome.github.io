import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useTheme } from "../../ThemeContext";
import Modal from "../ui/Modal";
import { getUserList, getDisplayNameFromEmail } from "../../utils/userUtils";

const UserToggleModal = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  currentViewingUserEmail,
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // Fetch authorized users using userUtils
  useEffect(() => {
    const loadAuthorizedUsers = async () => {
      if (!isOpen || !currentUser) return;

      setFetchingUsers(true);
      try {
        const usersList = await getUserList();
        const userEmails = usersList.map((user) => user.id);

        // Transform emails into user objects with display names
        const users = userEmails.map((email) => ({
          email,
          name: getDisplayNameFromEmail(email),
          // Mark the admin user - adjust this logic as needed
          isAdmin:
            email === "ducenhandee@gmail.com" || email === currentUser?.email,
        }));

        setAuthorizedUsers(users);
      } catch (error) {
        console.error("Error loading authorized users:", error);
        setAuthorizedUsers([]);
      }
      setFetchingUsers(false);
    };

    loadAuthorizedUsers();
  }, [isOpen, currentUser]);

  const handleSwitchUser = async (userEmail) => {
    setLoading(true);
    try {
      await onSwitchUser(userEmail);
      onClose();
    } catch (error) {
      console.error("Error switching user:", error);
      alert("Failed to switch user. Please try again.");
    }
    setLoading(false);
  };

  // Get the currently viewing email (either logged in user or user being viewed by admin)
  const getCurrentViewingEmail = () => {
    if (
      currentViewingUserEmail &&
      currentUser?.email === "ducenhandee@gmail.com"
    ) {
      return currentViewingUserEmail;
    }
    return currentUser?.email;
  };

  const currentViewingEmail = getCurrentViewingEmail();

  const modalFooter = (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={onClose}
      disabled={loading}>
      Cancel
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="d-flex align-items-center">
          <Users className="me-2" size={20} />
          Switch User Account
        </div>
      }
      size="md"
      footer={modalFooter}>
      <div className="mb-3">
        <small className="text-muted">
          Current User: <strong>{currentUser?.email}</strong>
          {currentViewingUserEmail && (
            <>
              <br />
              Viewing: <strong>{currentViewingUserEmail}</strong>
            </>
          )}
        </small>
      </div>

      {fetchingUsers ? (
        <div className="text-center py-3">
          <div
            className="spinner-border spinner-border-sm me-2"
            role="status"
          />
          Loading authorized users...
        </div>
      ) : (
        <div className="list-group">
          {authorizedUsers.length === 0 ? (
            <div className="text-center py-3 text-muted">
              No authorized users found
            </div>
          ) : (
            authorizedUsers.map((user) => (
              <button
                key={user.email}
                type="button"
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                  currentViewingEmail === user.email ? "active" : ""
                }`}
                onClick={() => handleSwitchUser(user.email)}
                disabled={loading || currentViewingEmail === user.email}>
                <div>
                  <div className="fw-medium">{user.name}</div>
                  <small className="text-muted">{user.email}</small>
                </div>
                <div>
                  {user.isAdmin && (
                    <span className="badge bg-warning text-dark me-2">
                      Admin
                    </span>
                  )}
                  {currentViewingEmail === user.email && (
                    <span className="badge bg-success">Current</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}

      <div className="alert alert-info mt-3" role="alert">
        <small>
          <strong>Note:</strong> This feature is only available for admin users.
          Switching users will reload the bookshelf data for the selected
          account.
          <br />
          <strong>Users shown:</strong> {authorizedUsers.length} authorized
          user(s)
        </small>
      </div>
    </Modal>
  );
};

export default UserToggleModal;
