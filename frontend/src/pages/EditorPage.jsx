import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  EditorContent,
  useEditor
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  TextStyle,
  FontSize
} from "@tiptap/extension-text-style";

import api from "../services/api";

const CURRENT_USER_KEY =
  "collabdocs_current_user";

function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [currentUserId, setCurrentUserId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [sharing, setSharing] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize
    ],

    content: "",

    editorProps: {
      attributes: {
        class:
          "document-editor"
      }
    }
  });

  /*
   * Get the current demo user.
   */
  useEffect(() => {
    const savedUser =
      localStorage.getItem(
        CURRENT_USER_KEY
      );

    if (!savedUser) {
      navigate("/");
      return;
    }

    try {
      const user =
        JSON.parse(savedUser);

      setCurrentUserId(
        user._id
      );
    } catch {
      localStorage.removeItem(
        CURRENT_USER_KEY
      );

      navigate("/");
    }
  }, [navigate]);

  /*
   * Load document after we know
   * which user is viewing it.
   */
  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    loadDocument();
    loadUsers();
  }, [id, currentUserId]);

  /*
   * Load saved content into editor.
   */
  useEffect(() => {
    if (!editor || !document) {
      return;
    }

    editor.commands.setContent(
      document.content
    );
  }, [
    editor,
    document
  ]);

  const loadDocument =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            `/documents/${id}`,
            {
              params: {
                userId:
                  currentUserId
              }
            }
          );

        const loadedDocument =
          response.data;

        setDocument(
          loadedDocument
        );

        setTitle(
          loadedDocument.title
        );
      } catch (error) {
        console.error(
          "Failed to load document:",
          error
        );

        if (
          error.response
            ?.status === 403
        ) {
          setError(
            "You do not have access to this document."
          );
        } else if (
          error.response
            ?.status === 404
        ) {
          setError(
            "Document not found."
          );
        } else {
          setError(
            "Failed to load document."
          );
        }
      } finally {
        setLoading(false);
      }
    };

  const loadUsers =
    async () => {
      try {
        const response =
          await api.get(
            "/users"
          );

        setUsers(
          response.data
        );
      } catch (error) {
        console.error(
          "Failed to load users:",
          error
        );
      }
    };

  const saveDocument =
    async () => {
      if (!editor) {
        return;
      }

      try {
        setSaving(true);
        setMessage("");
        setError("");

        const response =
          await api.put(
            `/documents/${id}`,
            {
              userId:
                currentUserId,
              title:
                title.trim() ||
                "Untitled Document",
              content:
                editor.getJSON()
            }
          );

        setDocument(
          response.data
        );

        setTitle(
          response.data.title
        );

        setMessage(
          "Document saved successfully."
        );

        setTimeout(() => {
          setMessage("");
        }, 2000);
      } catch (error) {
        console.error(
          "Failed to save document:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Failed to save document."
        );
      } finally {
        setSaving(false);
      }
    };

  const shareDocument =
    async () => {
      if (!selectedUserId) {
        setError(
          "Please select a user to share with."
        );

        return;
      }

      try {
        setSharing(true);
        setMessage("");
        setError("");

        const response =
          await api.post(
            `/documents/${id}/share`,
            {
              userId:
                currentUserId,
              targetUserId:
                selectedUserId
            }
          );

        setDocument(
          response.data
        );

        setSelectedUserId(
          ""
        );

        setMessage(
          "Document shared successfully."
        );

        setTimeout(() => {
          setMessage("");
        }, 2500);
      } catch (error) {
        console.error(
          "Failed to share document:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Failed to share document."
        );
      } finally {
        setSharing(false);
      }
    };

  const handleFileImport =
    (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      setMessage("");
      setError("");

      const fileName =
        file.name.toLowerCase();

      const isSupported =
        fileName.endsWith(
          ".txt"
        ) ||
        fileName.endsWith(
          ".md"
        );

      if (!isSupported) {
        setError(
          "Unsupported file type. Please select a .txt or .md file."
        );

        event.target.value =
          "";

        return;
      }

      const maxSize =
        1024 * 1024;

      if (file.size > maxSize) {
        setError(
          "File is too large. Maximum size is 1 MB."
        );

        event.target.value =
          "";

        return;
      }

      const reader =
        new FileReader();

      reader.onload = () => {
        const text =
          reader.result;

        if (
          typeof text !==
          "string"
        ) {
          setError(
            "Unable to read the selected file."
          );

          return;
        }

        editor
          .chain()
          .focus()
          .setContent(
            `<p>${escapeHtml(
              text
            ).replace(
              /\n/g,
              "</p><p>"
            )}</p>`
          )
          .run();

        const importedTitle =
          file.name.replace(
            /\.(txt|md)$/i,
            ""
          );

        setTitle(
          importedTitle
        );

        setMessage(
          `${file.name} imported successfully. Click Save to persist it.`
        );

        event.target.value =
          "";
      };

      reader.onerror = () => {
        setError(
          "Failed to read the selected file."
        );

        event.target.value =
          "";
      };

      reader.readAsText(
        file
      );
    };

  const escapeHtml = (
    text
  ) => {
    return text
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  };

  const isOwner =
    document?.owner?._id ===
    currentUserId;

  const availableUsers =
    users.filter((user) => {
      const alreadyShared =
        document?.sharedWith?.some(
          (sharedUser) =>
            sharedUser._id ===
            user._id
        );

      return (
        user._id !==
          currentUserId &&
        !alreadyShared
      );
    });

  if (loading) {
    return (
      <div className="editor-page">
        <p>
          Loading document...
        </p>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="editor-page">
        <p>
          <strong>
            Error:
          </strong>{" "}
          {error}
        </p>

        <button
          onClick={() =>
            navigate("/")
          }
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="editor-page">
        <p>
          Loading editor...
        </p>
      </div>
    );
  }

  return (
    <div className="editor-page">

      <header className="editor-header">

        <button
          onClick={() =>
            navigate("/")
          }
        >
          ← Dashboard
        </button>

        <input
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(
              event.target.value
            )
          }
          placeholder="Document title"
          aria-label="Document title"
        />

        <button
          onClick={saveDocument}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save"}
        </button>

      </header>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <section className="sharing-panel">

        <div className="sharing-header">

          <div>
            <strong>
              Owner:
            </strong>{" "}
            {document.owner?.name}
          </div>

          {isOwner && (
            <div className="share-controls">

              <select
                value={
                  selectedUserId
                }
                onChange={(event) =>
                  setSelectedUserId(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select user
                </option>

                {availableUsers.map(
                  (user) => (
                    <option
                      key={user._id}
                      value={
                        user._id
                      }
                    >
                      {user.name} (
                      {user.email})
                    </option>
                  )
                )}
              </select>

              <button
                onClick={
                  shareDocument
                }
                disabled={
                  sharing ||
                  !selectedUserId
                }
              >
                {sharing
                  ? "Sharing..."
                  : "Share"}
              </button>

            </div>
          )}

        </div>

        <div className="shared-users">

          <strong>
            Shared with:
          </strong>

          {document.sharedWith
            ?.length === 0 ? (
            <span>
              {" "}
              No one
            </span>
          ) : (
            <div className="shared-user-list">

              {document.sharedWith.map(
                (user) => (
                  <span
                    className="shared-user"
                    key={
                      user._id
                    }
                  >
                    {user.name}
                  </span>
                )
              )}

            </div>
          )}

        </div>

      </section>

      <div className="editor-toolbar">

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={
            editor.isActive(
              "bold"
            )
              ? "active"
              : ""
          }
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={
            editor.isActive(
              "italic"
            )
              ? "active"
              : ""
          }
        >
          <em>I</em>
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }
          className={
            editor.isActive(
              "underline"
            )
              ? "active"
              : ""
          }
        >
          <u>U</u>
        </button>

        <span className="toolbar-divider" />

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1
              })
              .run()
          }
          className={
            editor.isActive(
              "heading",
              { level: 1 }
            )
              ? "active"
              : ""
          }
        >
          H1
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2
              })
              .run()
          }
          className={
            editor.isActive(
              "heading",
              { level: 2 }
            )
              ? "active"
              : ""
          }
        >
          H2
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3
              })
              .run()
          }
          className={
            editor.isActive(
              "heading",
              { level: 3 }
            )
              ? "active"
              : ""
          }
        >
          H3
        </button>

        <span className="toolbar-divider" />

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className={
            editor.isActive(
              "bulletList"
            )
              ? "active"
              : ""
          }
        >
          • List
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className={
            editor.isActive(
              "orderedList"
            )
              ? "active"
              : ""
          }
        >
          1. List
        </button>

        <span className="toolbar-divider" />

        <label
          htmlFor="font-size"
          className="font-size-label"
        >
          Size:
        </label>

        <select
          id="font-size"
          defaultValue=""
          onChange={(event) => {
            const size =
              event.target.value;

            if (!size) {
              return;
            }

            editor
              .chain()
              .focus()
              .setFontSize(size)
              .run();
          }}
        >
          <option value="">
            Select
          </option>

          <option value="12px">
            12
          </option>

          <option value="14px">
            14
          </option>

          <option value="16px">
            16
          </option>

          <option value="18px">
            18
          </option>

          <option value="20px">
            20
          </option>

          <option value="24px">
            24
          </option>

          <option value="28px">
            28
          </option>

          <option value="32px">
            32
          </option>
        </select>

        <span className="toolbar-divider" />

        <label
          htmlFor="file-import"
          className="file-import-button"
        >
          Import File
        </label>

        <input
          id="file-import"
          type="file"
          accept=".txt,.md,text/plain,text/markdown"
          onChange={
            handleFileImport
          }
          hidden
        />

      </div>

      <div className="file-info">
        Supported files:{" "}
        <strong>.txt</strong> and{" "}
        <strong>.md</strong> · Maximum
        size: <strong>1 MB</strong>
      </div>

      <main className="editor-container">

        <EditorContent
          editor={editor}
        />

      </main>

    </div>
  );
}

export default EditorPage;