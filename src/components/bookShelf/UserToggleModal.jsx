// components/UserToggleModal.jsx
import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db as firestore } from "./firebase-config";
import { useTheme } from "../../ThemeContext";

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

  // Fetch authorized users from whitelist collection
  useEffect(() => {
    const fetchAuthorizedUsers = async () => {
      if (!isOpen || !currentUser) return;

      setFetchingUsers(true);
      try {
        // Get all documents from whitelist collection
        const whitelistSnapshot = await getDocs(
          collection(firestore, "whitelist")
        );

        const users = [];
        whitelistSnapshot.forEach((doc) => {
          const email = doc.id; // Document ID is the email
          const data = doc.data();

          // Only include if authorized is true
          if (data.authorized === true) {
            users.push({
              email: email,
              name: email.split("@")[0], // Extract username from email
              isAdmin: email === "ducenhandee@gmail.com", // Mark admin
            });
          }
        });

        // Sort users - admin first, then alphabetically
        users.sort((a, b) => {
          if (a.isAdmin && !b.isAdmin) return -1;
          if (!a.isAdmin && b.isAdmin) return 1;
          return a.email.localeCompare(b.email);
        });

        setAuthorizedUsers(users);
      } catch (error) {
        console.error("Error fetching authorized users:", error);
        // Fallback to current user only if fetch fails
        setAuthorizedUsers([
          {
            email: currentUser.email,
            name: currentUser.email.split("@")[0],
            isAdmin: currentUser.email === "ducenhandee@gmail.com",
          },
        ]);
      }
      setFetchingUsers(false);
    };

    fetchAuthorizedUsers();
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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

  if (!isOpen) return null;

  const bgDark = theme === "dark" ? "bg-dark text-light" : "";
  const currentViewingEmail = getCurrentViewingEmail();

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleBackdropClick}>
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content ${bgDark}`}>
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center">
              <Users className="me-2" size={20} />
              Switch User Account
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"></button>
          </div>
          <div className="modal-body">
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
                  role="status"></div>
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
                      } ${bgDark}`}
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
                <strong>Note:</strong> This feature is only available for admin
                users. Switching users will reload the bookshelf data for the
                selected account.
                <br />
                <strong>Users shown:</strong> {authorizedUsers.length}{" "}
                authorized user(s)
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserToggleModal;
