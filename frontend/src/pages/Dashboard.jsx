import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

const CURRENT_USER_KEY = "collabdocs_current_user";

function Dashboard() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(currentUser)
    );

    loadDocuments();
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      const fetchedUsers = response.data;

      setUsers(fetchedUsers);

      const savedUser =
        localStorage.getItem(CURRENT_USER_KEY);

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);

          const matchingUser = fetchedUsers.find(
            (user) => user._id === parsedUser._id
          );

          if (matchingUser) {
            setCurrentUser(matchingUser);
            return;
          }
        } catch {
          localStorage.removeItem(CURRENT_USER_KEY);
        }
      }

      const pavan = fetchedUsers.find(
        (user) =>
          user.email ===
          "pavankumarneteti717@gmail.com"
      );

      setCurrentUser(pavan || fetchedUsers[0]);
    } catch (error) {
      console.error("Failed to load users:", error);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setError("");

      const response = await api.get("/documents", {
        params: {
          userId: currentUser._id
        }
      });

      setDocuments(response.data);
    } catch (error) {
      console.error(
        "Failed to load documents:",
        error
      );

      setError("Failed to load documents.");
    }
  };

  const createDocument = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await api.post("/documents", {
        title: "Untitled Document",
        owner: currentUser._id
      });

      navigate(`/documents/${response.data._id}`);
    } catch (error) {
      console.error(
        "Failed to create document:",
        error
      );

      setError("Failed to create document.");
    } finally {
      setCreating(false);
    }
  };

  const handleUserChange = (event) => {
    const selectedUser = users.find(
      (user) => user._id === event.target.value
    );

    if (selectedUser) {
      setCurrentUser(selectedUser);
    }
  };

  const openDocument = (documentId) => {
    navigate(`/documents/${documentId}`);
  };

  const ownedDocuments = documents.filter(
    (document) =>
      document.owner?._id === currentUser?._id
  );

  const sharedDocuments = documents.filter(
    (document) =>
      document.owner?._id !== currentUser?._id
  );

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <p>Loading CollabDocs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">

        <div className="brand-section">
          <div className="brand-icon">
            C
          </div>

          <div>
            <h1>CollabDocs</h1>
            <p>Collaborative document workspace</p>
          </div>
        </div>

        <div className="user-section">

          <span className="user-label">
            Viewing as
          </span>

          <select
            value={currentUser?._id || ""}
            onChange={handleUserChange}
            aria-label="Current user"
          >
            {users.map((user) => (
              <option
                key={user._id}
                value={user._id}
              >
                {user.name}
              </option>
            ))}
          </select>

        </div>

      </header>

      <main className="dashboard-content">

        <div className="dashboard-intro">

          <div>
            <h2>Your workspace</h2>

            <p>
              Create, edit and share documents
              with your team.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={createDocument}
            disabled={creating}
          >
            {creating
              ? "Creating..."
              : "+ New Document"}
          </button>

        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        <section className="documents-section">

          <div className="section-heading">
            <div>
              <h3>My Documents</h3>

              <span>
                {ownedDocuments.length}{" "}
                {ownedDocuments.length === 1
                  ? "document"
                  : "documents"}
              </span>
            </div>
          </div>

          {ownedDocuments.length === 0 ? (
            <div className="empty-state">

              <div className="empty-icon">
                +
              </div>

              <h4>No documents yet</h4>

              <p>
                Create your first document to
                get started.
              </p>

              <button
                className="secondary-button"
                onClick={createDocument}
                disabled={creating}
              >
                Create Document
              </button>

            </div>
          ) : (
            <div className="document-grid">

              {ownedDocuments.map((document) => (
                <button
                  className="document-card"
                  key={document._id}
                  onClick={() =>
                    openDocument(document._id)
                  }
                >
                  <div className="document-card-icon">
                    DOC
                  </div>

                  <div className="document-card-content">

                    <h4>
                      {document.title ||
                        "Untitled Document"}
                    </h4>

                    <p>
                      Owned by you
                    </p>

                    <span>
                      Updated{" "}
                      {formatDate(
                        document.updatedAt
                      )}
                    </span>

                  </div>

                  <span className="document-arrow">
                    →
                  </span>

                </button>
              ))}

            </div>
          )}

        </section>

        <section className="documents-section">

          <div className="section-heading">
            <div>
              <h3>Shared with me</h3>

              <span>
                {sharedDocuments.length}{" "}
                {sharedDocuments.length === 1
                  ? "document"
                  : "documents"}
              </span>
            </div>
          </div>

          {sharedDocuments.length === 0 ? (
            <div className="empty-state compact">

              <div className="empty-icon">
                ↔
              </div>

              <h4>No shared documents</h4>

              <p>
                Documents shared with you will
                appear here.
              </p>

            </div>
          ) : (
            <div className="document-grid">

              {sharedDocuments.map((document) => (
                <button
                  className="document-card"
                  key={document._id}
                  onClick={() =>
                    openDocument(document._id)
                  }
                >
                  <div className="document-card-icon shared">
                    DOC
                  </div>

                  <div className="document-card-content">

                    <h4>
                      {document.title ||
                        "Untitled Document"}
                    </h4>

                    <p>
                      Owner:{" "}
                      {document.owner?.name ||
                        "Unknown"}
                    </p>

                    <span>
                      Updated{" "}
                      {formatDate(
                        document.updatedAt
                      )}
                    </span>

                  </div>

                  <span className="document-arrow">
                    →
                  </span>

                </button>
              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;